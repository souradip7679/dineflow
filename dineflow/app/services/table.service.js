/**
 * DineFlow - Table Service
 * Manages restaurant floor tables, capacities, zone locations,
 * and real-time status transitions.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .factory('TableService', ['StorageService', '$rootScope', function(StorageService, $rootScope) {
      var STORAGE_KEY = 'tables';

      function loadTables() {
        var stored = StorageService.get(STORAGE_KEY);
        if (!stored || !stored.length) {
          stored = (window.DineFlowInitialData && window.DineFlowInitialData.tables) ? 
                    angular.copy(window.DineFlowInitialData.tables) : [];
          StorageService.set(STORAGE_KEY, stored);
        }
        return stored;
      }

      function saveTables(tables) {
        StorageService.set(STORAGE_KEY, tables);
        $rootScope.$broadcast('dineflow:tables-updated', tables);
      }

      return {
        /**
         * Get all tables
         */
        getTables: function() {
          return loadTables();
        },

        /**
         * Find single table by ID (Demonstrates Array.prototype.find)
         */
        getTableById: function(id) {
          var targetId = parseInt(id, 10);
          var tables = loadTables();
          return tables.find(function(t) {
            return t.id === targetId;
          }) || null;
        },

        /**
         * Update table status (Available, Reserved, Occupied, Cleaning)
         */
        updateTableStatus: function(tableId, newStatus) {
          var targetId = parseInt(tableId, 10);
          var tables = loadTables();
          var updated = false;

          tables = tables.map(function(t) {
            if (t.id === targetId) {
              t.status = newStatus;
              updated = true;
            }
            return t;
          });

          if (updated) {
            saveTables(tables);
          }
          return updated;
        },

        /**
         * Return all distinct zones available in the restaurant
         */
        getZones: function() {
          var tables = loadTables();
          var zonesMap = {};
          tables.forEach(function(t) {
            if (!zonesMap[t.zoneCode]) {
              zonesMap[t.zoneCode] = {
                code: t.zoneCode,
                name: t.zone,
                totalTables: 0
              };
            }
            zonesMap[t.zoneCode].totalTables++;
          });

          return Object.keys(zonesMap).map(function(k) {
            return zonesMap[k];
          });
        },

        /**
         * Filter tables eligible for a reservation booking:
         * Checks guest capacity and conflicts with existing bookings.
         */
        getEligibleTables: function(guestCount, reservations, date, time, excludeResId) {
          var tables = loadTables();
          var guests = parseInt(guestCount, 10) || 1;

          // Demonstrates Array.prototype.filter
          return tables.filter(function(table) {
            // 1. Capacity check: table must seat at least the guest count
            if (table.capacity < guests) {
              return false;
            }

            // 2. Conflict check if date & time are provided
            if (date && time && window.DineFlowValidators) {
              var hasConflict = window.DineFlowValidators.hasTimeConflict(
                reservations,
                table.id,
                date,
                time,
                excludeResId,
                90 // 90-minute dining duration
              );
              if (hasConflict) {
                return false;
              }
            }

            return true;
          });
        },

        /**
         * Reset tables to initial seed data
         */
        resetToDefault: function() {
          if (window.DineFlowInitialData && window.DineFlowInitialData.tables) {
            var defaultTables = angular.copy(window.DineFlowInitialData.tables);
            saveTables(defaultTables);
            return defaultTables;
          }
          return [];
        }
      };
    }]);
})();
