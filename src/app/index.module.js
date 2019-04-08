(function() {
  'use strict';
  angular
    .module('angular', ['ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngAria',
    'ui.router',
    'ui.bootstrap',
    'ui.select', 
    'ngSanitize',
    'toastr',
    'ngMaterial',
    'ui.event',
    'ngMap',
    'ngCart',
    'ng-mfb',
    'ngStorage',
    'angular-md5',
    'textAngular',
    'slick',
    'infinite-scroll',
    'angulartics', 
    'angulartics.facebook.pixel',
    'ui.scrollpoint',
    'angular-google-analytics',
    'angular.filter']).config(function($mdThemingProvider) {
      $mdThemingProvider.theme("custom").primaryPalette("teal").accentPalette("deep-orange");
    });
})();
