/**
 * DineFlow - AngularJS Application Routing Configuration
 * Uses ngRoute to map client-side paths to HTML views and controllers.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/views/home.html',
          controller: 'HomeController',
          controllerAs: 'vm',
          title: 'Home — DineFlow'
        })
        .when('/book', {
          templateUrl: 'app/views/book.html',
          controller: 'BookingController',
          controllerAs: 'vm',
          title: 'Reserve a Table — DineFlow'
        })
        .when('/reservations', {
          templateUrl: 'app/views/reservations.html',
          controller: 'ReservationsController',
          controllerAs: 'vm',
          title: 'Reservation Management — DineFlow'
        })
        .when('/tables', {
          templateUrl: 'app/views/tables.html',
          controller: 'TablesController',
          controllerAs: 'vm',
          title: 'Interactive Table Layout — DineFlow'
        })
        .when('/dashboard', {
          templateUrl: 'app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          title: 'Management Dashboard — DineFlow'
        })
        .when('/404', {
          templateUrl: 'app/views/404.html',
          title: 'Page Not Found — DineFlow'
        })
        .otherwise({
          redirectTo: '/404'
        });
    }])
    .run(['$rootScope', function($rootScope) {
      // Update document title on route change
      $rootScope.$on('$routeChangeSuccess', function(event, current) {
        if (current && current.$$route && current.$$route.title) {
          document.title = current.$$route.title;
        } else {
          document.title = 'DineFlow — Restaurant Reservation & Table Management';
        }
        // Scroll to top on route change
        window.scrollTo(0, 0);
      });
    }]);
})();
