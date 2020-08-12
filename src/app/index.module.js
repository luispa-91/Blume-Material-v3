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
    'toaster',
    'ngMaterial',
    'ui.event',
    'ngCart',
    'ngStorage',
    'angular-md5',
    'textAngular',
    'slick',
    'infinite-scroll',
    'angulartics',
    'ui.scrollpoint',
    'angular-google-analytics',
    'angular.filter',
    'mdRangeSlider',
    'angularFileUpload',
    'timer']).config(function($mdThemingProvider) {
      $mdThemingProvider.disableTheming();
    });
})();
