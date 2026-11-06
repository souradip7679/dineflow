import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { TableService } from '../../services/table.service';
import { NotificationService } from '../../services/notification.service';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { Table } from '../../models/table.model';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { Time12Pipe } from '../../shared/pipes/time12.pipe';
import { SeatsLabelPipe } from '../../shared/pipes/seats-label.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FriendlyDatePipe,
    Time12Pipe,
    SeatsLabelPipe,
    StatusBadgeComponent,
    ModalDialogComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  searchQuery = '';
  dateFilter = 'All';
  statusFilter = 'All';

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  tables: Table[] = [];

  statusCounts = {
    all: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  };

  // Edit Modal State
  isEditModalOpen = false;
  editForm: Partial<Reservation> = {};
  editingReservationId = '';

  // Cancel Modal State
  isCancelModalOpen = false;
  cancellingReservation: Reservation | null = null;
  cancelReason = '';

  constructor(
    private reservationService: ReservationService,
    private tableService: TableService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();
    this.refresh();
  }

  refresh(): void {
    this.reservations = this.reservationService.getAll();
    this.updateStatusCounts();
    this.filteredReservations = this.reservationService.filterReservations(
      this.searchQuery,
      this.dateFilter,
      this.statusFilter
    );
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.refresh();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.dateFilter = 'All';
    this.statusFilter = 'All';
    this.refresh();
  }

  getTableNumber(tableId: number): string {
    const t = this.tables.find((tbl) => tbl.id === Number(tableId));
    return t ? t.number : `T-${tableId}`;
  }

  getTableZone(tableId: number): string {
    const t = this.tables.find((tbl) => tbl.id === Number(tableId));
    return t ? t.zone : '';
  }

  updateStatusCounts(): void {
    const all = this.reservations;
    this.statusCounts = {
      all: all.length,
      confirmed: all.filter((r) => r.status === 'Confirmed').length,
      pending: all.filter((r) => r.status === 'Pending').length,
      completed: all.filter((r) => r.status === 'Completed').length,
      cancelled: all.filter((r) => r.status === 'Cancelled').length
    };
  }

  // Edit Reservation Modal
  openEditModal(reservation: Reservation): void {
    this.editingReservationId = reservation.id;
    this.editForm = {
      customerName: reservation.customerName,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      tableId: reservation.tableId,
      occasion: reservation.occasion,
      specialRequests: reservation.specialRequests,
      status: reservation.status
    };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingReservationId = '';
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingReservationId) return;

    const result = this.reservationService.update(this.editingReservationId, this.editForm);
    if (result.success) {
      this.closeEditModal();
      this.refresh();
    } else {
      this.notify.error(result.message);
    }
  }

  // Cancel Reservation Modal
  openCancelModal(reservation: Reservation): void {
    this.cancellingReservation = reservation;
    this.cancelReason = '';
    this.isCancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.cancellingReservation = null;
    this.cancelReason = '';
  }

  confirmCancellation(): void {
    if (!this.cancellingReservation) return;

    this.reservationService.cancel(this.cancellingReservation.id, this.cancelReason);
    this.closeCancelModal();
    this.refresh();
  }

  // CSV Export
  exportToCSV(): void {
    const rows = this.filteredReservations;
    if (rows.length === 0) {
      this.notify.warning('No reservation records match current filters to export.');
      return;
    }

    const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Occasion', 'Special Requests'];
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => [
        `"${r.id}"`,
        `"${r.customerName.replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.date}"`,
        `"${r.time}"`,
        r.guests,
        `"${this.getTableNumber(r.tableId)}"`,
        `"${r.status}"`,
        `"${(r.occasion || '').replace(/"/g, '""')}"`,
        `"${(r.specialRequests || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DineFlow_Reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notify.success(`Exported ${rows.length} reservation records to CSV.`);
  }
}
