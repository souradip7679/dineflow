# DineFlow — Restaurant Reservation & Table Management System

A modern, responsive, and luxury-tier Restaurant Reservation & Table Management Single Page Application (SPA) built strictly with **AngularJS 1.x**, HTML5, CSS3 (CSS Grid & Flexbox), JavaScript ES5, and browser `LocalStorage`.

Developed for academic submission in Full Stack Web Development (BCA / B.Tech).

---

## 🌟 Key Features

1. **Elegant Contemporary UI/UX:**
   - Curated color scheme: Warm Ivory, Charcoal, Forest Green, and Terracotta.
   - Built-in **Light & Dark Theme** switcher with persistent storage.
   - Smooth glassmorphism, micro-animations, and responsive cards.
   - Elimination of unwanted horizontal overflow.

2. **Home Landing Page (`#/`):**
   - Brand storytelling with headline *"Your Table, Your Moment"*.
   - Quick jump reservation finder widget.
   - Four distinct dining ambiances (Main Dining Room, Garden Terrace, VIP Lounge, Cocktail Bar).
   - Featured seasonal culinary specialties with price tags and calorie badges.
   - Verified guest testimonials and dining hours.

3. **Smart Reservation Booking (`#/book`):**
   - Multi-step booking form using `ng-model` and two-way data binding.
   - Real-time table eligibility calculator (filters tables by party size and time slot availability).
   - **Anti-conflict scheduling engine:** Prevents overlapping double-bookings within a 90-minute dining window on the same table.
   - Instant printable booking confirmation receipt with unique reference code (e.g., `DF-1011`).

4. **Front-of-House Reservation Management (`#/reservations`):**
   - Live search by customer name, reservation ID, phone, or email.
   - Status filter tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`) with live counters.
   - View details modal, edit reservation modal, and cancellation dialog with reason tracking.
   - **Export to CSV:** Client-side export of filtered reservation registers.

5. **Interactive Restaurant Floor Plan (`#/tables`):**
   - Spatial visual floor plan representing 12 dining tables across 4 zones.
   - Visual chair layouts for capacities ranging from 2 to 10 guests.
   - Table status color coding: **Available** (emerald), **Reserved** (blue), **Occupied** (amber), and **Cleaning** (purple).
   - Table details modal with direct staff status switcher buttons.

6. **Operations Dashboard (`#/dashboard`):**
   - Dynamic KPI metric cards (Total Bookings, Today's Bookings, Expected Covers, Table Utilization Rate %).
   - Zone occupancy progress bars.
   - Today's live dining schedule timeline with quick "Seat Party" and "Finish Dining" buttons.

---

## 🚀 Quick Start / How to Run

### Method 1: Using Node.js / NPM (Recommended)
From the project root directory (`d:/Angular Project 2`):

```bash
# Install serve (if not already installed) and launch
npm start
```
The application will be live at: **`http://localhost:3000/#/`**

### Method 2: Using Python HTTP Server
```bash
python -m http.server 3000 --directory dineflow
```
Open **`http://localhost:3000/#/`** in any modern web browser.

### Method 3: Direct Browser Launch
Open `dineflow/index.html` directly in your web browser. All vendor dependencies (`angular.min.js`, `angular-route.min.js`, `angular-animate.min.js`) are bundled locally under `dineflow/assets/vendor/` for offline functionality.

---

## 📁 Project Structure

```
dineflow/
├── index.html                       # Main HTML5 application shell
├── app/
│   ├── app.module.js                # AngularJS module, filters & bootstrap
│   ├── app.routes.js                # ngRoute route definitions
│   ├── controllers/
│   │   ├── home.controller.js       # Landing view controller
│   │   ├── booking.controller.js    # Booking wizard controller
│   │   ├── reservations.controller.js # Register management controller
│   │   ├── tables.controller.js     # Floor plan controller
│   │   └── dashboard.controller.js  # Live KPI & timeline controller
│   ├── services/
│   │   ├── storage.service.js       # LocalStorage abstraction service
│   │   ├── table.service.js         # Table data & eligibility service
│   │   ├── reservation.service.js   # Reservation CRUD & conflict service
│   │   ├── notification.service.js  # Toast alert notification service
│   │   └── theme.service.js         # Theme management service
│   ├── directives/
│   │   ├── status-badge.directive.js# Status badge directive
│   │   ├── stat-card.directive.js   # KPI card directive
│   │   ├── table-card.directive.js  # Table visual card directive
│   │   └── modal-dialog.directive.js# Transcluded modal directive
│   ├── components/
│   │   ├── navbar.component.js      # Navigation header component
│   │   └── footer.component.js      # Footer component with sample reset
│   ├── views/
│   │   ├── home.html                # Home page template
│   │   ├── book.html                # Booking form template
│   │   ├── reservations.html        # Reservations table template
│   │   ├── tables.html              # Floor plan template
│   │   ├── dashboard.html           # Operations dashboard template
│   │   └── 404.html                 # 404 Not Found template
│   ├── styles/
│   │   ├── theme.css                # CSS variables & design tokens
│   │   ├── main.css                 # Layout, navigation, forms, buttons
│   │   ├── components.css           # Directives & data table styling
│   │   ├── tables.css               # Spatial floor layout & chair styling
│   │   └── dashboard.css            # Dashboard metrics & timeline styling
│   ├── data/
│   │   └── initial-data.js          # Seed tables, reservations & menu items
│   └── utils/
│       └── validators.js            # Input validation & conflict math
├── assets/
│   └── vendor/                      # Bundled AngularJS 1.8.2 scripts
└── docs/
    ├── PROJECT_REPORT.md            # Comprehensive Academic Project Report
    └── VIVA_QUESTIONS.md            # Viva Voce Questions & Answers
```

---

## 📚 Academic Documentation & Deliverables

- **[PROJECT_REPORT.md](file:///d:/Angular%20Project%202/dineflow/docs/PROJECT_REPORT.md)**: Full academic report covering system requirements, architecture diagrams, data binding, array operations, test cases, and future scope.
- **[VIVA_QUESTIONS.md](file:///d:/Angular%20Project%202/dineflow/docs/VIVA_QUESTIONS.md)**: 14 essential viva questions with comprehensive answers explaining AngularJS features and design decisions.

---

## 💡 Academic Reset Functionality
If you need to reset all reservations and table states back to their fresh demonstration seed data at any time:
1. Scroll to the footer of any page.
2. Click the **"Reset Sample Data"** button.
3. Confirm the dialog prompt; all tables and sample bookings will restore immediately.
