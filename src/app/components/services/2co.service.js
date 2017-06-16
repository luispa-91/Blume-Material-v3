(function() {
    'use strict';

    angular
        .module('angular')
        .service('TwoCheckoutService', TwoCheckoutService);

    TwoCheckoutService.$inject = ['$http','APP_INFO'];
    function TwoCheckoutService($http,APP_INFO) {

        var serviceBase = 'https://central-api.madebyblume.com/';
        var TwoCheckoutService = {};



        var _getToken = function(){
          return $http({
                    method: "GET",
                    url: "https://central-api.madebyblume.com/v1/payments/2co/key",
                    params: { company_id: APP_INFO.ID },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
        }

        var _createPayment = function (token, billingInfo) {
          return $http.post('https://central-api.madebyblume.com/v1/payments/2co/invoice?token=' + token, billingInfo).then(function (results) {
              return results;
          });
        };

        TwoCheckoutService.getToken = _getToken;
        TwoCheckoutService.createPayment = _createPayment;

        return TwoCheckoutService;

    }

})();
