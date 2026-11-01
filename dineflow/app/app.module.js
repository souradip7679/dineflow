/**
 * DineFlow - AngularJS Application Module
 * Defines main module, core dependencies ('ngRoute', 'ngAnimate'),
 * runtime initialization, and custom AngularJS filters.
 */
(function() {
  'use strict';

  var app = angular.module('dineflowApp', ['ngRoute', 'ngAnimate']);

  // Configuration block
  app.config(['$locationProvider', function($locationProvider) {
    // Use hash-prefix empty for modern hashbang URLs: #/home, #/reservations, etc.
    $locationProvider.hashPrefix('');
  }]);

  // Run block: Initialize LocalStorage with seed data on first application launch
  app.run(['StorageService', '$rootScope', function(StorageService, $rootScope) {
    // Initialize seed data if not present in browser storage
    if (!StorageService.hasKey('tables') || !StorageService.hasKey('reservations')) {
      if (window.DineFlowInitialData) {
        StorageService.set('tables', window.DineFlowInitialData.tables);
        StorageService.set('reservations', window.DineFlowInitialData.reservations);
        StorageService.set('dishes', window.DineFlowInitialData.dishes);
      }
    }

    // Set application brand constants
    $rootScope.appTitle = 'DineFlow — Restaurant Reservation & Table Management';
    $rootScope.restaurantName = 'DineFlow Bistro & Lounge';
    $rootScope.currentYear = new Date().getFullYear();
  }]);

  // -------------------------------------------------------------
  // Custom AngularJS Filters (Academic Requirement Demonstration)
  // -------------------------------------------------------------

  /**
   * Filter: Format 24-hour time "19:30" to 12-hour "7:30 PM"
   */
  app.filter('time12', function() {
    return function(time24) {
      if (!time24) return '';
      var parts = time24.split(':');
      if (parts.length < 2) return time24;
      var hours = parseInt(parts[0], 10);
      var minutes = parts[1];
      var ampm = hours >= 12 ? 'PM' : 'AM';
      var formattedHours = hours % 12;
      formattedHours = formattedHours ? formattedHours : 12; // 0 becomes 12
      return formattedHours + ':' + minutes + ' ' + ampm;
    };
  });

  /**
   * Filter: Format "YYYY-MM-DD" into pleasant human-readable format
   */
  app.filter('friendlyDate', function() {
    return function(dateStr) {
      if (!dateStr) return '';
      var parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (isNaN(d.getTime())) return dateStr;
      
      var dayName = days[d.getDay()];
      var monthName = months[d.getMonth()];
      var dayNum = d.getDate();
      var year = d.getFullYear();

      // Check if Today or Tomorrow
      var today = new Date();
      today.setHours(0,0,0,0);
      var compareDate = new Date(d);
      compareDate.setHours(0,0,0,0);
      var diffTime = compareDate.getTime() - today.getTime();
      var diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) return 'Today (' + monthName + ' ' + dayNum + ')';
      if (diffDays === 1) return 'Tomorrow (' + monthName + ' ' + dayNum + ')';
      if (diffDays === -1) return 'Yesterday (' + monthName + ' ' + dayNum + ')';

      return dayName + ', ' + monthName + ' ' + dayNum + ', ' + year;
    };
  });

  /**
   * Filter: Format table capacity with plural seats
   */
  app.filter('seatsLabel', function() {
    return function(capacity) {
      if (!capacity) return '';
      var cap = parseInt(capacity, 10);
      return cap === 1 ? '1 Guest' : cap + ' Guests';
    };
  });

  /**
   * Filter: Truncate string with ellipsis
   */
  app.filter('truncateText', function() {
    return function(text, length) {
      if (!text) return '';
      var limit = length || 50;
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    };
  });

})();
