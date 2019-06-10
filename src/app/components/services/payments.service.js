(function(){
    'use strict';
      angular
          .module('angular')
          .factory('Payments', Payments);
          Payments.$inject = ['$http', 'md5'];
          function Payments($http, md5){
  
              var availableMethods = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/paymentMethods").then(function (results) {
                      return results.data.data;
                  });
              }

              var bacCreateMd5Hash = function(orderId, amount, timestamp, applicationPassword) {
                var prehash = orderId + "|" + amount + "|" + timestamp + "|" + applicationPassword;
                return md5.createHash(prehash);
              }

              var sendPaymentFttech = function(orderId, currency, amount, card, paymentMethod) {
                //Build request
                var request = {
                    applicationName: paymentMethod.applicationName,
                    applicationPassword: paymentMethod.applicationPassword,
                    chargeDescription: orderId,
                    transactionCurrency: currency,
                    transactionAmount: amount,
                    primaryAccountNumber: card.number,
                    expirationMonth: card.expMonth,
                    expirationYear: card.expYear,
                    verificationValue: card.cvc
                };
                
                // return $http.post(paymentMethod.gatewayUrl, request).then(function (results) {
                //       return results.data;
                //   });
              }
              
              return {
                availableMethods: availableMethods,
                bacCreateMd5Hash: bacCreateMd5Hash,
                sendPaymentFttech: sendPaymentFttech
              }
          }
  })();
  