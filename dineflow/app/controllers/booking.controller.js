/**
 * DineFlow - Booking Controller
 * Manages reservation booking form, two-way data binding with ng-model,
 * dynamic table eligibility calculation, conflict prevention, and confirmation receipts.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .controller('BookingController', [
      'ReservationService',
      'TableService',
      'NotificationService',
      '$location',
      '$timeout',
      function(ReservationService, TableService, NotificationService, $location, $timeout) {
        var vm = this;

        // Current date string helper
        var today = new Date();
        var todayStr = today.toISOString().split('T')[0];
        vm.minDate = todayStr;

        // URL Search parameter pre-population (e.g., coming from Table Layout or Home Quick Widget)
        var searchParams = $location.search();
        var initialTableId = searchParams.table ? parseInt(searchParams.table, 10) : null;

        // Form Model
        vm.form = {
          customerName: '',
          email: '',
          phone: '',
          date: searchParams.date || todayStr,
          time: searchParams.time || '19:30',
          guests: searchParams.guests ? parseInt(searchParams.guests, 10) : 2,
          tableId: initialTableId,
          occasion: 'Dining',
          specialRequests: ''
        };

        // Occasions list
        vm.occasions = [
          'Casual Dining',
          'Romantic Date Night',
          'Birthday Celebration',
          'Anniversary',
          'Business Dinner',
          'Family Gathering',
          'Special Celebration'
        ];

        // Available dining timeslots (11:30 AM to 10:30 PM in 30-min intervals)
        vm.timeSlots = [
          '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
          '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
        ];

        // Guest count options (1 to 10)
        vm.guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // State trackers
        vm.isSubmitting = false;
        vm.bookingSuccess = false;
        vm.confirmedReservation = null;
        vm.confirmedTable = null;
        vm.eligibleTables = [];
        vm.allTables = TableService.getTables();

        /**
         * Recompute eligible tables whenever date, time, or guest count changes
         */
        vm.updateEligibleTables = function() {
          var allReservations = ReservationService.getAll();
          vm.eligibleTables = TableService.getEligibleTables(
            vm.form.guests,
            allReservations,
            vm.form.date,
            vm.form.time
          );

          // If current selected table is no longer eligible, auto-clear or pick first eligible
          if (vm.form.tableId) {
            var isStillEligible = vm.eligibleTables.some(function(t) {
              return t.id === vm.form.tableId;
            });
            if (!isStillEligible) {
              vm.form.tableId = null;
            }
          }
        };

        // Initial compute
        vm.updateEligibleTables();

        // Select a table directly by clicking its card in the preview selector
        vm.selectTable = function(table) {
          vm.form.tableId = table.id;
        };

        /**
         * Get selected table details
         */
        vm.getSelectedTable = function() {
          if (!vm.form.tableId) return null;
          return TableService.getTableById(vm.form.tableId);
        };

        /**
         * Submit booking form
         */
        vm.submitBooking = function(formValid) {
          if (!formValid) {
            NotificationService.error('Please complete all required fields correctly before submitting.', 'Validation Error');
            return;
          }

          if (!vm.form.tableId) {
            NotificationService.warning('Please select an available dining table for your party.', 'Table Required');
            return;
          }

          vm.isSubmitting = true;

          // Artificial brief timeout to simulate server processing and display smooth animation
          $timeout(function() {
            var result = ReservationService.create(vm.form);
            vm.isSubmitting = false;

            if (result.success) {
              vm.bookingSuccess = true;
              vm.confirmedReservation = result.reservation;
              vm.confirmedTable = TableService.getTableById(result.reservation.tableId);
              NotificationService.success(result.message, 'Booking Confirmed');
              // Clear URL search params
              $location.search({});
            } else {
              NotificationService.error(result.message, 'Booking Conflict');
            }
          }, 350);
        };

        /**
         * Reset form to book another table
         */
        vm.bookAnother = function() {
          vm.bookingSuccess = false;
          vm.confirmedReservation = null;
          vm.confirmedTable = null;
          vm.form = {
            customerName: '',
            email: '',
            phone: '',
            date: todayStr,
            time: '19:30',
            guests: 2,
            tableId: null,
            occasion: 'Casual Dining',
            specialRequests: ''
          };
          vm.updateEligibleTables();
        };

        /**
         * Navigate to reservations management
         */
        vm.viewInReservations = function() {
          $location.path('/reservations');
        };
      }
    ]);
})();
