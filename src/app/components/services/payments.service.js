(function(){
    'use strict';
      angular
          .module('angular')
          .factory('Payments', Payments);
          Payments.$inject = ['$http', 'md5', '$window','$location','$state','DataCollection'];
          function Payments($http, md5, $window,$location,$state,DataCollection){
  
              var availableMethods = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/payment/methods").then(function (results) {
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
                
                return $http.post(paymentMethod.gatewayUrl, request).then(function (results) {
                      return results.data;
                  });
              }

              var sendPaymentCredix = function(submitUrl){
                var websiteUrl = $location.protocol() + "://" + $location.host() + "/payment/credix/";
                submitUrl += "&urlAprobado=" + websiteUrl + "approved&urlError=" + websiteUrl + "declined";
                $window.location.href = submitUrl;
              }

              var receivePaymentNotificationCredix = function(){
                if($state.$current.name=='paymentNotificationCredix'){
                  //Disect location
                  var n = $location.path().lastIndexOf('/');
                  var result = $location.path().substring(n + 1);
                  //Get payment status
                  var array = result.split('&');
                  var paymentStatus = array[0];
                  var orderId = array[1].split('=')[1];
                  return $http.get("https://api2.madebyblume.com/v3/payments/ipn/credix?paymentStatus=" + paymentStatus + "&orderId=" + orderId).then(function (results) {
                    console.log(results);  
                    return results;
                  });
                }
              }
              
              return {
                availableMethods: availableMethods,
                bacCreateMd5Hash: bacCreateMd5Hash,
                sendPaymentFttech: sendPaymentFttech,
                sendPaymentCredix: sendPaymentCredix,
                receivePaymentNotificationCredix: receivePaymentNotificationCredix
              }
          }
  })();
  