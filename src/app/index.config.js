(function() {
  'use strict';

  angular
    .module('angular')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $qProvider, AnalyticsProvider) {
    
    AnalyticsProvider.setAccount('UA-62919114-3');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.trackUrlParams(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    $qProvider.errorOnUnhandledRejections(false);
  }

})();
