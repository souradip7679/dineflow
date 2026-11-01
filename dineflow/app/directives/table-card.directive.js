/**
 * DineFlow - Table Card Directive
 * Renders an interactive floor plan table card with visual shape cues,
 * capacity badges, dynamic status classes via ng-class, and click handlers.
 *
 * Usage: <table-card table="tbl" on-select="vm.openTableModal(tbl)"></table-card>
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .directive('tableCard', function() {
      return {
        restrict: 'E',
        scope: {
          table: '=',
          onSelect: '&'
        },
        template:
          '<div class="df-table-card df-table-card--{{table.status | lowercase}} df-shape-{{table.shape}}"' +
          '     ng-click="handleClick()"' +
          '     role="button"' +
          '     tabindex="0"' +
          '     aria-label="Table {{table.number}}, Capacity {{table.capacity}}, Status {{table.status}}">' +
          '  <div class="df-table-card__header">' +
          '    <div class="df-table-card__number-wrap">' +
          '      <span class="df-table-card__number">{{table.number}}</span>' +
          '      <span class="df-table-card__zone">{{table.zone}}</span>' +
          '    </div>' +
          '    <status-badge status="table.status" size="sm"></status-badge>' +
          '  </div>' +
          '  <div class="df-table-card__visual" aria-hidden="true">' +
          '    <div class="df-visual-table df-visual-{{table.shape}}">' +
          '      <span class="df-visual-cap">{{table.capacity}}p</span>' +
          '    </div>' +
          '    <div class="df-visual-chairs df-visual-chairs--{{table.capacity}}">' +
          '      <span class="df-chair" ng-repeat="chair in chairArray track by $index"></span>' +
          '    </div>' +
          '  </div>' +
          '  <div class="df-table-card__footer">' +
          '    <div class="df-table-card__capacity">' +
          '      <i class="fa-solid fa-users" aria-hidden="true"></i>' +
          '      <span>{{table.capacity}} Seats</span>' +
          '    </div>' +
          '    <span class="df-table-card__action-hint">' +
          '      <span>Manage</span>' +
          '      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>' +
          '    </span>' +
          '  </div>' +
          '</div>',
        link: function(scope) {
          scope.chairArray = [];

          scope.$watch('table.capacity', function(cap) {
            var count = parseInt(cap, 10) || 2;
            scope.chairArray = new Array(count);
          });

          scope.handleClick = function() {
            if (scope.onSelect) {
              scope.onSelect({ table: scope.table });
            }
          };
        }
      };
    });
})();
