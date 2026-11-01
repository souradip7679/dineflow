/**
 * DineFlow - Stat Card Directive
 * Reusable directive for management dashboard metric cards with
 * animated counters, icon badges, and contextual trends.
 *
 * Usage: <stat-card title="Today's Reservations" value="dash.todayTotal" icon="fa-calendar-day" theme="terracotta" subtitle="Expected guests: 17"></stat-card>
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .directive('statCard', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@',
          theme: '@', // 'forest', 'terracotta', 'emerald', 'amber', 'purple', 'charcoal'
          subtitle: '@',
          trend: '@'
        },
        template:
          '<div class="df-stat-card df-stat-card--{{cardTheme}}">' +
          '  <div class="df-stat-card__top">' +
          '    <div class="df-stat-card__icon-wrap">' +
          '      <i class="fa-solid {{icon}}" aria-hidden="true"></i>' +
          '    </div>' +
          '    <span class="df-stat-card__trend" ng-if="trend">{{trend}}</span>' +
          '  </div>' +
          '  <div class="df-stat-card__body">' +
          '    <div class="df-stat-card__value">{{value !== undefined && value !== null ? value : 0}}</div>' +
          '    <div class="df-stat-card__title">{{title}}</div>' +
          '  </div>' +
          '  <div class="df-stat-card__footer" ng-if="subtitle">' +
          '    <span>{{subtitle}}</span>' +
          '  </div>' +
          '</div>',
        link: function(scope) {
          scope.cardTheme = scope.theme || 'forest';
        }
      };
    });
})();
