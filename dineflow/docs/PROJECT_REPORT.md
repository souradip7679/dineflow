# DineFlow — Restaurant Reservation & Table Management System
## Academic Project Report & Technical Documentation

**Degree / Course:** Bachelor of Computer Applications (BCA) / Full Stack Development  
**Technology Stack:** AngularJS (1.8.2), HTML5, CSS3 (Flexbox & CSS Grid), JavaScript (ES5), LocalStorage  
**System Architecture:** Client-Side Single Page Application (SPA)

---

## 1. Project Title & Overview

### 1.1 Project Title
**DineFlow — Restaurant Reservation & Table Management System Using AngularJS (1.x)**

### 1.2 Executive Summary
DineFlow is a modern, responsive, and feature-rich Single Page Application (SPA) designed to solve the operational bottlenecks of fine dining restaurants, bistros, and lounges. Built strictly adhering to AngularJS 1.x architecture, DineFlow combines elegant luxury aesthetics (warm ivory, deep charcoal, forest-green, and warm terracotta) with robust engineering: real-time table eligibility calculations, anti-conflict booking logic, interactive floor plan layouts, full reservation lifecycle management (creation, modification, cancellation, and deletion), and dynamic management KPI dashboards.

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
- Build an academic-grade, modern SPA strictly using **AngularJS 1.x** (`angular.module`, `ngRoute`, `$scope`/controllerAs syntax, custom directives, and services).
- Provide an intuitive booking wizard that validates required inputs, checks table capacities, and detects time slot conflicts (+/- 90 minutes).
- Implement an interactive spatial table layout representing 12 dining tables across 4 unique ambiance zones.
- Equip restaurant staff with a dynamic Operations Dashboard that computes live utilization rates, today's covers, and an actionable service timeline.
- Demonstrate advanced JavaScript array manipulations (`filter()`, `map()`, `find()`, `reduce()`, `some()`) across all search, filter, and analytics operations.
- Implement multiple responsive CSS techniques: CSS Grid, Flexbox, CSS Variables for Light/Dark themes, glassmorphism, and micro-interactions.

---

## 3. Scope of the System

| Module | Scope & Functionality |
| :--- | :--- |
| **Landing & Branding** | Hero showcase with headline *"Your Table, Your Moment"*, quick jump booking bar, featured culinary creations with prices and calorie badges, 4 dining zones overview, and diner testimonials. |
| **Reservation Booking** | Multi-step booking form with two-way data binding (`ng-model`), required-field and format validation, real-time table eligibility calculator, dietary requests, and instant printable confirmation receipt with reference code. |
| **Reservation Management** | Real-time searchable register (`ng-repeat`), status filter tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`), date range filters, detail viewer modal, inline editor modal, cancellation dialog with reason tracking, and CSV export. |
| **Interactive Floor Plan** | Visual floor map showing table numbers, shapes (round, square, rectangle), seat counts with visual chair icons, status badges, zone tabs, capacity filter, and staff status switcher modal. |
| **Management Dashboard** | Live KPI metric cards calculated from actual storage records, table utilization progress bars by zone, today's chronological dining timeline with quick "Seat Party" and "Complete" buttons, and upcoming schedule preview. |
| **Theming & Preferences** | Light (warm ivory) and Dark (deep obsidian) theme switching persisted across reloads via `StorageService`. |

---

## 4. Software Requirements Specification (SRS)

### 4.1 Client Environment
- **Browser:** Google Chrome (v90+), Mozilla Firefox (v88+), Microsoft Edge (v90+), or Apple Safari (v14+).
- **JavaScript Engine:** ECMAScript 5 (ES5) compatible.
- **Display Resolution:** Fully responsive across Mobile (360px+), Tablet (768px+), Laptop (1024px+), and Desktop (1440px+).

### 4.2 Libraries & Dependencies
- **AngularJS Core:** v1.8.2 (`angular.min.js`)
- **AngularJS Route:** v1.8.2 (`angular-route.min.js`)
- **AngularJS Animate:** v1.8.2 (`angular-animate.min.js`)
- **Typography:** Google Fonts (`Playfair Display` serif & `Outfit` sans-serif)
- **Icons:** Font Awesome 6.5.2 (SVG web font)
- **Local Storage:** HTML5 Web Storage API (`window.localStorage`)

---

## 5. System Architecture & Folder Structure

### 5.1 Architecture Diagram

```
+--------------------------------------------------------------------------+
|                            Browser Client                                |
+--------------------------------------------------------------------------+
|  [ index.html ]                                                          |
|       |                                                                  |
|       +--> [ dineflowNavbar ]  &  [ dineflowFooter ] (Components)        |
|       |                                                                  |
|       +--> [ ng-view ] (Routes Controller)                               |
|              |                                                           |
|              +--> #/            -> HomeController        -> home.html    |
|              +--> #/book        -> BookingController     -> book.html    |
|              +--> #/reservations-> ReservationsController-> reservations |
|              +--> #/tables      -> TablesController      -> tables.html  |
|              +--> #/dashboard   -> DashboardController   -> dashboard.html|
|              +--> #/404         -> Fallback View         -> 404.html     |
|                                                                          |
|  [ Directives ]: <table-card>, <status-badge>, <stat-card>, <modal-dialog>|
|                                                                          |
|  [ Services Layer ]:                                                     |
|       |--> TableService       (Table lookup, zones, eligibility)         |
|       |--> ReservationService (CRUD, conflict checks, analytics metrics) |
|       |--> StorageService     (LocalStorage wrapper + memory fallback)   |
|       |--> NotificationService(Toast notification queue)                 |
|       +--> ThemeService       (Light/Dark theme toggling)                |
|                                                                          |
|  [ Storage Layer ]: window.localStorage ('dineflow_tables', 'reservations')|
+--------------------------------------------------------------------------+
```

### 5.2 Directory Layout
```
dineflow/
├── index.html                       # Application shell & script loader
├── app/
│   ├── app.module.js                # AngularJS module, filters & bootstrap
│   ├── app.routes.js                # ngRoute route definitions ($routeProvider)
│   ├── controllers/
│   │   ├── home.controller.js       # Hero, featured dishes & testimonials
│   │   ├── booking.controller.js    # Reservation form & table eligibility
│   │   ├── reservations.controller.js # Search, filter, edit & cancellation
│   │   ├── tables.controller.js     # Floor plan & table status switcher
│   │   └── dashboard.controller.js  # Live KPI metrics & service timeline
│   ├── services/
│   │   ├── storage.service.js       # LocalStorage persistence layer
│   │   ├── table.service.js         # Floor tables & zone management
│   │   ├── reservation.service.js   # Reservation CRUD & anti-conflict logic
│   │   ├── notification.service.js  # Flash toasts & alert system
│   │   └── theme.service.js         # Light/dark mode management
│   ├── directives/
│   │   ├── status-badge.directive.js# Color-coded status badge with icon
│   │   ├── stat-card.directive.js   # Reusable dashboard metric card
│   │   ├── table-card.directive.js  # Spatial table card with seats/shape
│   │   └── modal-dialog.directive.js# Accessible transcluded modal wrapper
│   ├── components/
│   │   ├── navbar.component.js      # Responsive sticky top navigation
│   │   └── footer.component.js      # Brand story, hours & reset control
│   ├── views/
│   │   ├── home.html                # Landing page view
│   │   ├── book.html                # Booking form & receipt view
│   │   ├── reservations.html        # Management register & modals
│   │   ├── tables.html              # Interactive floor plan view
│   │   ├── dashboard.html           # Operations dashboard view
│   │   └── 404.html                 # Route not found fallback
│   ├── styles/
│   │   ├── theme.css                # CSS variables, color palettes & tokens
│   │   ├── main.css                 # Layout, typography, buttons, toasts
│   │   ├── components.css           # Badges, modals, cards, data tables
│   │   ├── tables.css               # Spatial floor layout & chair styling
│   │   └── dashboard.css            # Metric grids & timeline styling
│   ├── data/
│   │   └── initial-data.js          # Seed tables, reservations & menu items
│   └── utils/
│       └── validators.js            # Validation regex, time & conflict math
├── assets/
│   ├── vendor/                      # Offline resilient vendor scripts
│   │   ├── angular.min.js
│   │   ├── angular-route.min.js
│   │   └── angular-animate.min.js
│   ├── images/                      # Culinary imagery & assets
│   └── icons/                       # SVG brand emblems
└── docs/
    └── PROJECT_REPORT.md            # Comprehensive project report
```

---

## 6. Detailed AngularJS Implementation Details

### 6.1 Two-Way Data Binding (`ng-model`)
AngularJS's dirty-checking digest cycle synchronizes user input directly with model objects without manual DOM querying:
```html
<input type="text" class="df-input" ng-model="vm.form.customerName" required>
<select class="df-select" ng-model="vm.form.guests" ng-change="vm.updateEligibleTables()">
```
When `vm.form.guests` or `vm.form.time` is altered, `ng-change` automatically triggers `vm.updateEligibleTables()`, filtering out tables whose capacity is insufficient or which have overlapping bookings.

### 6.2 Anti-Conflict Algorithm
A 90-minute buffer window is enforced. If a table is already booked at 19:00 on 2026-11-02, another customer cannot book Table T-03 between 17:30 and 20:30 on the same date:
```javascript
Validators.hasTimeConflict = function(existingReservations, targetTableId, targetDate, targetTime, excludeResId, bufferMinutes) {
  bufferMinutes = bufferMinutes || 90;
  var tableIdInt = parseInt(targetTableId, 10);

  return existingReservations.some(function(res) {
    if (excludeResId && res.id === excludeResId) return false;
    if (res.status === 'Cancelled') return false;
    if (parseInt(res.tableId, 10) === tableIdInt && res.date === targetDate) {
      var diff = Validators.getTimeDifferenceMinutes(res.time, targetTime);
      return diff < bufferMinutes;
    }
    return false;
  });
};
```

### 6.3 Reusable Directives & Components
1. `<status-badge status="res.status" size="sm"></status-badge>`
   Encapsulates status rendering, associating colors and Font Awesome icons for `Confirmed`, `Pending`, `Cancelled`, `Completed`, `Available`, `Reserved`, `Occupied`, and `Cleaning`.
2. `<stat-card title="Total Bookings" value="vm.metrics.totalReservations" icon="fa-book" theme="forest"></stat-card>`
   Generates a KPI metric widget with animated hover states and trend indicators.
3. `<modal-dialog is-open="vm.showModal" title="..." size="md" on-close="vm.close()">`
   Uses AngularJS transclusion (`ng-transclude`) to wrap arbitrary markup inside an accessible modal with backdrop dismissal and keyboard Escape support.

---

## 7. Demonstration of JavaScript ES5 Array Operations

The application extensively showcases modern ES5 functional array methods:

| Method | Application in DineFlow | Code Location |
| :--- | :--- | :--- |
| `filter()` | Real-time multi-criteria filtering by text search query, status tab, and date category | `ReservationService.filterReservations()` |
| `filter()` | Table capacity filtering and available table calculations | `TableService.getEligibleTables()` |
| `reduce()` | Dynamic calculation of total expected covers (guests) for today's service | `ReservationService.calculateDashboardMetrics()` |
| `map()` | Computing zone occupancy percentages and transforming records for CSV export | `DashboardController.loadDashboard()` |
| `find()` | Locating specific tables by integer ID or reservations by alphanumeric code | `TableService.getTableById()` |
| `some()` | Conflict detection algorithm to verify if any overlapping booking exists | `Validators.hasTimeConflict()` |
| `sort()` | Chronological ordering of today's service timeline events | `ReservationService.calculateDashboardMetrics()` |

---

## 8. Styling Architecture & Design Decisions

1. **Curated Color Tokens (CSS Variables):**
   - Warm Ivory (`--df-bg-page: #FAF7F2`) provides a comforting, welcoming fine-dining ambience.
   - Deep Forest Green (`--df-forest: #1A3B32`) signifies heritage, quality, and organic freshness.
   - Warm Terracotta (`--df-terracotta: #C85A32`) directs attention to primary actions (*Reserve*, *Confirm*).
   - Rich Charcoal (`--df-text-primary: #1C1E21`) delivers high-contrast readability.
2. **Glassmorphism & Elevation:**
   - Navbars and modals use `backdrop-filter: blur(14px)` with semi-transparent alpha backgrounds (`rgba(255, 255, 255, 0.85)`).
3. **No Horizontal Scrollbar Guarantee:**
   - `html` and `body` enforce `overflow-x: hidden; width: 100%; max-width: 100vw;`.
   - All tables utilize a dedicated `.df-table-responsive` scrolling wrapper to prevent viewport overflow on smaller displays.

---

## 9. Comprehensive Test Cases & Results

| Test ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Initial Route Navigation | Open `#/` | Home view loaded with hero and dishes | Loaded correctly | **PASS** |
| **TC-02** | Theme Switching | Click theme toggle button | Toggles `[data-theme='dark']` on root | Colors invert smoothly | **PASS** |
| **TC-03** | Required Field Validation | Submit empty booking form | Error toasts appear; form blocked | Errors highlighted | **PASS** |
| **TC-04** | Table Capacity Checking | Select 7 guests | Only tables with capacity >= 7 are selectable | Tables T-08 & T-09 shown | **PASS** |
| **TC-05** | Booking Conflict Prevention | Book Table T-03 at 20:00 (already booked at 20:15) | Error message: Table is already booked around that time | Conflict prevented | **PASS** |
| **TC-06** | Successful Booking Receipt | Valid submission for Sophia Laurent | Success ticket rendered with reference code | Generated reference `DF-1011` | **PASS** |
| **TC-07** | Live Search Filtering | Type "Sophia" in search box | Table dynamically narrows to Sophia's record | Filtered instantaneously | **PASS** |
| **TC-08** | Status Filtering Tabs | Click "Cancelled" tab | Only records with status `Cancelled` displayed | 1 cancelled booking shown | **PASS** |
| **TC-09** | Table Status Switching | Click Table T-01 -> Change to "Cleaning" | Table status updates to Cleaning across floor plan | Status badge & color updated | **PASS** |
| **TC-10** | Live Dashboard Calculation | Inspect utilization percentage | Computed as (Occupied + Reserved) / Total | Correct % calculated | **PASS** |
| **TC-11** | LocalStorage Persistence | Refresh page in browser | All modifications and new bookings preserved | Data persists flawlessly | **PASS** |
| **TC-12** | CSV Export | Click "Export CSV" button | Browser downloads formatted CSV file | File downloaded properly | **PASS** |

---

## 10. Limitations & Future Enhancements

### 10.1 Limitations
- **Single-Client LocalStorage:** Data is persisted in the local browser instance. Multi-user concurrent booking updates across distinct devices are not synchronized without a remote database.
- **Client-Side Authentication:** Staff controls are currently integrated directly into the UI without role-based login barriers (RBAC).

### 10.2 Future Enhancements
- **RESTful / GraphQL Backend:** Connect AngularJS `$http` or `$resource` to a Node.js Express / MongoDB or Python FastAPI backend.
- **WebSockets / Socket.io:** Enable real-time table status broadcasts so hosts see tables flip to `Cleaning` or `Occupied` instantly across multiple floor tablets.
- **SMS / Email Gateway:** Integrate Twilio or SendGrid APIs to deliver SMS confirmations and reminder links to diners.
- **Online Pre-payments:** Integrate Stripe or Razorpay for table reservation deposits on holiday dates.

---

## 11. Conclusion
DineFlow demonstrates that AngularJS 1.x remains a remarkably structured, powerful, and understandable framework for enterprise-grade Single Page Applications. By combining rigorous separation of concerns (MVC), reusable directive components, robust service-layer encapsulation, and contemporary UI/UX design standards, DineFlow fulfills all academic criteria for Full Stack Development while delivering a commercially viable user experience.
