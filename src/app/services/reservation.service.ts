import { Injectable } from '@angular/core';
import { Reservation, ReservationStatus, DashboardMetrics } from '../models/reservation.model';
import { StorageService } from './storage.service';
import { TableService } from './table.service';
import { NotificationService } from './notification.service';
import { INITIAL_RESERVATIONS, formatDateOffset } from '../data/initial-data';
import { ValidatorsUtil } from '../utils/validators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly STORAGE_KEY = 'dineflow_reservations';
  private reservationsSubject: BehaviorSubject<Reservation[]>;
  public reservations$: Observable<Reservation[]>;

  constructor(
    private storage: StorageService,
    private tableService: TableService,
    private notify: NotificationService
  ) {
    const existing = this.storage.get<Reservation[]>(this.STORAGE_KEY, []);
    const initial = existing && existing.length > 0 ? existing : INITIAL_RESERVATIONS;
    if (!existing || existing.length === 0) {
      this.storage.set(this.STORAGE_KEY, initial);
    }
    this.reservationsSubject = new BehaviorSubject<Reservation[]>(initial);
    this.reservations$ = this.reservationsSubject.asObservable();
  }

  getAll(): Reservation[] {
    return [...this.reservationsSubject.value];
  }

  getById(id: string): Reservation | undefined {
    return this.reservationsSubject.value.find((r) => r.id === id);
  }

  create(reservationData: Omit<Reservation, 'id' | 'createdAt'>): { success: boolean; message: string; reservation?: Reservation } {
    const table = this.tableService.getTableById(reservationData.tableId);
    if (!table) {
      return { success: false, message: 'Invalid table selected. Please select a valid table.' };
    }

    if (!ValidatorsUtil.hasSufficientCapacity(table, reservationData.guests)) {
      return {
        success: false,
        message: `Table ${table.number} holds up to ${table.capacity} guests, but ${reservationData.guests} guests were requested.`
      };
    }

    const all = this.getAll();
    const hasConflict = ValidatorsUtil.hasTimeConflict(
      all,
      reservationData.tableId,
      reservationData.date,
      reservationData.time
    );

    if (hasConflict) {
      return {
        success: false,
        message: `Conflict detected: Table ${table.number} already has an overlapping booking within 90 minutes on ${reservationData.date} at ${reservationData.time}.`
      };
    }

    const nextId = this.generateNextId(all);
    const newReservation: Reservation = {
      ...reservationData,
      id: nextId,
      createdAt: new Date().toISOString()
    };

    const updated = [newReservation, ...all];
    this.save(updated);

    // If reservation is for Today, sync table status to Reserved
    const todayStr = formatDateOffset(0);
    if (newReservation.date === todayStr && newReservation.status === 'Confirmed') {
      this.tableService.updateTableStatus(newReservation.tableId, 'Reserved');
    }

    this.notify.success(`Reservation ${nextId} confirmed for ${newReservation.customerName}!`);
    return { success: true, message: 'Reservation successfully created.', reservation: newReservation };
  }

  update(id: string, updates: Partial<Reservation>): { success: boolean; message: string } {
    const all = this.getAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, message: `Reservation ${id} not found.` };
    }

    const current = all[index];
    const candidateTableId = updates.tableId !== undefined ? updates.tableId : current.tableId;
    const candidateDate = updates.date !== undefined ? updates.date : current.date;
    const candidateTime = updates.time !== undefined ? updates.time : current.time;
    const candidateGuests = updates.guests !== undefined ? updates.guests : current.guests;

    const table = this.tableService.getTableById(candidateTableId);
    if (table && !ValidatorsUtil.hasSufficientCapacity(table, candidateGuests)) {
      return {
        success: false,
        message: `Table ${table.number} cannot seat ${candidateGuests} guests (max capacity is ${table.capacity}).`
      };
    }

    // Check conflict excluding current reservation
    const hasConflict = ValidatorsUtil.hasTimeConflict(
      all,
      candidateTableId,
      candidateDate,
      candidateTime,
      id
    );

    if (hasConflict) {
      return {
        success: false,
        message: `Conflict: Table ${table ? table.number : candidateTableId} is already booked at that time.`
      };
    }

    all[index] = { ...current, ...updates };
    this.save(all);
    this.notify.info(`Reservation ${id} updated successfully.`);
    return { success: true, message: 'Reservation updated.' };
  }

  cancel(id: string, reason?: string): { success: boolean; message: string } {
    const all = this.getAll();
    const target = all.find((r) => r.id === id);
    if (!target) {
      return { success: false, message: `Reservation ${id} not found.` };
    }

    target.status = 'Cancelled';
    if (reason) {
      target.specialRequests = (target.specialRequests ? target.specialRequests + ' | ' : '') + `Cancellation note: ${reason}`;
    }

    this.save(all);

    // Free up table if reservation was for today
    const todayStr = formatDateOffset(0);
    if (target.date === todayStr) {
      this.tableService.updateTableStatus(target.tableId, 'Available');
    }

    this.notify.warning(`Reservation ${id} has been cancelled.`);
    return { success: true, message: 'Reservation cancelled.' };
  }

  filterReservations(query?: string, dateFilter: string = 'All', statusFilter: string = 'All'): Reservation[] {
    const all = this.getAll();
    const today = formatDateOffset(0);
    const tomorrow = formatDateOffset(1);

    return all.filter((r) => {
      // Status filter
      if (statusFilter !== 'All' && r.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter === 'Today' && r.date !== today) {
        return false;
      }
      if (dateFilter === 'Tomorrow' && r.date !== tomorrow) {
        return false;
      }
      if (dateFilter === 'Upcoming' && r.date < today) {
        return false;
      }
      if (dateFilter === 'Past' && r.date >= today) {
        return false;
      }

      // Text query
      if (query && query.trim() !== '') {
        const q = query.toLowerCase().trim();
        const matchesName = r.customerName.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesPhone = r.phone.toLowerCase().includes(q);
        const matchesEmail = r.email.toLowerCase().includes(q);
        return matchesName || matchesId || matchesPhone || matchesEmail;
      }

      return true;
    });
  }

  getDashboardMetrics(): DashboardMetrics {
    const reservations = this.getAll();
    const tables = this.tableService.getAllTables();
    const todayStr = formatDateOffset(0);

    const todayReservations = reservations.filter((r) => r.date === todayStr);
    const todayConfirmed = todayReservations.filter((r) => r.status === 'Confirmed');
    const todayPending = todayReservations.filter((r) => r.status === 'Pending');

    const todayGuestsExpected = todayConfirmed.reduce((sum, r) => sum + Number(r.guests), 0);

    const availableTables = tables.filter((t) => t.status === 'Available').length;
    const reservedTables = tables.filter((t) => t.status === 'Reserved').length;
    const occupiedTables = tables.filter((t) => t.status === 'Occupied').length;
    const cleaningTables = tables.filter((t) => t.status === 'Cleaning').length;
    const cancelledBookings = reservations.filter((r) => r.status === 'Cancelled').length;
    const completedBookings = reservations.filter((r) => r.status === 'Completed').length;

    const utilizationRate = tables.length > 0
      ? Math.round(((reservedTables + occupiedTables) / tables.length) * 100)
      : 0;

    return {
      totalReservations: reservations.length,
      todayTotal: todayReservations.length,
      todayConfirmed: todayConfirmed.length,
      todayPending: todayPending.length,
      todayGuestsExpected,
      totalTables: tables.length,
      availableTables,
      reservedTables,
      occupiedTables,
      cleaningTables,
      cancelledBookings,
      completedBookings,
      utilizationRate
    };
  }

  resetAllData(): void {
    const freshReservations = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
    this.save(freshReservations);
    this.tableService.resetTables();
    this.notify.info('Sample reservation register and table floor plan restored to factory seeds.');
  }

  private generateNextId(existing: Reservation[]): string {
    const numbers = existing
      .map((r) => {
        const match = r.id.match(/DF-(\d+)/);
        return match ? parseInt(match[1], 10) : 1000;
      })
      .filter((n) => !isNaN(n));

    const max = numbers.length > 0 ? Math.max(...numbers) : 1000;
    return `DF-${max + 1}`;
  }

  private save(reservations: Reservation[]): void {
    this.reservationsSubject.next(reservations);
    this.storage.set(this.STORAGE_KEY, reservations);
  }
}
