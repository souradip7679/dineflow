/**
 * DineFlow - Notification Service
 * Manages toast notifications across the application with auto-dismiss timers,
 * accessible alerts, and multiple semantic message types.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .factory('NotificationService', ['$timeout', '$rootScope', function($timeout, $rootScope) {
      $rootScope.notifications = [];
      var counter = 0;

      function addNotification(type, message, title, duration) {
        var id = ++counter;
        var toast = {
          id: id,
          type: type || 'info', // success, error, warning, info
          title: title || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Notice'),
          message: message,
          timestamp: new Date()
        };

        $rootScope.notifications.push(toast);

        var timeoutDuration = duration !== undefined ? duration : 4500;
        if (timeoutDuration > 0) {
          $timeout(function() {
            removeNotification(id);
          }, timeoutDuration);
        }

        return id;
      }

      function removeNotification(id) {
        for (var i = 0; i < $rootScope.notifications.length; i++) {
          if ($rootScope.notifications[i].id === id) {
            $rootScope.notifications.splice(i, 1);
            break;
          }
        }
      }

      return {
        getNotifications: function() {
          return $rootScope.notifications;
        },
        success: function(message, title, duration) {
          return addNotification('success', message, title || 'Success', duration);
        },
        error: function(message, title, duration) {
          return addNotification('error', message, title || 'Error', duration || 6000);
        },
        warning: function(message, title, duration) {
          return addNotification('warning', message, title || 'Attention', duration);
        },
        info: function(message, title, duration) {
          return addNotification('info', message, title || 'Information', duration);
        },
        remove: removeNotification,
        clearAll: function() {
          $rootScope.notifications = [];
        }
      };
    }]);
})();
