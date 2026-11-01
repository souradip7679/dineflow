/**
 * DineFlow - Status Badge Directive
 * Reusable directive to render consistent, accessible status badges
 * for both tables and reservations with icons and color tokens.
 *
 * Usage: <status-badge status="res.status"></status-badge>
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .directive('statusBadge', function() {
      return {
        restrict: 'E',
        scope: {
          status: '=',
          size: '@' // 'sm', 'md', 'lg'
        },
        template: 
          '<span class="df-badge df-badge-{{statusLower}} df-badge-{{badgeSize}}" role="status" aria-label="Status: {{status}}">' +
            '<span class="df-badge-dot" aria-hidden="true"></span>' +
            '<i class="fa-solid {{iconClass}}" aria-hidden="true"></i>' +
            '<span class="df-badge-text">{{status || "Unknown"}}</span>' +
          '</span>',
        link: function(scope) {
          scope.badgeSize = scope.size || 'md';

          function updateBadge() {
            var s = (scope.status || '').toLowerCase();
            scope.statusLower = s;

            switch (s) {
              case 'confirmed':
                scope.iconClass = 'fa-circle-check';
                break;
              case 'pending':
                scope.iconClass = 'fa-clock';
                break;
              case 'cancelled':
                scope.iconClass = 'fa-circle-xmark';
                break;
              case 'completed':
                scope.iconClass = 'fa-flag-checkered';
                break;
              case 'available':
                scope.iconClass = 'fa-check';
                break;
              case 'reserved':
                scope.iconClass = 'fa-bookmark';
                break;
              case 'occupied':
                scope.iconClass = 'fa-utensils';
                break;
              case 'cleaning':
                scope.iconClass = 'fa-broom';
                break;
              default:
                scope.iconClass = 'fa-circle-info';
            }
          }

          scope.$watch('status', updateBadge);
        }
      };
    });
})();
