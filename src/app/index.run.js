(function() {
  'use strict';

  angular
    .module('angular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, APP_INFO, ngCart, $window) {
    $rootScope.app = APP_INFO;
    $rootScope.cart = ngCart;

    $rootScope.$on(
        '$stateChangeStart',
        function(event, toState) {
            if (toState.externalUrl) {
                event.preventDefault();
                $window.open(toState.externalUrl, '_self');
            }
        }
    );
  }
})();