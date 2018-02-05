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
    'gavruk.card',
    'angular-md5',
    'textAngular',
    'slick',
    'infinite-scroll',
    'angulartics', 
    'angulartics.facebook.pixel']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme("custom").primaryPalette("teal").accentPalette("deep-orange");
  });
})();
