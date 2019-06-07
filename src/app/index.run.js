(function() {
  'use strict';

  angular
    .module('angular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, ngCart) {
    $rootScope.cart = ngCart;

    $rootScope.$on('$locationChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    $rootScope.$on(
        '$stateChangeStart',
        function(event, toState) {
            if (toState.externalUrl) {
                event.preventDefault();
                $window.open(toState.externalUrl, '_self');
            }
            // Google Analytics during state change
            // console.log(toState.url);
            // ga('set', 'page', toState.url);
            // ga('set', 'title', toState.url);
            // ga('send', 'pageview');
        }
    );
  }
})();