(function() {
  'use strict';

  angular
    .module('angular', ['ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngAria',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'cloudinary',
    'ngFileUpload',
    'ngMaterial',
    'ui.event',
    'ngMap',
    'ngCart',
    'ng-mfb',
    'ngStorage',
    'gavruk.card',
    'angular-md5',
    'textAngular',
    'slick']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme("custom").primaryPalette("teal").accentPalette("deep-orange");
  });;
})();
