import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { TableService } from '../../services/table.service';
import { DashboardMetrics, Reservation } from '../../models/reservation.model';
import { Table, ZoneSummary } from '../../models/table.model';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { Time12Pipe } from '../../shared/pipes/time12.pipe';
import { SeatsLabelPipe } from '../../shared/pipes/seats-label.pipe';
import { formatDateOffset } from '../../data/initial-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatCardComponent,
    StatusBadgeComponent,
    FriendlyDatePipe,
    Time12Pipe,
    SeatsLabelPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalReservations: 0,
    todayTotal: 0,
    todayConfirmed: 0,
    todayPending: 0,
    todayGuestsExpected: 0,
    totalTables: 0,
    availableTables: 0,
    reservedTables: 0,
    occupiedTables: 0,
    cleaningTables: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    utilizationRate: 0
  };

  todayReservations: Reservation[] = [];
  tables: Table[] = [];
  zones: ZoneSummary[] = [];

  constructor(
    private reservationService: ReservationService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.metrics = this.reservationService.getDashboardMetrics();
    this.tables = this.tableService.getAllTables();
    this.zones = this.tableService.getZoneSummaries();

    const todayStr = formatDateOffset(0);
    const all = this.reservationService.getAll();
    this.todayReservations = all.filter((r) => r.date === todayStr);
  }

  getTableNumber(tableId: number): string {
    const t = this.tables.find((tbl) => tbl.id === Number(tableId));
    return t ? t.number : `T-${tableId}`;
  }

  get availablePct(): number {
    return this.metrics.totalTables ? Math.round((this.metrics.availableTables / this.metrics.totalTables) * 100) : 0;
  }

  get reservedPct(): number {
    return this.metrics.totalTables ? Math.round((this.metrics.reservedTables / this.metrics.totalTables) * 100) : 0;
  }

  get occupiedPct(): number {
    return this.metrics.totalTables ? Math.round((this.metrics.occupiedTables / this.metrics.totalTables) * 100) : 0;
  }

  get cleaningPct(): number {
    return this.metrics.totalTables ? Math.round((this.metrics.cleaningTables / this.metrics.totalTables) * 100) : 0;
  }
}
