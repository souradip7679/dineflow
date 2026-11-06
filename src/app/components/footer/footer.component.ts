import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private reservationService: ReservationService) {}

  resetData(): void {
    if (confirm('Are you sure you want to reset all reservations and table states to fresh sample demonstration data?')) {
      this.reservationService.resetAllData();
      window.location.reload();
    }
  }
}
