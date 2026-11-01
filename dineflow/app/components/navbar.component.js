/**
 * DineFlow - Navigation Bar Component
 * Responsive top navbar with active route indicator, mobile navigation drawer,
 * and dark / light theme switcher.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .component('dineflowNavbar', {
      template:
        '<header class="df-navbar-header">' +
        '  <div class="df-navbar-container">' +
        '    <a href="#/" class="df-brand" aria-label="DineFlow Home">' +
        '      <div class="df-brand-icon">' +
        '        <i class="fa-solid fa-utensils"></i>' +
        '      </div>' +
        '      <div class="df-brand-text">' +
        '        <span class="df-brand-title">DineFlow</span>' +
        '        <span class="df-brand-subtitle">Bistro &amp; Lounge</span>' +
        '      </div>' +
        '    </a>' +

        '    <!-- Desktop Navigation Links -->' +
        '    <nav class="df-nav-links" aria-label="Main Navigation">' +
        '      <a href="#/" class="df-nav-link" ng-class="{\'active\': $ctrl.isActive(\'/\')}">' +
        '        <i class="fa-solid fa-house"></i> <span>Home</span>' +
        '      </a>' +
        '      <a href="#/book" class="df-nav-link" ng-class="{\'active\': $ctrl.isActive(\'/book\')}">' +
        '        <i class="fa-solid fa-calendar-plus"></i> <span>Book a Table</span>' +
        '      </a>' +
        '      <a href="#/reservations" class="df-nav-link" ng-class="{\'active\': $ctrl.isActive(\'/reservations\')}">' +
        '        <i class="fa-solid fa-book-bookmark"></i> <span>Reservations</span>' +
        '      </a>' +
        '      <a href="#/tables" class="df-nav-link" ng-class="{\'active\': $ctrl.isActive(\'/tables\')}">' +
        '        <i class="fa-solid fa-table-cells"></i> <span>Table Layout</span>' +
        '      </a>' +
        '      <a href="#/dashboard" class="df-nav-link" ng-class="{\'active\': $ctrl.isActive(\'/dashboard\')}">' +
        '        <i class="fa-solid fa-chart-pie"></i> <span>Dashboard</span>' +
        '      </a>' +
        '    </nav>' +

        '    <!-- Action Controls: Theme Switcher & Book CTA -->' +
        '    <div class="df-nav-actions">' +
        '      <button type="button" class="df-theme-toggle" ng-click="$ctrl.toggleTheme()" title="Toggle Light/Dark Theme" aria-label="Toggle Light/Dark Theme">' +
        '        <i class="fa-solid" ng-class="$ctrl.isDarkTheme() ? \'fa-sun\' : \'fa-moon\'"></i>' +
        '      </button>' +

        '      <a href="#/book" class="df-btn df-btn-terracotta df-nav-cta">' +
        '        <i class="fa-solid fa-champagne-glasses"></i>' +
        '        <span>Reserve a Table</span>' +
        '      </a>' +

        '      <!-- Mobile Hamburger Button -->' +
        '      <button type="button" class="df-mobile-menu-btn" ng-click="$ctrl.toggleMobileMenu()" aria-label="Toggle mobile menu">' +
        '        <i class="fa-solid" ng-class="$ctrl.mobileMenuOpen ? \'fa-xmark\' : \'fa-bars\'"></i>' +
        '      </button>' +
        '    </div>' +
        '  </div>' +

        '  <!-- Mobile Navigation Drawer -->' +
        '  <div class="df-mobile-drawer" ng-class="{\'open\': $ctrl.mobileMenuOpen}" ng-click="$ctrl.closeMobileMenu()">' +
        '    <div class="df-mobile-drawer-content" ng-click="$event.stopPropagation()">' +
        '      <div class="df-mobile-drawer-header">' +
        '        <span class="df-brand-title">DineFlow Menu</span>' +
        '        <button type="button" class="df-modal-close-btn" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-xmark"></i>' +
        '        </button>' +
        '      </div>' +
        '      <nav class="df-mobile-nav-list">' +
        '        <a href="#/" class="df-mobile-nav-item" ng-class="{\'active\': $ctrl.isActive(\'/\')}" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-house"></i> Home' +
        '        </a>' +
        '        <a href="#/book" class="df-mobile-nav-item" ng-class="{\'active\': $ctrl.isActive(\'/book\')}" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-calendar-plus"></i> Book a Table' +
        '        </a>' +
        '        <a href="#/reservations" class="df-mobile-nav-item" ng-class="{\'active\': $ctrl.isActive(\'/reservations\')}" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-book-bookmark"></i> Reservations' +
        '        </a>' +
        '        <a href="#/tables" class="df-mobile-nav-item" ng-class="{\'active\': $ctrl.isActive(\'/tables\')}" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-table-cells"></i> Table Layout' +
        '        </a>' +
        '        <a href="#/dashboard" class="df-mobile-nav-item" ng-class="{\'active\': $ctrl.isActive(\'/dashboard\')}" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-chart-pie"></i> Management Dashboard' +
        '        </a>' +
        '      </nav>' +
        '      <div class="df-mobile-drawer-footer">' +
        '        <button type="button" class="df-btn df-btn-outline w-100 mb-2" ng-click="$ctrl.toggleTheme()">' +
        '          <i class="fa-solid" ng-class="$ctrl.isDarkTheme() ? \'fa-sun\' : \'fa-moon\'"></i>' +
        '          Switch to {{$ctrl.isDarkTheme() ? "Light" : "Dark"}} Mode' +
        '        </button>' +
        '        <a href="#/book" class="df-btn df-btn-terracotta w-100" ng-click="$ctrl.closeMobileMenu()">' +
        '          <i class="fa-solid fa-champagne-glasses"></i> Reserve Table' +
        '        </a>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</header>',
      controller: ['$location', 'ThemeService', function($location, ThemeService) {
        var ctrl = this;
        ctrl.mobileMenuOpen = false;

        ctrl.isActive = function(path) {
          return $location.path() === path;
        };

        ctrl.toggleTheme = function() {
          ThemeService.toggleTheme();
        };

        ctrl.isDarkTheme = function() {
          return ThemeService.isDark();
        };

        ctrl.toggleMobileMenu = function() {
          ctrl.mobileMenuOpen = !ctrl.mobileMenuOpen;
        };

        ctrl.closeMobileMenu = function() {
          ctrl.mobileMenuOpen = false;
        };
      }]
    });
})();
