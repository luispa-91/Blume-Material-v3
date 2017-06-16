(function() {
  'use strict';

  angular
    .module('angular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, APP_INFO, ngCart, $window) {
    $rootScope.app = APP_INFO;
    $rootScope.cart = ngCart;

    $rootScope.$on(
        '$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState.externalUrl) {
                event.preventDefault();
                $window.open(toState.externalUrl, '_self');
            }
        }
    );
  }
})();