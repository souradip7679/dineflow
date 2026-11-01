/**
 * DineFlow - Theme Service
 * Manages light / dark theme switching, LocalStorage persistence,
 * and system preference detection.
 */
(function() {
  'use strict';

  angular.module('dineflowApp')
    .factory('ThemeService', ['StorageService', '$rootScope', function(StorageService, $rootScope) {
      var THEME_KEY = 'theme_preference';
      
      // Determine initial theme: stored preference -> system dark mode -> default light
      var savedTheme = StorageService.get(THEME_KEY);
      var currentTheme = savedTheme;

      if (!currentTheme) {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
      }

      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        $rootScope.currentTheme = theme;
        $rootScope.isDarkTheme = (theme === 'dark');
      }

      // Initialize on load
      applyTheme(currentTheme);

      return {
        getTheme: function() {
          return currentTheme;
        },
        isDark: function() {
          return currentTheme === 'dark';
        },
        setTheme: function(theme) {
          if (theme !== 'light' && theme !== 'dark') return;
          currentTheme = theme;
          StorageService.set(THEME_KEY, theme);
          applyTheme(theme);
          $rootScope.$broadcast('dineflow:theme-changed', theme);
        },
        toggleTheme: function() {
          var nextTheme = (currentTheme === 'dark') ? 'light' : 'dark';
          this.setTheme(nextTheme);
          return nextTheme;
        }
      };
    }]);
})();
