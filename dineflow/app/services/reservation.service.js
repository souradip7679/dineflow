/**
 * DineFlow - Reservation Service
 * Core business logic for reservations: creation, validation, conflict prevention,
 * updates, cancellations, search/filtering, and real-time dashboard analytics.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .factory('ReservationService', [
      'StorageService',
      'TableService',
      '$rootScope',
      function(StorageService, TableService, $rootScope) {
        var STORAGE_KEY = 'reservations';

        function loadReservations() {
          var stored = StorageService.get(STORAGE_KEY);
          if (!stored || !stored.length) {
            stored = (window.DineFlowInitialData && window.DineFlowInitialData.reservations) ?
                      angular.copy(window.DineFlowInitialData.reservations) : [];
            StorageService.set(STORAGE_KEY, stored);
          }
          return stored;
        }

        function saveReservations(reservations) {
          StorageService.set(STORAGE_KEY, reservations);
          $rootScope.$broadcast('dineflow:reservations-updated', reservations);
        }

        function generateReservationId(existing) {
          var maxNumber = 1000;
          existing.forEach(function(r) {
            if (r.id && r.id.indexOf('DF-') === 0) {
              var num = parseInt(r.id.replace('DF-', ''), 10);
              if (!isNaN(num) && num > maxNumber) {
                maxNumber = num;
              }
            }
          });
          return 'DF-' + (maxNumber + 1);
        }

        function getTodayString() {
          var d = new Date();
          var year = d.getFullYear();
          var month = ('0' + (d.getMonth() + 1)).slice(-2);
          var day = ('0' + d.getDate()).slice(-2);
          return year + '-' + month + '-' + day;
        }

        return {
          /**
           * Retrieve all reservations
           */
          getAll: function() {
            return loadReservations();
          },

          /**
           * Find single reservation by ID
           */
          getById: function(id) {
            var reservations = loadReservations();
            return reservations.find(function(r) {
              return r.id === id;
            }) || null;
          },

          /**
           * Create new reservation with conflict detection and capacity validation
           */
          create: function(resData) {
            var reservations = loadReservations();
            var validators = window.DineFlowValidators;

            // 1. Basic validation
            if (!resData.customerName || !resData.customerName.trim()) {
              return { success: false, message: 'Customer name is required.' };
            }
            if (!validators.isValidEmail(resData.email)) {
              return { success: false, message: 'Please enter a valid email address.' };
            }
            if (!validators.isValidPhone(resData.phone)) {
              return { success: false, message: 'Please enter a valid phone number (at least 7 digits).' };
            }
            if (!resData.date || !validators.isFutureOrToday(resData.date)) {
              return { success: false, message: 'Please select today or a future date for the booking.' };
            }
            if (!resData.time || !validators.isWithinOpeningHours(resData.time)) {
              return { success: false, message: 'Selected time must be within opening hours (11:30 AM to 11:00 PM).' };
            }
            if (!resData.tableId) {
              return { success: false, message: 'Please select a preferred dining table.' };
            }

            var guestCount = parseInt(resData.guests, 10);
            if (isNaN(guestCount) || guestCount < 1) {
              return { success: false, message: 'Please specify at least 1 guest.' };
            }

            // 2. Check table capacity
            var table = TableService.getTableById(resData.tableId);
            if (!table) {
              return { success: false, message: 'Selected table could not be found.' };
            }
            if (guestCount > table.capacity) {
              return { 
                success: false, 
                message: 'Table ' + table.number + ' seats up to ' + table.capacity + ' guests. You requested ' + guestCount + ' guests.' 
              };
            }

            // 3. Check for overlapping reservation on the same table (+/- 90 minutes)
            var hasConflict = validators.hasTimeConflict(
              reservations,
              resData.tableId,
              resData.date,
              resData.time,
              null,
              90
            );

            if (hasConflict) {
              return {
                success: false,
                message: 'Table ' + table.number + ' is already booked around ' + resData.time + ' on ' + resData.date + '. Please select another table or time slot.'
              };
            }

            // 4. Construct complete reservation object
            var newId = generateReservationId(reservations);
            var newReservation = {
              id: newId,
              customerName: resData.customerName.trim(),
              email: resData.email.trim(),
              phone: resData.phone.trim(),
              date: resData.date,
              time: resData.time,
              guests: guestCount,
              tableId: parseInt(resData.tableId, 10),
              status: resData.status || 'Confirmed',
              occasion: resData.occasion || 'Dining',
              specialRequests: (resData.specialRequests || '').trim(),
              createdAt: new Date().toISOString()
            };

            // Prepend new reservation to array
            reservations.unshift(newReservation);
            saveReservations(reservations);

            // Update table status if today's reservation
            if (newReservation.date === getTodayString() && table.status === 'Available') {
              TableService.updateTableStatus(table.id, 'Reserved');
            }

            return {
              success: true,
              message: 'Reservation created successfully with confirmation reference ' + newId + '!',
              reservation: newReservation
            };
          },

          /**
           * Update an existing reservation
           */
          update: function(id, updatedData) {
            var reservations = loadReservations();
            var index = -1;
            for (var i = 0; i < reservations.length; i++) {
              if (reservations[i].id === id) {
                index = i;
                break;
              }
            }

            if (index === -1) {
              return { success: false, message: 'Reservation not found.' };
            }

            var validators = window.DineFlowValidators;
            var guestCount = parseInt(updatedData.guests, 10) || reservations[index].guests;
            var tableId = parseInt(updatedData.tableId, 10) || reservations[index].tableId;
            var date = updatedData.date || reservations[index].date;
            var time = updatedData.time || reservations[index].time;

            // Capacity validation
            var table = TableService.getTableById(tableId);
            if (table && guestCount > table.capacity) {
              return {
                success: false,
                message: 'Table ' + table.number + ' capacity is ' + table.capacity + ' guests. (Requested ' + guestCount + ')'
              };
            }

            // Conflict check excluding current reservation
            var hasConflict = validators.hasTimeConflict(
              reservations,
              tableId,
              date,
              time,
              id,
              90
            );

            if (hasConflict) {
              return {
                success: false,
                message: 'Conflict detected: Table ' + (table ? table.number : tableId) + ' is already reserved around ' + time + ' on ' + date + '.'
              };
            }

            // Update fields
            var current = reservations[index];
            current.customerName = (updatedData.customerName || current.customerName).trim();
            current.email = (updatedData.email || current.email).trim();
            current.phone = (updatedData.phone || current.phone).trim();
            current.date = date;
            current.time = time;
            current.guests = guestCount;
            current.tableId = tableId;
            current.status = updatedData.status || current.status;
            current.occasion = updatedData.occasion || current.occasion;
            current.specialRequests = updatedData.specialRequests !== undefined ? updatedData.specialRequests.trim() : current.specialRequests;
            current.updatedAt = new Date().toISOString();

            reservations[index] = current;
            saveReservations(reservations);

            return {
              success: true,
              message: 'Reservation ' + id + ' updated successfully.',
              reservation: current
            };
          },

          /**
           * Cancel a reservation
           */
          cancel: function(id, reason) {
            var reservations = loadReservations();
            var target = reservations.find(function(r) { return r.id === id; });

            if (!target) {
              return { success: false, message: 'Reservation not found.' };
            }

            target.status = 'Cancelled';
            target.cancellationReason = reason || 'Customer request';
            target.cancelledAt = new Date().toISOString();

            saveReservations(reservations);
            return {
              success: true,
              message: 'Reservation ' + id + ' has been cancelled.',
              reservation: target
            };
          },

          /**
           * Permanently delete a reservation record
           */
          delete: function(id) {
            var reservations = loadReservations();
            var initialLength = reservations.length;
            // Demonstrates Array.prototype.filter
            reservations = reservations.filter(function(r) {
              return r.id !== id;
            });

            if (reservations.length < initialLength) {
              saveReservations(reservations);
              return { success: true, message: 'Reservation deleted permanently.' };
            }
            return { success: false, message: 'Reservation not found.' };
          },

          /**
           * Search and filter reservations (Demonstrates ES5 Array methods: filter, map, toLowerCase)
           */
          filterReservations: function(query, statusFilter, dateFilter) {
            var reservations = loadReservations();
            var todayStr = getTodayString();
            var q = (query || '').toLowerCase().trim();

            return reservations.filter(function(r) {
              // 1. Text search
              if (q) {
                var nameMatch = r.customerName && r.customerName.toLowerCase().indexOf(q) !== -1;
                var idMatch = r.id && r.id.toLowerCase().indexOf(q) !== -1;
                var emailMatch = r.email && r.email.toLowerCase().indexOf(q) !== -1;
                var phoneMatch = r.phone && r.phone.indexOf(q) !== -1;
                if (!nameMatch && !idMatch && !emailMatch && !phoneMatch) {
                  return false;
                }
              }

              // 2. Status filter
              if (statusFilter && statusFilter !== 'All') {
                if (r.status !== statusFilter) {
                  return false;
                }
              }

              // 3. Date filter
              if (dateFilter && dateFilter !== 'All') {
                if (dateFilter === 'Today') {
                  if (r.date !== todayStr) return false;
                } else if (dateFilter === 'Tomorrow') {
                  var tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  var tomStr = tomorrow.toISOString().split('T')[0];
                  if (r.date !== tomStr) return false;
                } else if (dateFilter === 'Upcoming') {
                  if (r.date <= todayStr) return false;
                } else if (dateFilter === 'Past') {
                  if (r.date >= todayStr) return false;
                } else {
                  // Direct date match if YYYY-MM-DD passed
                  if (r.date !== dateFilter) return false;
                }
              }

              return true;
            });
          },

          /**
           * Calculate dynamic management dashboard metrics using JavaScript array operations
           */
          calculateDashboardMetrics: function() {
            var reservations = loadReservations();
            var tables = TableService.getTables();
            var todayStr = getTodayString();

            // Total reservations count
            var totalReservations = reservations.length;

            // Today's reservations (filter)
            var todayReservationsList = reservations.filter(function(r) {
              return r.date === todayStr;
            });

            // Today count
            var todayTotal = todayReservationsList.length;

            // Today's confirmed, pending, cancelled, completed
            var todayConfirmed = todayReservationsList.filter(function(r) { return r.status === 'Confirmed'; }).length;
            var todayPending = todayReservationsList.filter(function(r) { return r.status === 'Pending'; }).length;
            var todayCancelled = todayReservationsList.filter(function(r) { return r.status === 'Cancelled'; }).length;
            var todayCompleted = todayReservationsList.filter(function(r) { return r.status === 'Completed'; }).length;

            // Total Guests Expected Today (Demonstrates Array.prototype.reduce)
            var todayGuestsExpected = todayReservationsList
              .filter(function(r) { return r.status === 'Confirmed' || r.status === 'Pending'; })
              .reduce(function(acc, curr) {
                return acc + (parseInt(curr.guests, 10) || 0);
              }, 0);

            // Upcoming active bookings
            var upcomingReservations = reservations.filter(function(r) {
              return r.date > todayStr && r.status !== 'Cancelled';
            }).length;

            // Total Cancelled
            var cancelledTotal = reservations.filter(function(r) {
              return r.status === 'Cancelled';
            }).length;

            // Table status statistics
            var totalTables = tables.length;
            var availableTables = tables.filter(function(t) { return t.status === 'Available'; }).length;
            var reservedTables = tables.filter(function(t) { return t.status === 'Reserved'; }).length;
            var occupiedTables = tables.filter(function(t) { return t.status === 'Occupied'; }).length;
            var cleaningTables = tables.filter(function(t) { return t.status === 'Cleaning'; }).length;

            // Utilization Rate = (Occupied + Reserved) / Total Tables * 100
            var utilizationRate = totalTables > 0 ? 
              Math.round(((occupiedTables + reservedTables) / totalTables) * 100) : 0;

            // Next 5 upcoming reservations sorted chronologically
            var upcomingSchedule = reservations
              .filter(function(r) {
                return r.status !== 'Cancelled' && (r.date > todayStr || (r.date === todayStr && r.status !== 'Completed'));
              })
              .sort(function(a, b) {
                var dtA = a.date + ' ' + a.time;
                var dtB = b.date + ' ' + b.time;
                return dtA.localeCompare(dtB);
              })
              .slice(0, 6);

            return {
              totalReservations: totalReservations,
              todayTotal: todayTotal,
              todayConfirmed: todayConfirmed,
              todayPending: todayPending,
              todayCancelled: todayCancelled,
              todayCompleted: todayCompleted,
              todayGuestsExpected: todayGuestsExpected,
              upcomingReservations: upcomingReservations,
              cancelledTotal: cancelledTotal,
              totalTables: totalTables,
              availableTables: availableTables,
              reservedTables: reservedTables,
              occupiedTables: occupiedTables,
              cleaningTables: cleaningTables,
              utilizationRate: utilizationRate,
              todayList: todayReservationsList,
              upcomingSchedule: upcomingSchedule
            };
          },

          /**
           * Reset reservations to seed sample data
           */
          resetToDefault: function() {
            if (window.DineFlowInitialData && window.DineFlowInitialData.reservations) {
              var defaultRes = angular.copy(window.DineFlowInitialData.reservations);
              saveReservations(defaultRes);
              return defaultRes;
            }
            return [];
          }
        };
      }
    ]);
})();
