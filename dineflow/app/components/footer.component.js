/**
 * DineFlow - Footer Component
 * Application footer with opening hours, contact details, quick navigation,
 * academic project credits, and quick data reset control for evaluators.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .component('dineflowFooter', {
      template:
        '<footer class="df-footer">' +
        '  <div class="df-footer-top">' +
        '    <div class="df-footer-container">' +
        '      <!-- Col 1: Brand & Philosophy -->' +
        '      <div class="df-footer-col">' +
        '        <div class="df-brand mb-3">' +
        '          <div class="df-brand-icon"><i class="fa-solid fa-utensils"></i></div>' +
        '          <div class="df-brand-text">' +
        '            <span class="df-brand-title">DineFlow</span>' +
        '            <span class="df-brand-subtitle">Bistro &amp; Lounge</span>' +
        '          </div>' +
        '        </div>' +
        '        <p class="df-footer-desc">' +
        '          Curating exceptional culinary moments with seasonal gastronomy, handpicked vintages, and bespoke hospitality.' +
        '        </p>' +
        '        <div class="df-footer-awards">' +
        '          <span class="df-award-badge"><i class="fa-solid fa-star"></i> Michelin Guide 2026</span>' +
        '          <span class="df-award-badge"><i class="fa-solid fa-award"></i> Epicurean Award</span>' +
        '        </div>' +
        '      </div>' +

        '      <!-- Col 2: Operating Hours -->' +
        '      <div class="df-footer-col">' +
        '        <h4 class="df-footer-heading">Dining Hours</h4>' +
        '        <ul class="df-hours-list">' +
        '          <li>' +
        '            <span class="df-day">Monday – Thursday:</span>' +
        '            <span class="df-time">11:30 AM – 10:30 PM</span>' +
        '          </li>' +
        '          <li>' +
        '            <span class="df-day">Friday &amp; Saturday:</span>' +
        '            <span class="df-time">11:30 AM – 11:30 PM</span>' +
        '          </li>' +
        '          <li>' +
        '            <span class="df-day">Sunday Brunch &amp; Dinner:</span>' +
        '            <span class="df-time">10:30 AM – 10:00 PM</span>' +
        '          </li>' +
        '        </ul>' +
        '        <div class="df-footer-note">' +
        '          <i class="fa-solid fa-clock"></i> Kitchen closes 45 min before closing.' +
        '        </div>' +
        '      </div>' +

        '      <!-- Col 3: Quick Navigation -->' +
        '      <div class="df-footer-col">' +
        '        <h4 class="df-footer-heading">Explore DineFlow</h4>' +
        '        <ul class="df-footer-links">' +
        '          <li><a href="#/"><i class="fa-solid fa-chevron-right"></i> Restaurant Home</a></li>' +
        '          <li><a href="#/book"><i class="fa-solid fa-chevron-right"></i> Reserve a Table</a></li>' +
        '          <li><a href="#/reservations"><i class="fa-solid fa-chevron-right"></i> Manage Bookings</a></li>' +
        '          <li><a href="#/tables"><i class="fa-solid fa-chevron-right"></i> Interactive Floor Plan</a></li>' +
        '          <li><a href="#/dashboard"><i class="fa-solid fa-chevron-right"></i> Staff Dashboard</a></li>' +
        '        </ul>' +
        '      </div>' +

        '      <!-- Col 4: Location & Academic Info -->' +
        '      <div class="df-footer-col">' +
        '        <h4 class="df-footer-heading">Location &amp; Inquiries</h4>' +
        '        <p class="df-footer-contact-item">' +
        '          <i class="fa-solid fa-location-dot"></i>' +
        '          <span>420 Boulevard Saint-Germain, Paris / Culinary District</span>' +
        '        </p>' +
        '        <p class="df-footer-contact-item">' +
        '          <i class="fa-solid fa-phone"></i>' +
        '          <span>+1 (555) 839-DINE (3463)</span>' +
        '        </p>' +
        '        <p class="df-footer-contact-item">' +
        '          <i class="fa-solid fa-envelope"></i>' +
        '          <span>reservations@dineflow-bistro.com</span>' +
        '        </p>' +
        '        <div class="mt-3">' +
        '          <button type="button" class="df-btn df-btn-sm df-btn-outline" ng-click="$ctrl.resetSampleData()">' +
        '            <i class="fa-solid fa-rotate-right"></i> Reset Sample Data' +
        '          </button>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +

        '  <!-- Bottom Bar: Academic & Copyright -->' +
        '  <div class="df-footer-bottom">' +
        '    <div class="df-footer-bottom-container">' +
        '      <div class="df-academic-credit">' +
        '        <span class="df-academic-tag"><i class="fa-solid fa-graduation-cap"></i> Academic Project</span>' +
        '        <span>Built with <strong>AngularJS 1.8.2</strong>, Flexbox/Grid CSS, and LocalStorage</span>' +
        '      </div>' +
        '      <div class="df-copyright">' +
        '        &copy; {{$ctrl.currentYear}} DineFlow Systems. All rights reserved.' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</footer>',
      controller: [
        'TableService',
        'ReservationService',
        'NotificationService',
        '$window',
        function(TableService, ReservationService, NotificationService, $window) {
          var ctrl = this;
          ctrl.currentYear = new Date().getFullYear();

          ctrl.resetSampleData = function() {
            if ($window.confirm('Reset all reservations and table states to default academic demonstration data?')) {
              TableService.resetToDefault();
              ReservationService.resetToDefault();
              NotificationService.success('Sample reservations and table statuses have been restored!', 'Data Reset');
              // Reload page to reflect across all active views
              $window.location.reload();
            }
          };
        }
      ]
    });
})();
