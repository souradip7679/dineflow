/**
 * DineFlow - Validation & Array Utility Functions
 * ES5 compatible helper functions for form validation, time comparisons,
 * conflict detection, and academic array operations.
 */
(function() {
  'use strict';

  var Validators = {
    /**
     * Validate an email address format
     */
    isValidEmail: function(email) {
      if (!email) return false;
      var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).trim());
    },

    /**
     * Validate a telephone number (minimum 7 digits, supports formats like +1 (555) 000-0000)
     */
    isValidPhone: function(phone) {
      if (!phone) return false;
      var digits = String(phone).replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    },

    /**
     * Check if a booking date is today or in the future
     */
    isFutureOrToday: function(dateStr) {
      if (!dateStr) return false;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      
      var parts = dateStr.split('-');
      if (parts.length !== 3) return false;
      var bookingDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return bookingDate >= today;
    },

    /**
     * Check if a requested time is within opening hours (11:30 - 23:00)
     */
    isWithinOpeningHours: function(timeStr) {
      if (!timeStr) return false;
      var parts = timeStr.split(':');
      if (parts.length < 2) return false;
      var hours = parseInt(parts[0], 10);
      var minutes = parseInt(parts[1], 10);
      var totalMinutes = hours * 60 + minutes;

      var openingMinutes = 11 * 60 + 30; // 11:30 AM
      var closingMinutes = 23 * 60;      // 11:00 PM
      return totalMinutes >= openingMinutes && totalMinutes <= closingMinutes;
    },

    /**
     * Calculate difference in minutes between two HH:mm strings
     */
    getTimeDifferenceMinutes: function(timeA, timeB) {
      var aParts = timeA.split(':');
      var bParts = timeB.split(':');
      var aMin = parseInt(aParts[0], 10) * 60 + parseInt(aParts[1], 10);
      var bMin = parseInt(bParts[0], 10) * 60 + parseInt(bParts[1], 10);
      return Math.abs(aMin - bMin);
    },

    /**
     * Detect booking conflict:
     * Returns true if there is an overlapping reservation on the same table
     * within bufferMinutes (default 90 mins for standard dining duration)
     */
    hasTimeConflict: function(existingReservations, targetTableId, targetDate, targetTime, excludeResId, bufferMinutes) {
      bufferMinutes = bufferMinutes || 90;
      var tableIdInt = parseInt(targetTableId, 10);

      // Demonstrating array filtering method
      return existingReservations.some(function(res) {
        // Skip same reservation if editing
        if (excludeResId && res.id === excludeResId) {
          return false;
        }
        // Skip cancelled reservations
        if (res.status === 'Cancelled') {
          return false;
        }
        // Match table and date
        if (parseInt(res.tableId, 10) === tableIdInt && res.date === targetDate) {
          var diff = Validators.getTimeDifferenceMinutes(res.time, targetTime);
          return diff < bufferMinutes;
        }
        return false;
      });
    },

    /**
     * Check if table capacity fits the party size
     */
    hasSufficientCapacity: function(table, guestCount) {
      if (!table) return false;
      var guests = parseInt(guestCount, 10);
      return guests >= 1 && guests <= table.capacity;
    }
  };

  window.DineFlowValidators = Validators;
})();
