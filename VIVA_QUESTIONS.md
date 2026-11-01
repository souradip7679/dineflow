# DineFlow — Viva Voce Questions & Answers
## Comprehensive Exam Preparation Guide for Full Stack Development

This document provides clear, concise, and academically sound answers to common questions asked by examiners and evaluators during project defense.

---

### Q1: What is AngularJS and how does it follow the MVC / MVVM architecture?
**Answer:**  
AngularJS (1.x) is an open-source, client-side JavaScript Model-View-Controller (MVC) and Model-View-ViewModel (MVVM) framework created by Google.  
- **Model:** Represents the application data and state, stored in JavaScript objects and managed via services (`ReservationService`, `TableService`, `StorageService`).  
- **View:** The HTML templates (`home.html`, `book.html`, `reservations.html`, `tables.html`, `dashboard.html`) enriched with AngularJS directives (`ng-model`, `ng-repeat`, `ng-if`, `ng-class`).  
- **Controller:** JavaScript constructor functions (`HomeController`, `BookingController`, etc.) that act as the glue between Model and View, handling user interactions and exposing data via `$scope` or the `controllerAs: 'vm'` syntax.

---

### Q2: What is Two-Way Data Binding and how is it used in DineFlow?
**Answer:**  
Two-Way Data Binding is AngularJS's signature feature. It means that any change made to the model is immediately reflected in the view, and conversely, any input entered in the view is automatically updated in the model without needing manual DOM manipulation (like `document.getElementById` or jQuery).  
In DineFlow's booking form (`book.html`):
```html
<input type="text" ng-model="vm.form.customerName" required>
<select ng-model="vm.form.guests" ng-change="vm.updateEligibleTables()">
```
When the user changes the number of guests in the dropdown, `vm.form.guests` updates instantly, and `ng-change` immediately triggers `vm.updateEligibleTables()` to re-filter eligible tables in real time.

---

### Q3: What is the difference between a Controller, a Service, and a Directive in AngularJS?
**Answer:**  
- **Controller:** Handles view-specific logic and user events (e.g., clicking a button, submitting a form). Controllers should stay lean and not contain data persistence or business algorithms.  
- **Service / Factory:** Singletons (instantiated once) used for sharing business logic, data calculations, and storage across multiple controllers. In DineFlow, `ReservationService` handles booking validation and conflict prevention.  
- **Directive:** Extends HTML vocabulary with custom reusable UI elements or behaviors. In DineFlow, `<status-badge>`, `<stat-card>`, and `<table-card>` are custom directives.

---

### Q4: Which custom directives did you build in DineFlow, and why?
**Answer:**  
We created four reusable directives:
1. `statusBadge` (`<status-badge status="res.status"></status-badge>`): Renders standardized status badges with matching icons and colors for tables and reservations.  
2. `statCard` (`<stat-card title="..." value="..." icon="..." theme="..."></stat-card>`): Generates KPI metric cards for the management dashboard.  
3. `tableCard` (`<table-card table="tbl" on-select="vm.openTableModal(table)"></table-card>`): Renders an interactive table card with visual chair icons and capacity counts.  
4. `modalDialog` (`<modal-dialog is-open="..." title="..." on-close="...">`): Reusable accessible modal popup with backdrop dismissal and keyboard Escape handling.

---

### Q5: What is Directive Transclusion and where did you use it?
**Answer:**  
Transclusion (`transclude: true`) allows a directive to wrap arbitrary HTML content supplied inside its tags.  
In DineFlow, the `modalDialog` directive uses `ng-transclude`:
```html
<modal-dialog is-open="vm.showModal" title="Edit Reservation">
  <!-- Transcluded content inserted here -->
  <form>...</form>
</modal-dialog>
```
The directive's internal template contains `<div class="df-modal-body" ng-transclude></div>`, allowing us to inject custom forms or details while reusing the modal header, close button, backdrop, and styling.

---

### Q6: How does Routing work in this Single Page Application?
**Answer:**  
DineFlow uses the `ngRoute` module (`angular-route.js`). In `app.routes.js`, we configure `$routeProvider` to map hash URLs to specific view templates and controllers:
```javascript
$routeProvider
  .when('/', { templateUrl: 'app/views/home.html', controller: 'HomeController', controllerAs: 'vm' })
  .when('/book', { templateUrl: 'app/views/book.html', controller: 'BookingController', controllerAs: 'vm' })
  .when('/reservations', { templateUrl: 'app/views/reservations.html', controller: 'ReservationsController', controllerAs: 'vm' })
  .when('/tables', { templateUrl: 'app/views/tables.html', controller: 'TablesController', controllerAs: 'vm' })
  .when('/dashboard', { templateUrl: 'app/views/dashboard.html', controller: 'DashboardController', controllerAs: 'vm' })
  .otherwise({ redirectTo: '/404' });
```
In `index.html`, `<div ng-view></div>` acts as the placeholder where the matched view is rendered without reloading the whole browser page.

---

### Q7: How does DineFlow prevent overlapping booking conflicts?
**Answer:**  
Conflict detection is handled in `ReservationService` and `Validators.hasTimeConflict()`.  
When a user attempts to book Table `T-03` on date `D` at time `T`:
1. The service checks all existing reservations for Table `T-03` on date `D`.  
2. It excludes cancelled reservations.  
3. It converts booking times to total minutes and verifies that the difference between the requested time and any existing booking is **at least 90 minutes** (the standard dining duration).  
4. If an overlap is detected, booking is rejected with a clear message suggesting alternative tables or times.

---

### Q8: Which JavaScript ES5 array methods are used in the project?
**Answer:**  
- `filter()`: Used in `filterReservations()` to filter by search query, status tab, and date; and in `getEligibleTables()` to filter by guest capacity.  
- `map()`: Used in `DashboardController` to calculate zone occupancy rates, and in CSV export to convert reservation objects into comma-separated text rows.  
- `reduce()`: Used in `calculateDashboardMetrics()` to sum up total guests (covers) expected for today's service.  
- `find()`: Used in `TableService.getTableById()` and `ReservationService.getById()` to look up single records by ID.  
- `some()`: Used in `Validators.hasTimeConflict()` to return `true` as soon as any conflicting booking is found.  
- `sort()`: Used to sort today's reservations chronologically by time.

---

### Q9: How is LocalStorage managed in DineFlow?
**Answer:**  
We created a dedicated `StorageService` that wraps `$window.localStorage`:
- All storage keys are prefixed with `dineflow_` (e.g., `dineflow_reservations`, `dineflow_tables`).  
- It handles automatic JSON serialization (`JSON.stringify`) on write and parsing (`JSON.parse`) on read.  
- It includes `try/catch` error handling and an in-memory fallback dictionary in case local storage is blocked by privacy extensions or incognito mode.

---

### Q10: What custom AngularJS filters are implemented in the project?
**Answer:**  
In `app.module.js`, we created:
1. `time12`: Converts 24-hour time strings (`"19:30"`) into friendly 12-hour format (`"7:30 PM"`).  
2. `friendlyDate`: Formats `"YYYY-MM-DD"` into `"Today (Nov 02)"`, `"Tomorrow"`, or `"Mon, Nov 02, 2026"`.  
3. `seatsLabel`: Formats capacity counts into `"1 Guest"` or `"X Guests"`.  
4. `truncateText`: Truncates lengthy special request notes with an ellipsis (`"..."`).

---

### Q11: How is Light and Dark theme toggling implemented?
**Answer:**  
We use **CSS Variables** defined in `theme.css`:
- Default light variables are attached to `:root, [data-theme="light"]`.  
- Dark mode overrides are attached to `[data-theme="dark"]`.  
- `ThemeService` toggles the `data-theme` attribute on `<html>` and `<body>` and saves the user's choice in `localStorage`.  
- Because colors, shadows, and surfaces reference CSS variables (`var(--df-bg-page)`, `var(--df-text-primary)`), the entire interface adapts smoothly with zero page reload.

---

### Q12: How did you fix horizontal overflow and ensure responsive mobile design?
**Answer:**  
1. Applied `overflow-x: hidden; width: 100%; max-width: 100vw;` to `html` and `body`.  
2. Added `overflow: hidden; pointer-events: none;` to the off-canvas `.df-mobile-drawer` so translated elements outside the viewport do not widen document scroll width.  
3. Enclosed tables inside a `.df-table-responsive` container with `overflow-x: auto` so wide tables scroll internally rather than breaking the outer page layout.  
4. Used CSS Grid (`repeat(auto-fit, minmax(...))`) and Flexbox with media queries for seamless adaptation to mobile, tablet, and desktop viewports.

---

### Q13: What are the main limitations of this academic project?
**Answer:**  
- **Storage Scope:** Because LocalStorage is client-side, changes made on one computer or browser do not sync to another device. In a production environment, this would be replaced with a REST API communicating with a PostgreSQL or MongoDB database.  
- **Authentication:** In a commercial system, staff actions (like changing table status to Occupied) would require host or manager role login, whereas guest booking would be public.

---

### Q14: If you were to upgrade this project to a full-stack system, what backend would you choose?
**Answer:**  
A Node.js + Express backend or Python FastAPI backend providing RESTful endpoints:
- `GET /api/reservations`
- `POST /api/reservations`
- `PUT /api/tables/:id/status`  
AngularJS's built-in `$http` service or `$resource` factory could then replace `StorageService` without requiring any changes to the views or controllers.
