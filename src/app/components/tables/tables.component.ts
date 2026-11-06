import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TableService } from '../../services/table.service';
import { ReservationService } from '../../services/reservation.service';
import { NotificationService } from '../../services/notification.service';
import { Table, TableStatus, ZoneSummary } from '../../models/table.model';
import { Reservation } from '../../models/reservation.model';
import { TableCardComponent } from '../../shared/components/table-card/table-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { Time12Pipe } from '../../shared/pipes/time12.pipe';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableCardComponent,
    StatusBadgeComponent,
    ModalDialogComponent,
    FriendlyDatePipe,
    Time12Pipe
  ],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  tables: Table[] = [];
  filteredTables: Table[] = [];
  zones: ZoneSummary[] = [];

  zoneFilter = 'all';
  statusFilter = 'All';
  capacityFilter = 'all';

  statusCounts = {
    all: 0,
    available: 0,
    reserved: 0,
    occupied: 0,
    cleaning: 0
  };

  // Table Details Modal
  isDetailsModalOpen = false;
  selectedTable: Table | null = null;
  tableReservations: Reservation[] = [];
  modalNewStatus: TableStatus = 'Available';

  constructor(
    private tableService: TableService,
    private reservationService: ReservationService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.zones = this.tableService.getZoneSummaries();
    this.refresh();
  }

  refresh(): void {
    this.tables = this.tableService.getAllTables();
    this.updateStatusCounts();
    this.applyFilters();
  }

  updateStatusCounts(): void {
    const all = this.tables;
    this.statusCounts = {
      all: all.length,
      available: all.filter((t) => t.status === 'Available').length,
      reserved: all.filter((t) => t.status === 'Reserved').length,
      occupied: all.filter((t) => t.status === 'Occupied').length,
      cleaning: all.filter((t) => t.status === 'Cleaning').length
    };
  }

  setZoneFilter(zoneCode: string): void {
    this.zoneFilter = zoneCode;
    this.applyFilters();
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter((t) => {
      // Zone filter
      if (this.zoneFilter !== 'all' && t.zoneCode !== this.zoneFilter) {
        return false;
      }
      // Status filter
      if (this.statusFilter !== 'All' && t.status !== this.statusFilter) {
        return false;
      }
      // Capacity filter
      if (this.capacityFilter === '2' && t.capacity !== 2) {
        return false;
      }
      if (this.capacityFilter === '4' && t.capacity !== 4) {
        return false;
      }
      if (this.capacityFilter === '6plus' && t.capacity < 6) {
        return false;
      }
      return true;
    });
  }

  openTableDetails(table: Table): void {
    this.selectedTable = table;
    this.modalNewStatus = table.status;
    const allRes = this.reservationService.getAll();
    this.tableReservations = allRes.filter(
      (r) => Number(r.tableId) === table.id && r.status !== 'Cancelled'
    );
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedTable = null;
  }

  updateSelectedTableStatus(): void {
    if (!this.selectedTable) return;

    this.tableService.updateTableStatus(this.selectedTable.id, this.modalNewStatus);
    this.selectedTable.status = this.modalNewStatus;
    this.notify.success(`Table ${this.selectedTable.number} status updated to ${this.modalNewStatus}.`);
    this.refresh();
  }

  bookThisTable(): void {
    if (!this.selectedTable) return;
    this.router.navigate(['/book'], { queryParams: { tableId: this.selectedTable.id } });
  }
}
