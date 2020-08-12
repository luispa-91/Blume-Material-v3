(function() {
  'use strict';

  angular
    .module('angular')
    .config(config);

  /** @ngInject */
  function config($logProvider, $qProvider, AnalyticsProvider) {

    AnalyticsProvider.setAccount('UA-62919114-3');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.trackUrlParams(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    // Enable log
    $logProvider.debugEnabled(true);
    $qProvider.errorOnUnhandledRejections(false);
  }

})();
