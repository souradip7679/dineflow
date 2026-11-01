/**
 * DineFlow - Home Controller
 * Manages landing page features, hero section, culinary highlights,
 * testimonials, and quick jump reservation widget.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .controller('HomeController', [
      'StorageService',
      'TableService',
      '$location',
      function(StorageService, TableService, $location) {
        var vm = this;

        // Hero headline and subtext
        vm.headline = 'Your Table, Your Moment.';
        vm.tagline = 'Immerse yourself in artisanal cuisine, handcrafted cocktails, and unforgettable atmospheres.';

        // Key stats for hero social proof
        vm.highlights = [
          { number: '12', label: 'Bespoke Tables', icon: 'fa-table-cells' },
          { number: '4', label: 'Unique Ambiances', icon: 'fa-compass' },
          { number: '4.9', label: 'Guest Rating', icon: 'fa-star' },
          { number: '100%', label: 'Guaranteed Booking', icon: 'fa-shield-halved' }
        ];

        // Featured culinary dishes
        var storedDishes = StorageService.get('dishes');
        if (storedDishes && storedDishes.length) {
          vm.dishes = storedDishes;
        } else if (window.DineFlowInitialData && window.DineFlowInitialData.dishes) {
          vm.dishes = window.DineFlowInitialData.dishes;
        } else {
          vm.dishes = [];
        }

        // Zones / Dining Environments
        vm.zones = [
          {
            name: 'Main Dining Room',
            description: 'Warm acoustics, open exhibition kitchen, and plush banquette seating.',
            tables: 'Tables 1–4',
            ambiance: 'Vibrant & Sophisticated',
            icon: 'fa-champagne-glasses'
          },
          {
            name: 'Garden Terrace',
            description: 'Al fresco dining beneath heated pergolas surrounded by lush botanicals.',
            tables: 'Tables 5–7',
            ambiance: 'Romantic & Open Air',
            icon: 'fa-leaf'
          },
          {
            name: 'Executive VIP Lounge',
            description: 'Secluded salon with personal sommelier and dedicated tasting counter.',
            tables: 'Tables 8–9',
            ambiance: 'Exclusive & Intimate',
            icon: 'fa-crown'
          },
          {
            name: 'Artisan Bar & Lounge',
            description: 'Craft mixology, high-top marble tables, and curated small bites.',
            tables: 'Tables 10–12',
            ambiance: 'Relaxed & Social',
            icon: 'fa-martini-glass-citron'
          }
        ];

        // Guest Testimonials
        vm.testimonials = [
          {
            quote: 'DineFlow made our anniversary dinner absolutely flawless. The terrace table was breathtaking!',
            author: 'Victoria & James',
            role: 'Verified Diners',
            rating: 5
          },
          {
            quote: 'The VIP room experience and wine pairings were world-class. Reservation process was smooth and instant.',
            author: 'Marcus Sterling',
            role: 'Private Dining Guest',
            rating: 5
          },
          {
            quote: 'Best dining experience in the city. Real-time table selection gave us exactly the seating view we wanted.',
            author: 'Eleanor Vance',
            role: 'Culinary Enthusiast',
            rating: 5
          }
        ];

        // Quick reservation jump
        var today = new Date();
        vm.quickDate = today.toISOString().split('T')[0];
        vm.quickGuests = 2;
        vm.quickTime = '19:30';

        vm.jumpToBooking = function() {
          $location.path('/book').search({
            date: vm.quickDate,
            time: vm.quickTime,
            guests: vm.quickGuests
          });
        };
      }
    ]);
})();
