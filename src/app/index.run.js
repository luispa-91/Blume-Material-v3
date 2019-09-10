(function() {
  'use strict';

  angular
    .module('angular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, ngCart,$transitions, Helper) {
    $rootScope.cart = ngCart;

    $rootScope.$on('$locationChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    Helper.googleAnalyticsId().then(function(response){ gtag('config', response.id); });

    $transitions.onStart( {}, function (trans) {
      var to = trans.to().name;
      // Google Analytics during state change
      gtag('set', 'page', to);
      gtag('set', 'title', to);
      gtag('send', 'pageview');
    });
  }
})();