/**
 * DineFlow - Storage Service
 * Encapsulates browser LocalStorage with automatic JSON serialization,
 * prefix namespacing, and resilient in-memory fallback.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .factory('StorageService', ['$window', function($window) {
      var PREFIX = 'dineflow_';
      var memoryStore = {};

      var isStorageAvailable = (function() {
        try {
          var testKey = '__dineflow_storage_test__';
          $window.localStorage.setItem(testKey, testKey);
          $window.localStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
      })();

      return {
        /**
         * Retrieve an item from LocalStorage or in-memory fallback
         */
        get: function(key) {
          var fullKey = PREFIX + key;
          try {
            if (isStorageAvailable) {
              var item = $window.localStorage.getItem(fullKey);
              return item ? JSON.parse(item) : null;
            } else {
              return memoryStore.hasOwnProperty(fullKey) ? memoryStore[fullKey] : null;
            }
          } catch (e) {
            console.error('StorageService.get error for key ' + key, e);
            return null;
          }
        },

        /**
         * Store an item in LocalStorage or in-memory fallback
         */
        set: function(key, value) {
          var fullKey = PREFIX + key;
          try {
            if (isStorageAvailable) {
              $window.localStorage.setItem(fullKey, JSON.stringify(value));
            } else {
              memoryStore[fullKey] = angular.copy(value);
            }
            return true;
          } catch (e) {
            console.error('StorageService.set error for key ' + key, e);
            return false;
          }
        },

        /**
         * Check if key exists in storage
         */
        hasKey: function(key) {
          var fullKey = PREFIX + key;
          if (isStorageAvailable) {
            return $window.localStorage.getItem(fullKey) !== null;
          }
          return memoryStore.hasOwnProperty(fullKey);
        },

        /**
         * Remove specific key
         */
        remove: function(key) {
          var fullKey = PREFIX + key;
          if (isStorageAvailable) {
            $window.localStorage.removeItem(fullKey);
          } else {
            delete memoryStore[fullKey];
          }
        },

        /**
         * Clear all DineFlow application data
         */
        clearAppStorage: function() {
          if (isStorageAvailable) {
            var keysToRemove = [];
            for (var i = 0; i < $window.localStorage.length; i++) {
              var k = $window.localStorage.key(i);
              if (k && k.indexOf(PREFIX) === 0) {
                keysToRemove.push(k);
              }
            }
            keysToRemove.forEach(function(k) {
              $window.localStorage.removeItem(k);
            });
          }
          memoryStore = {};
        }
      };
    }]);
})();
