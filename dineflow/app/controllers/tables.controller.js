/**
 * DineFlow - Tables Controller
 * Manages the interactive restaurant floor plan, zone tabs, status filters,
 * capacity filters, and table details modal with real-time status switching.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .controller('TablesController', [
      'TableService',
      'ReservationService',
      'NotificationService',
      '$location',
      '$scope',
      function(TableService, ReservationService, NotificationService, $location, $scope) {
        var vm = this;

        // Filter states
        vm.zoneFilter = 'all';
        vm.statusFilter = 'All';
        vm.capacityFilter = 'All';

        // Modal state
        vm.selectedTable = null;
        vm.selectedTableReservations = [];
        vm.showTableModal = false;

        // Zones and Summary Metrics
        vm.zones = TableService.getZones();

        /**
         * Refresh table data and metrics
         */
        vm.refresh = function() {
          var allTables = TableService.getTables();
          vm.allTables = allTables;

          // Status summary counts
          vm.statusCounts = {
            total: allTables.length,
            available: allTables.filter(function(t) { return t.status === 'Available'; }).length,
            reserved: allTables.filter(function(t) { return t.status === 'Reserved'; }).length,
            occupied: allTables.filter(function(t) { return t.status === 'Occupied'; }).length,
            cleaning: allTables.filter(function(t) { return t.status === 'Cleaning'; }).length
          };

          // Apply filters using Array.prototype.filter
          vm.filteredTables = allTables.filter(function(t) {
            // Zone filter
            if (vm.zoneFilter !== 'all' && t.zoneCode !== vm.zoneFilter) {
              return false;
            }

            // Status filter
            if (vm.statusFilter !== 'All' && t.status !== vm.statusFilter) {
              return false;
            }

            // Capacity filter
            if (vm.capacityFilter !== 'All') {
              if (vm.capacityFilter === '2' && t.capacity !== 2) return false;
              if (vm.capacityFilter === '4' && t.capacity !== 4) return false;
              if (vm.capacityFilter === '6+' && t.capacity < 6) return false;
            }

            return true;
          });
        };

        // Initial load
        vm.refresh();

        // Listen for table updates
        $scope.$on('dineflow:tables-updated', function() {
          vm.refresh();
        });

        /**
         * Set active zone filter tab
         */
        vm.setZoneFilter = function(zoneCode) {
          vm.zoneFilter = zoneCode;
          vm.refresh();
        };

        /**
         * Set status filter
         */
        vm.setStatusFilter = function(status) {
          vm.statusFilter = status;
          vm.refresh();
        };

        /**
         * Set capacity filter
         */
        vm.setCapacityFilter = function(cap) {
          vm.capacityFilter = cap;
          vm.refresh();
        };

        /**
         * Clear all table filters
         */
        vm.clearFilters = function() {
          vm.zoneFilter = 'all';
          vm.statusFilter = 'All';
          vm.capacityFilter = 'All';
          vm.refresh();
        };

        // -------------------------------------------------------------
        // Table Details Modal & Status Management
        // -------------------------------------------------------------
        vm.openTableModal = function(table) {
          vm.selectedTable = angular.copy(table);
          
          // Find reservations for this table
          var allRes = ReservationService.getAll();
          vm.selectedTableReservations = allRes.filter(function(r) {
            return r.tableId === table.id && r.status !== 'Cancelled';
          });

          vm.showTableModal = true;
        };

        vm.closeTableModal = function() {
          vm.showTableModal = false;
          vm.selectedTable = null;
          vm.selectedTableReservations = [];
        };

        /**
         * Quick status switcher (Staff control)
         */
        vm.changeTableStatus = function(newStatus) {
          if (!vm.selectedTable) return;

          var updated = TableService.updateTableStatus(vm.selectedTable.id, newStatus);
          if (updated) {
            vm.selectedTable.status = newStatus;
            NotificationService.success(
              'Table ' + vm.selectedTable.number + ' marked as ' + newStatus + '.',
              'Status Changed'
            );
            vm.refresh();
          }
        };

        /**
         * Jump to booking this specific table
         */
        vm.bookSelectedTable = function() {
          if (!vm.selectedTable) return;
          var tableId = vm.selectedTable.id;
          vm.closeTableModal();
          $location.path('/book').search({ table: tableId });
        };
      }
    ]);
})();
