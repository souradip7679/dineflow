import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { TablesComponent } from './components/tables/tables.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'DineFlow — Luxury Restaurant & Table Reservations' },
  { path: 'book', component: BookComponent, title: 'DineFlow — Reserve a Table' },
  { path: 'reservations', component: ReservationsComponent, title: 'DineFlow — Manage Reservations' },
  { path: 'tables', component: TablesComponent, title: 'DineFlow — Interactive Table Floor Plan' },
  { path: 'dashboard', component: DashboardComponent, title: 'DineFlow — Operations Dashboard' },
  { path: '**', component: NotFoundComponent, title: 'DineFlow — Page Not Found' }
];
