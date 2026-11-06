# DineFlow — Restaurant Reservation & Table Management System
## Academic Project Report & Technical Documentation

**Degree / Course:** Bachelor of Computer Applications (BCA) / Full Stack Development  
**Technology Stack:** Modern Angular (Angular 18), TypeScript, Standalone Components, HTML5, CSS3 (Flexbox & CSS Grid), LocalStorage  
**System Architecture:** Client-Side Single Page Application (SPA)

---

## 1. Project Title & Overview

### 1.1 Project Title
**DineFlow — Luxury Restaurant Reservation & Table Management System Using Modern Angular**

### 1.2 Executive Summary
DineFlow is a modern, responsive, and feature-rich Single Page Application (SPA) designed to solve the operational bottlenecks of fine dining restaurants, bistros, and lounges. Built strictly adhering to Modern Angular standalone component architecture with TypeScript, DineFlow combines elegant luxury aesthetics (warm ivory, deep charcoal, forest-green, and warm terracotta) with robust engineering: real-time table eligibility calculations, anti-conflict booking logic (+/- 90 minutes), interactive floor plan layouts, full reservation lifecycle management (creation, modification, cancellation, and deletion), and dynamic management KPI dashboards.

Data persistence is managed cleanly through the browser's `LocalStorage` API, ensuring that all reservations, table assignments, and theme preferences survive page refreshes and browser restarts without requiring an external database for demonstration.

---

## 2. Objectives & Problem Statement

### 2.1 Problem Statement
Traditional restaurant reservation methods rely on paper guest books or fragmented digital spreadsheets. These legacy workflows suffer from critical flaws:
1. **Double Bookings & Overlapping Conflicts:** Tables frequently get double-booked during peak rush hours because staff lack instantaneous conflict verification.
2. **Capacity Mismatches:** Large parties are assigned to undersized booths or small parties occupy high-capacity tables, leading to poor seat utilization.
3. **Lack of Floor Visibility:** Front-of-house hosts cannot see real-time table states (`Available`, `Reserved`, `Occupied`, `Cleaning`) in a single glance.
4. **Disorganized Records:** Customer dietary notes, special occasion preferences, and contact details are lost or hard to search quickly.

### 2.2 Project Objectives
- Build an academic-grade, modern SPA strictly using **Modern Angular with TypeScript** (`@Component({ standalone: true })`, `provideRouter()`, `@Injectable({ providedIn: 'root' })`, custom `@Pipe`, and reactive services).
- Provide an intuitive booking wizard that validates required inputs, checks table capacities, and detects time slot conflicts (+/- 90 minutes).
- Implement an interactive spatial table layout representing 12 dining tables across 4 unique ambiance zones.
- Equip restaurant staff with a dynamic Operations Dashboard that computes live utilization rates, today's covers, and an actionable service timeline.
- Demonstrate advanced TypeScript/JavaScript array manipulations (`filter()`, `map()`, `find()`, `reduce()`, `some()`) across all search, filter, and analytics operations.
- Implement multiple responsive CSS techniques: CSS Grid, Flexbox, CSS Variables for Light/Dark themes, glassmorphism, and micro-interactions.

---

## 3. Scope of the System

| Module | Scope & Functionality |
| :--- | :--- |
| **Landing & Branding** | Hero showcase with headline *"Your Table, Your Moment"*, quick jump booking bar, featured culinary creations with prices and calorie badges, 4 dining zones overview, and diner testimonials. |
| **Reservation Booking** | Multi-step booking form with two-way data binding (`[(ngModel)]`), required-field and format validation, real-time table eligibility calculator, dietary requests, and instant printable confirmation receipt with reference code. |
| **Reservation Management** | Real-time searchable register (`*ngFor`), status filter tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`), date range filters, detail viewer modal, inline editor modal, cancellation dialog with reason tracking, and CSV export. |
| **Interactive Floor Plan** | Visual floor map showing table numbers, shapes (round, square, rectangle), seat counts with visual chair icons, status badges, zone tabs, capacity filter, and staff status switcher modal. |
| **Management Dashboard** | Live KPI metric cards calculated from actual storage records, table utilization progress bars by zone, today's chronological dining timeline, and upcoming schedule preview. |
| **Theming & Preferences** | Light (warm ivory) and Dark (deep obsidian) theme switching persisted across reloads via `ThemeService`. |

---

## 4. Hardware & Software Requirements

### 4.1 Software Requirements
- **Operating System:** Cross-platform (Windows 10/11, macOS, Linux).
- **Runtime Environment:** Node.js v18+ (tested on Node v26).
- **Core Framework:** Angular 18 (with TypeScript v5.5+).
- **Package Manager:** npm v9+.
- **Browser Compatibility:** Google Chrome (v90+), Mozilla Firefox (v88+), Microsoft Edge (v90+), Apple Safari (v14+).

### 4.2 Hardware Requirements
- **Processor:** 1.6 GHz dual-core x86/x64 or ARM processor (Intel Core i3 / AMD Ryzen 3 / Apple Silicon).
- **RAM:** Minimum 2 GB (4 GB recommended).
- **Storage:** 50 MB free disk space.
- **Display:** Responsive resolution from 360px mobile width to 2560px ultra-wide displays.

---

## 5. System Architecture & Project Folder Structure

### 5.1 Architecture Diagram
```
+-------------------------------------------------------------------------+
|                              BROWSER CLIENT                             |
+-------------------------------------------------------------------------+
|  [ Modern Angular 18 Single Page Application (app.routes.ts / router-outlet) ]
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | Components (TypeScript Standalone):                               |  |
|  | - NavbarComponent       - FooterComponent                         |  |
|  | - HomeComponent         - BookComponent                           |  |
|  | - ReservationsComponent - TablesComponent                         |  |
|  | - DashboardComponent    - NotFoundComponent                       |  |
|  +-------------------------------------------------------------------+  |
|                                 |                                       |
|  +-------------------------------------------------------------------+  |
|  | Services (@Injectable root singleton providers):                  |  |
|  | - ReservationService (CRUD, 90-min conflict detection, analytics) |  |
|  | - TableService       (Spatial layout, zone filters, status sync)  |  |
|  | - ThemeService       (Dark/Light mode toggling & DOM mutation)    |  |
|  | - NotificationService(Toast notification reactive event stream)   |  |
|  | - StorageService     (LocalStorage wrapper with memory fallback)  |  |
|  +-------------------------------------------------------------------+  |
|                                 |                                       |
|  +-------------------------------------------------------------------+  |
|  | Persistence Layer: HTML5 LocalStorage API                         |  |
|  | - dineflow_reservations | dineflow_tables | dineflow_theme        |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

### 5.2 Project Folder Structure
```text
dineflow/
├── angular.json                     # Angular CLI workspace config
├── tsconfig.json                    # Root TypeScript configuration
├── tsconfig.app.json                # App TypeScript build configuration
├── package.json                     # Dependencies (@angular/core, @angular/router)
├── preview.js                       # Local zero-dependency preview server
├── src/
│   ├── index.html                   # Root index with <app-root>
│   ├── main.ts                      # Application bootstrap (bootstrapApplication)
│   ├── styles.css                   # Global styles & design system (CSS variables)
│   ├── assets/
│   │   ├── images/                  # Culinary imagery & dish assets
│   │   └── icons/                   # Brand icons & favicons
│   └── app/
│       ├── app.component.ts         # Root Angular Component (@Component)
│       ├── app.component.html       # Root markup
│       ├── app.component.css        # Root styling
│       ├── app.config.ts            # Application configuration & provideRouter
│       ├── app.routes.ts            # Standalone route definitions
│       ├── models/
│       │   ├── table.model.ts       # Table & Zone interfaces
│       │   ├── reservation.model.ts # Reservation interfaces
│       │   └── dish.model.ts        # Dish & Menu interfaces
│       ├── data/
│       │   └── initial-data.ts      # Seed data with dynamic date offset
│       ├── utils/
│       │   └── validators.ts        # Validation & 90-minute conflict math
│       ├── services/
│       │   ├── storage.service.ts   # LocalStorage persistence wrapper
│       │   ├── table.service.ts     # Table spatial layout & state management
│       │   ├── reservation.service.ts # Booking engine, conflict detection, CRUD
│       │   ├── notification.service.ts # Toast notification messaging
│       │   └── theme.service.ts     # Light/Dark mode state management
│       ├── shared/
│       │   ├── components/
│       │   │   ├── status-badge/    # status-badge.component.ts
│       │   │   ├── stat-card/       # stat-card.component.ts
│       │   │   ├── table-card/      # table-card.component.ts
│       │   │   └── modal-dialog/    # modal-dialog.component.ts
│       │   └── pipes/
│       │       ├── friendly-date.pipe.ts # Custom pipe: relative dates
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
    └── PROJECT_REPORT.md            # Comprehensive project report
```

---

## 6. Detailed Modern Angular Implementation Details

### 6.1 TypeScript Standalone Components (`@Component`)
Modern Angular eliminates complex NgModule definitions in favor of lightweight, modular Standalone Components:
```typescript
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FriendlyDatePipe, Time12Pipe],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit { ... }
```

### 6.2 Two-Way Data Binding (`[(ngModel)]`)
Angular's `[(ngModel)]` directive provides seamless bidirectional data flow between the TypeScript component state and the HTML form inputs:
```html
<input type="text"
       id="custName"
       name="customerName"
       class="df-input"
       [(ngModel)]="formData.customerName"
       required>
```

### 6.3 Anti-Conflict Table Booking Algorithm
To prevent overlapping double bookings, the system checks whether the target table already has an active booking within 90 minutes of the requested time:
```typescript
static hasTimeConflict(
  existingReservations: Reservation[],
  targetTableId: number,
  targetDate: string,
  targetTime: string,
  excludeResId?: string,
  bufferMinutes: number = 90
): boolean {
  const tableIdInt = Number(targetTableId);
  return existingReservations.some((res) => {
    if (excludeResId && res.id === excludeResId) return false;
    if (res.status === 'Cancelled') return false;
    if (Number(res.tableId) === tableIdInt && res.date === targetDate) {
      const diff = ValidatorsUtil.getTimeDifferenceMinutes(res.time, targetTime);
      return diff < bufferMinutes;
    }
    return false;
  });
}
```

---

## 7. Testing & Verification

| Test Case ID | Test Scenario | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Routing Navigation | Click navbar links (`/book`, `/reservations`, `/tables`, `/dashboard`) | Page view renders without full browser reload | Smooth client-side SPA routing verified | **PASS** |
| **TC-02** | Form Validation | Submit blank booking form | Required errors shown, submit button remains disabled | Field errors highlighted, submission blocked | **PASS** |
| **TC-03** | Anti-Conflict Check | Book Table T-03 today at 20:30 (already booked at 20:15) | Conflict warning shown: Table T-03 booked within 90 mins | Conflict detected, double-booking prevented | **PASS** |
| **TC-04** | Capacity Validation | Request 5 guests on 2-person table (T-01) | T-01 is filtered out from eligible tables list | Table dropdown displays only capacity >= 5 tables | **PASS** |
| **TC-05** | Reservation Search | Search query `"Eleanor"` or `"DF-1001"` | Table filters instantly to show matching record | Record instantly displayed, count updated | **PASS** |
| **TC-06** | Status Modification | Change table status from Available to Occupied | Status badge updates to terracotta Occupied badge | State persisted in LocalStorage | **PASS** |
| **TC-07** | Dashboard Analytics | Book a new reservation | KPI counters and utilization rate update dynamically | Metrics recalculated via `reduce()` / `filter()` | **PASS** |
| **TC-08** | Dark/Light Theming | Click moon/sun toggle | `data-theme` changes, colors switch smoothly | Persistent across page reloads | **PASS** |

---

## 8. Conclusion
DineFlow demonstrates how Modern Angular Standalone Components, TypeScript, and clean reactive services can create an enterprise-grade, luxury restaurant reservation platform. The application satisfies all academic requirements for Full Stack Development, featuring robust client-side validation, anti-conflict algorithms, interactive spatial layouts, and dynamic KPI dashboards.
