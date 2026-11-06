import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { TableService } from '../../services/table.service';
import { NotificationService } from '../../services/notification.service';
import { Table } from '../../models/table.model';
import { Reservation, ReservationFormData } from '../../models/reservation.model';
import { formatDateOffset } from '../../data/initial-data';
import { ValidatorsUtil } from '../../utils/validators';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { Time12Pipe } from '../../shared/pipes/time12.pipe';
import { SeatsLabelPipe } from '../../shared/pipes/seats-label.pipe';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FriendlyDatePipe,
    Time12Pipe,
    SeatsLabelPipe
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  formData: ReservationFormData = {
    customerName: '',
    email: '',
    phone: '',
    date: formatDateOffset(0),
    time: '19:30',
    guests: 2,
    tableId: null,
    occasion: 'Casual Dining',
    specialRequests: '',
    agreeTerms: true
  };

  minDate: string = formatDateOffset(0);
  tables: Table[] = [];
  bookingSuccess = false;
  confirmedReservation?: Reservation;
  confirmedTable?: Table;
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private tableService: TableService,
    private notify: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();

    this.route.queryParams.subscribe((params) => {
      if (params['date']) {
        this.formData.date = params['date'];
      }
      if (params['time']) {
        this.formData.time = params['time'];
      }
      if (params['guests']) {
        this.formData.guests = Number(params['guests']);
      }
      if (params['tableId']) {
        this.formData.tableId = Number(params['tableId']);
      } else {
        this.autoSelectTable();
      }
    });

    if (!this.formData.tableId) {
      this.autoSelectTable();
    }
  }

  get availableTablesForGuests(): Table[] {
    return this.tables.filter((t) => t.capacity >= this.formData.guests);
  }

  get selectedTable(): Table | undefined {
    if (!this.formData.tableId) return undefined;
    return this.tables.find((t) => t.id === Number(this.formData.tableId));
  }

  onGuestsChange(): void {
    const selected = this.selectedTable;
    if (selected && selected.capacity < this.formData.guests) {
      this.autoSelectTable();
    }
  }

  autoSelectTable(): void {
    const eligible = this.availableTablesForGuests;
    const available = eligible.find((t) => t.status === 'Available');
    if (available) {
      this.formData.tableId = available.id;
    } else if (eligible.length > 0) {
      this.formData.tableId = eligible[0].id;
    } else {
      this.formData.tableId = null;
    }
  }

  submitBooking(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.notify.error(this.errorMessage);
      return;
    }

    if (!ValidatorsUtil.isValidEmail(this.formData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.notify.error(this.errorMessage);
      return;
    }

    if (!ValidatorsUtil.isValidPhone(this.formData.phone)) {
      this.errorMessage = 'Please enter a valid telephone number (minimum 7 digits).';
      this.notify.error(this.errorMessage);
      return;
    }

    if (!ValidatorsUtil.isFutureOrToday(this.formData.date)) {
      this.errorMessage = 'Reservation date must be today or in the future.';
      this.notify.error(this.errorMessage);
      return;
    }

    if (!ValidatorsUtil.isWithinOpeningHours(this.formData.time)) {
      this.errorMessage = 'Reservations must be between 11:30 AM and 11:00 PM.';
      this.notify.error(this.errorMessage);
      return;
    }

    if (!this.formData.tableId) {
      this.errorMessage = 'Please choose a dining table.';
      this.notify.error(this.errorMessage);
      return;
    }

    const result = this.reservationService.create({
      customerName: this.formData.customerName.trim(),
      email: this.formData.email.trim(),
      phone: this.formData.phone.trim(),
      date: this.formData.date,
      time: this.formData.time,
      guests: Number(this.formData.guests),
      tableId: Number(this.formData.tableId),
      occasion: this.formData.occasion,
      specialRequests: this.formData.specialRequests ? this.formData.specialRequests.trim() : '',
      status: 'Confirmed'
    });

    if (!result.success) {
      this.errorMessage = result.message;
      this.notify.error(result.message);
      return;
    }

    this.confirmedReservation = result.reservation;
    this.confirmedTable = this.tableService.getTableById(Number(this.formData.tableId));
    this.bookingSuccess = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bookAnother(): void {
    this.bookingSuccess = false;
    this.confirmedReservation = undefined;
    this.confirmedTable = undefined;
    this.errorMessage = '';
    this.formData.customerName = '';
    this.formData.email = '';
    this.formData.phone = '';
    this.formData.specialRequests = '';
    this.autoSelectTable();
  }

  viewInReservations(): void {
    this.router.navigate(['/reservations']);
  }
}
