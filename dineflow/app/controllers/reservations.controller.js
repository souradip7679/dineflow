/**
 * DineFlow - Reservations Controller
 * Manages reservation records, dynamic search, multi-criteria filtering,
 * modal dialogs for view/edit/cancel, quick status transitions, and data export.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .controller('ReservationsController', [
      'ReservationService',
      'TableService',
      'NotificationService',
      '$window',
      '$scope',
      function(ReservationService, TableService, NotificationService, $window, $scope) {
        var vm = this;

        // Filter and Search states
        vm.searchQuery = '';
        vm.statusFilter = 'All';
        vm.dateFilter = 'All';

        // Modal states
        vm.selectedReservation = null;
        vm.showDetailsModal = false;
        vm.showEditModal = false;
        vm.showCancelModal = false;
        vm.cancelReason = '';

        // Edit form model
        vm.editForm = {};
        vm.availableEditTables = [];

        // Status counts for filter tabs
        vm.statusCounts = {
          all: 0,
          confirmed: 0,
          pending: 0,
          completed: 0,
          cancelled: 0
        };

        /**
         * Refresh reservation list and recalculate status badge counts
         */
        vm.refresh = function() {
          var all = ReservationService.getAll();
          vm.allReservations = all;

          // Compute counts using Array.prototype.filter
          vm.statusCounts.all = all.length;
          vm.statusCounts.confirmed = all.filter(function(r) { return r.status === 'Confirmed'; }).length;
          vm.statusCounts.pending = all.filter(function(r) { return r.status === 'Pending'; }).length;
          vm.statusCounts.completed = all.filter(function(r) { return r.status === 'Completed'; }).length;
          vm.statusCounts.cancelled = all.filter(function(r) { return r.status === 'Cancelled'; }).length;

          // Apply current search & filter
          vm.filteredReservations = ReservationService.filterReservations(
            vm.searchQuery,
            vm.statusFilter,
            vm.dateFilter
          );
        };

        // Initial load
        vm.refresh();

        // Listen for updates from other services
        $scope.$on('dineflow:reservations-updated', function() {
          vm.refresh();
        });

        /**
         * Set status filter
         */
        vm.setStatusFilter = function(status) {
          vm.statusFilter = status;
          vm.refresh();
        };

        /**
         * Set date filter
         */
        vm.setDateFilter = function(dateOpt) {
          vm.dateFilter = dateOpt;
          vm.refresh();
        };

        /**
         * Clear all search & filters
         */
        vm.clearFilters = function() {
          vm.searchQuery = '';
          vm.statusFilter = 'All';
          vm.dateFilter = 'All';
          vm.refresh();
        };

        /**
         * Helper to get table details for a reservation
         */
        vm.getTableInfo = function(tableId) {
          return TableService.getTableById(tableId) || { number: 'T-' + tableId, zone: 'Dining' };
        };

        // -------------------------------------------------------------
        // Modal Handlers: View Details
        // -------------------------------------------------------------
        vm.openDetailsModal = function(res) {
          vm.selectedReservation = res;
          vm.selectedTable = TableService.getTableById(res.tableId);
          vm.showDetailsModal = true;
        };

        vm.closeDetailsModal = function() {
          vm.showDetailsModal = false;
          vm.selectedReservation = null;
        };

        // -------------------------------------------------------------
        // Modal Handlers: Edit Reservation
        // -------------------------------------------------------------
        vm.openEditModal = function(res) {
          vm.selectedReservation = res;
          vm.editForm = angular.copy(res);
          // Load eligible tables for editing
          vm.availableEditTables = TableService.getEligibleTables(
            vm.editForm.guests,
            ReservationService.getAll(),
            vm.editForm.date,
            vm.editForm.time,
            res.id
          );
          vm.showEditModal = true;
        };

        vm.closeEditModal = function() {
          vm.showEditModal = false;
          vm.selectedReservation = null;
          vm.editForm = {};
        };

        vm.saveEditReservation = function() {
          if (!vm.selectedReservation) return;

          var result = ReservationService.update(vm.selectedReservation.id, vm.editForm);
          if (result.success) {
            NotificationService.success(result.message, 'Updated');
            vm.closeEditModal();
            vm.refresh();
          } else {
            NotificationService.error(result.message, 'Update Failed');
          }
        };

        // -------------------------------------------------------------
        // Modal Handlers: Cancel Reservation
        // -------------------------------------------------------------
        vm.openCancelModal = function(res) {
          vm.selectedReservation = res;
          vm.cancelReason = 'Customer requested cancellation';
          vm.showCancelModal = true;
        };

        vm.closeCancelModal = function() {
          vm.showCancelModal = false;
          vm.selectedReservation = null;
          vm.cancelReason = '';
        };

        vm.confirmCancellation = function() {
          if (!vm.selectedReservation) return;

          var result = ReservationService.cancel(vm.selectedReservation.id, vm.cancelReason);
          if (result.success) {
            NotificationService.warning(result.message, 'Reservation Cancelled');
            vm.closeCancelModal();
            vm.refresh();
          } else {
            NotificationService.error(result.message, 'Action Failed');
          }
        };

        // -------------------------------------------------------------
        // Quick Status Transitions
        // -------------------------------------------------------------
        vm.markAsCompleted = function(res) {
          var result = ReservationService.update(res.id, { status: 'Completed' });
          if (result.success) {
            NotificationService.success('Reservation ' + res.id + ' marked as Completed.', 'Status Updated');
            vm.refresh();
          }
        };

        vm.markAsConfirmed = function(res) {
          var result = ReservationService.update(res.id, { status: 'Confirmed' });
          if (result.success) {
            NotificationService.success('Reservation ' + res.id + ' confirmed.', 'Status Updated');
            vm.refresh();
          }
        };

        /**
         * Delete reservation permanently
         */
        vm.deleteReservation = function(res) {
          if ($window.confirm('Are you sure you want to permanently delete reservation ' + res.id + ' for ' + res.customerName + '?')) {
            var result = ReservationService.delete(res.id);
            if (result.success) {
              NotificationService.info(result.message, 'Deleted');
              vm.refresh();
            }
          }
        };

        // -------------------------------------------------------------
        // Academic Feature: Export Reservations to CSV & JSON
        // -------------------------------------------------------------
        vm.exportToCSV = function() {
          var data = vm.filteredReservations;
          if (!data || !data.length) {
            NotificationService.warning('No reservation records to export.', 'Export Empty');
            return;
          }

          var headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Occasion', 'Special Requests'];
          var rows = data.map(function(r) {
            var tbl = vm.getTableInfo(r.tableId);
            return [
              r.id,
              '"' + (r.customerName || '').replace(/"/g, '""') + '"',
              '"' + (r.email || '') + '"',
              '"' + (r.phone || '') + '"',
              r.date,
              r.time,
              r.guests,
              tbl.number,
              r.status,
              '"' + (r.occasion || '') + '"',
              '"' + (r.specialRequests || '').replace(/"/g, '""') + '"'
            ].join(',');
          });

          var csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(',')].concat(rows).join('\n');
          var encodedUri = encodeURI(csvContent);
          var link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'dineflow_reservations_' + new Date().toISOString().split('T')[0] + '.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          NotificationService.success('Exported ' + data.length + ' reservations to CSV.', 'Export Complete');
        };
      }
    ]);
})();
