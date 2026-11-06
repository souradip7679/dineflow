import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationService, ToastMessage } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DineFlow';
  notifications$: Observable<ToastMessage[]>;

  constructor(
    private notify: NotificationService,
    private themeService: ThemeService
  ) {
    this.notifications$ = this.notify.notifications$;
  }

  ngOnInit(): void {
    // Initialize theme
    const dark = this.themeService.isDark();
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  dismissToast(id: number): void {
    this.notify.dismiss(id);
  }
}
