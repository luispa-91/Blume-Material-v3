(function() {
  'use strict';

  angular
    .module('angular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, ngCart,$transitions, Helper, $mdMenu, $mdSidenav,$timeout) {
    $rootScope.cart = ngCart;

    $rootScope.$on('$locationChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    $rootScope.$on('$locationChangeStart', function() {
      $timeout(function(){
        $mdMenu.hide();
        $mdSidenav('left').close()
                    .then(function () {
                    });
        $rootScope.$emit('urlChanged');
      },200)
  });

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    Helper.googleAnalyticsId().then(function(response){ gtag('config', response.id); });

    $transitions.onStart( {}, function (trans) {
      var isGrupoCachos = Helper.isGrupoCachos();
      var to = trans.to().name;
      // Google Analytics during state change
      gtag('set', 'page', to);
      gtag('set', 'title', to);
      gtag('send', 'pageview');
      if(trans.to().controller == "PaymentNotificationController" && isGrupoCachos){
        gtag('event', 'conversion', {'send_to': 'AW-617710477/r2HMCN2ortYBEI2HxqYC'});
      }
    });
  }
})();