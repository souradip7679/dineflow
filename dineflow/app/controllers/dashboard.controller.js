/**
 * DineFlow - Dashboard Controller
 * Manages live management statistics, table utilization calculation,
 * today's live operational timeline, and zone distribution metrics.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .controller('DashboardController', [
      'ReservationService',
      'TableService',
      'NotificationService',
      '$location',
      '$scope',
      function(ReservationService, TableService, NotificationService, $location, $scope) {
        var vm = this;

        /**
         * Recompute dashboard statistics from active data
         */
        vm.loadDashboard = function() {
          vm.metrics = ReservationService.calculateDashboardMetrics();
          vm.tables = TableService.getTables();
          vm.zones = TableService.getZones();

          // Zone utilization calculations (Demonstrates Array.prototype.map and filter)
          vm.zoneMetrics = vm.zones.map(function(zone) {
            var zoneTables = vm.tables.filter(function(t) { return t.zoneCode === zone.code; });
            var total = zoneTables.length;
            var active = zoneTables.filter(function(t) { return t.status === 'Occupied' || t.status === 'Reserved'; }).length;
            var percent = total > 0 ? Math.round((active / total) * 100) : 0;

            return {
              code: zone.code,
              name: zone.name,
              totalTables: total,
              activeTables: active,
              utilizationPercent: percent
            };
          });
        };

        // Initial load
        vm.loadDashboard();

        // Listen for data change events
        $scope.$on('dineflow:reservations-updated', function() {
          vm.loadDashboard();
        });
        $scope.$on('dineflow:tables-updated', function() {
          vm.loadDashboard();
        });

        /**
         * Quick action: Seat a guest (change reservation to Confirmed/Occupied table)
         */
        vm.seatGuest = function(reservation) {
          TableService.updateTableStatus(reservation.tableId, 'Occupied');
          NotificationService.success(
            'Guests for ' + reservation.customerName + ' seated at Table ' + vm.getTableNumber(reservation.tableId) + '.',
            'Party Seated'
          );
          vm.loadDashboard();
        };

        /**
         * Quick action: Complete dining (freed table)
         */
        vm.completeDining = function(reservation) {
          ReservationService.update(reservation.id, { status: 'Completed' });
          TableService.updateTableStatus(reservation.tableId, 'Cleaning');
          NotificationService.info(
            'Reservation ' + reservation.id + ' completed. Table marked for cleaning.',
            'Dining Complete'
          );
          vm.loadDashboard();
        };

        /**
         * Helper to get table number by tableId
         */
        vm.getTableNumber = function(tableId) {
          var t = TableService.getTableById(tableId);
          return t ? t.number : 'T-' + tableId;
        };

        /**
         * Navigation shortcuts
         */
        vm.goToNewBooking = function() {
          $location.path('/book');
        };

        vm.goToTableLayout = function() {
          $location.path('/tables');
        };

        vm.goToReservations = function() {
          $location.path('/reservations');
        };
      }
    ]);
})();
