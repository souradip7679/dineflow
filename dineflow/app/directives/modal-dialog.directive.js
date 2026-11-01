/**
 * DineFlow - Modal Dialog Directive
 * Reusable modal window directive with transclusion, backdrop clicking,
 * keyboard accessibility (Esc key), and smooth open/close animations.
 *
 * Usage:
 * <modal-dialog is-open="vm.showModal" title="Manage Table T-03" on-close="vm.closeModal()">
 *   <div class="modal-content-here">...</div>
 * </modal-dialog>
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .directive('modalDialog', ['$document', function($document) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          isOpen: '=',
          title: '@',
          size: '@', // 'sm', 'md', 'lg'
          onClose: '&'
        },
        template:
          '<div class="df-modal-backdrop" ng-if="isOpen" ng-click="handleBackdropClick($event)" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '  <div class="df-modal-container df-modal--{{size || \'md\'}}" ng-click="$event.stopPropagation()">' +
          '    <div class="df-modal-header">' +
          '      <h3 id="modal-title" class="df-modal-title">{{title}}</h3>' +
          '      <button type="button" class="df-modal-close-btn" ng-click="close()" aria-label="Close dialog">' +
          '        <i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
          '      </button>' +
          '    </div>' +
          '    <div class="df-modal-body" ng-transclude>' +
          '    </div>' +
          '  </div>' +
          '</div>',
        link: function(scope) {
          scope.close = function() {
            scope.isOpen = false;
            if (scope.onClose) {
              scope.onClose();
            }
          };

          scope.handleBackdropClick = function(event) {
            if (event.target === event.currentTarget) {
              scope.close();
            }
          };

          function onKeyDown(e) {
            if (e.keyCode === 27 && scope.isOpen) { // ESC key
              scope.$apply(function() {
                scope.close();
              });
            }
          }

          $document.on('keydown', onKeyDown);

          scope.$on('$destroy', function() {
            $document.off('keydown', onKeyDown);
          });
        }
      };
    }]);
})();
