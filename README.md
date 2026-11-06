# DineFlow — Restaurant Reservation & Table Management System

A modern, responsive, and luxury-tier Restaurant Reservation & Table Management System built with **Modern Angular (Angular 18)**, **TypeScript**, **Angular Standalone Components (`.ts`)**, HTML5, CSS3 (CSS Grid & Flexbox), and browser `LocalStorage`.

Developed for academic submission in Full Stack Web Development (BCA / B.Tech / MCA).

---

## 🌟 Key Features

1. **Modern Angular Architecture:**
   - **TypeScript (`.ts`) throughout:** All components, services, models, pipes, and utilities are written in strictly typed TypeScript.
   - **Standalone Components:** Utilizes Angular Standalone Component architecture (`@Component({ standalone: true, ... })`), eliminating legacy module bloat.
   - **Dependency Injection:** Services powered by `@Injectable({ providedIn: 'root' })` (`ReservationService`, `TableService`, `ThemeService`, `NotificationService`, `StorageService`).
   - **Reactive & Template-Driven Forms:** Built using Angular's `FormsModule` and `[(ngModel)]` two-way data binding with validation.
   - **Custom Angular Pipes:** `@Pipe({ standalone: true })` for `FriendlyDatePipe`, `Time12Pipe`, and `SeatsLabelPipe`.
   - **Angular Router:** Client-side routing with route guards, hash location strategy, and page titles.

2. **Elegant Contemporary UI/UX:**
   - Curated luxury color scheme: Warm Ivory, Charcoal, Forest Green, and Terracotta.
   - Built-in **Light & Dark Theme** switcher with persistent storage via `ThemeService`.
   - Smooth glassmorphism, micro-animations, and responsive cards without horizontal overflow.

3. **Home Landing Page (`#/`):**
   - Brand storytelling with headline *"Your Table, Your Moment"*.
   - Quick jump reservation finder widget.
   - Four distinct dining ambiances (Main Dining Room, Garden Terrace, VIP Lounge, Cocktail Bar).
   - Featured seasonal culinary specialties with price tags and calorie badges.

4. **Smart Reservation Booking (`#/book`):**
   - Multi-step booking form using Angular two-way data binding.
   - Real-time table eligibility calculator (filters tables by party size and time slot availability).
   - **Anti-conflict scheduling engine:** Prevents overlapping double-bookings within a 90-minute dining window on the same table.
   - Instant printable booking confirmation receipt with unique reference code (e.g., `DF-1011`).

5. **Front-of-House Reservation Management (`#/reservations`):**
   - Live search by customer name, reservation ID, phone, or email.
   - Status filter tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`) with live counters.
   - View details modal, edit reservation modal, and cancellation dialog with reason tracking.
   - **Export to CSV:** Client-side export of filtered reservation registers.

6. **Interactive Restaurant Floor Plan (`#/tables`):**
   - Spatial visual floor plan representing 12 dining tables across 4 zones.
   - Visual chair layouts for capacities ranging from 2 to 10 guests.
   - Table status color coding: **Available** (emerald), **Reserved** (amber), **Occupied** (terracotta), and **Cleaning** (gray).
   - Table details modal with direct staff status switcher buttons.

7. **Operations Dashboard (`#/dashboard`):**
   - Dynamic KPI metric cards (Total Bookings, Today's Bookings, Expected Covers, Table Utilization Rate %).
   - Zone occupancy progress bars.
   - Today's live dining schedule timeline with real-time status.

---

## 📁 Modern Angular Project Folder Structure

```text
dineflow/
├── angular.json                     # Angular CLI project configuration
├── tsconfig.json                    # Root TypeScript configuration
├── tsconfig.app.json                # Application TypeScript build configuration
├── package.json                     # NPM packages (@angular/core, @angular/router, etc.)
├── preview.js                       # Lightweight instant preview development server
├── src/
│   ├── index.html                   # HTML entry point with <app-root></app-root>
│   ├── main.ts                      # Modern Angular application bootstrap (bootstrapApplication)
│   ├── styles.css                   # Global styles & design system (CSS variables, dark/light theme)
│   ├── assets/
│   │   ├── images/                  # Culinary imagery & dish assets
│   │   └── icons/                   # SVG brand emblems & favicons
│   └── app/
│       ├── app.component.ts         # Root Angular Component (@Component)
│       ├── app.component.html       # Root markup with <app-navbar>, <router-outlet>, <app-footer>
│       ├── app.component.css        # Root styling & toast animations
│       ├── app.config.ts            # Application configuration & provideRouter
│       ├── app.routes.ts            # Standalone route definitions
│       ├── models/
│       │   ├── table.model.ts       # Table & Zone TypeScript interfaces
│       │   ├── reservation.model.ts # Reservation & Dashboard metrics TypeScript interfaces
│       │   └── dish.model.ts        # Dish & Menu TypeScript interfaces
│       ├── data/
│       │   └── initial-data.ts      # Fresh initial sample data with dynamic dates
│       ├── utils/
│       │   └── validators.ts        # TypeScript validation & 90-min anti-conflict math
│       ├── services/
│       │   ├── storage.service.ts   # LocalStorage persistence wrapper
│       │   ├── table.service.ts     # Table spatial layout & state management
│       │   ├── reservation.service.ts # Booking engine, conflict detection, CRUD, metrics
│       │   ├── notification.service.ts # Toast notification messaging service
│       │   └── theme.service.ts     # Light/Dark mode state management
│       ├── shared/
│       │   ├── components/
│       │   │   ├── status-badge/    # status-badge.component.ts
│       │   │   ├── stat-card/       # stat-card.component.ts
│       │   │   ├── table-card/      # table-card.component.ts
│       │   │   └── modal-dialog/    # modal-dialog.component.ts
│       │   └── pipes/
│       │       ├── friendly-date.pipe.ts # Custom pipe: relative dates (Today, Tomorrow, etc.)
│       │       ├── time12.pipe.ts       # Custom pipe: 24h to 12h AM/PM
│       │       └── seats-label.pipe.ts  # Custom pipe: guest count formatting
│       └── components/
│           ├── navbar/              # navbar.component.ts + html + css
│           ├── footer/              # footer.component.ts + html + css
│           ├── home/                # home.component.ts + html + css
│           ├── book/                # book.component.ts + html + css
│           ├── reservations/        # reservations.component.ts + html + css
│           ├── tables/              # tables.component.ts + html + css
│           ├── dashboard/           # dashboard.component.ts + html + css
│           └── not-found/           # not-found.component.ts + html + css
└── docs/
    └── PROJECT_REPORT.md            # Comprehensive Academic Project Report
```

---

## 🚀 How to Run

### Method 1: Instant Start (Recommended)
From the project directory:

```bash
npm start
```
The application will be live at: **`http://localhost:3000/#/`**

### Method 2: Angular CLI
If Angular CLI is installed:
```bash
npm install
npm run ng:serve
```
Access at: **`http://localhost:4200/`**

---

## 💡 Academic Reset Functionality
If you need to reset all reservations and table states back to fresh demonstration seed data at any time:
1. Scroll to the footer of any page.
2. Click the **"Reset Sample Data"** button.
3. Confirm the prompt; all tables and sample bookings will restore immediately.
