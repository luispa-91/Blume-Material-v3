(function(){
    'use strict';
      angular
          .module('angular')
          .factory('Payments', Payments);
          Payments.$inject = ['$http', 'md5', '$window','$location','$state', 'ngCart'];
          function Payments($http, md5, $window,$location,$state, ngCart){
  
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
                    var temp = "";
                     if(results.data.apiStatus.toLowerCase()=="successful"){ temp = "approved"; } else { temp = "declined"; }
                    $state.go("paymentNotificationFttech", {
                        paymentStatus: temp,
                        orderId: request.chargeDescription
                    })
                  });
              }

              var sendPaymentGreenPay = function(orderId, card, sessionId) {
                //Build request
                var request = {
                    orderId: orderId,
                    number: card.number,
                    expMonth: card.expMonth,
                    expYear: card.expYear,
                    cvc: card.cvc,
                    sessionId: sessionId
                };
                return $http.post("https://api2.madebyblume.com/v3/payments/greenPay/submit", request).then(function (results) {
                    var temp = "";
                     if(results.data.isApproved){ temp = "approved"; } else { temp = "declined"; }
                    $state.go("paymentNotificationGreenPay", {
                        paymentStatus: temp,
                        orderId: request.orderId,
                        responseText: results.data.apiStatus
                    })
                  });
              }

              var sendPaymentCredix = function(submitUrl){
                var websiteUrl = $location.protocol() + "://" + $location.host() + "/payment/credix/";
                submitUrl += "&urlAprobado=" + websiteUrl + "approved&urlError=" + websiteUrl + "declined";
                $window.location.href = submitUrl;
              }

              var sendPaymentCybersource = function(orderId, clientInfo, deviceFingerprintId, card){
                //Build request
                var request = {
                  orderId: orderId,
                  number: card.number,
                  expMonth: card.expMonth,
                  expYear: card.expYear,
                  cvc: card.cvc,
                  ipAddress: clientInfo.clientIp,
                  deviceFingerprintId: deviceFingerprintId,
                  geoLocation: clientInfo.clientLocation
              };
                return $http.post("https://api2.madebyblume.com/v3/payments/cyberSource/submit", request).then(function (results) {
                  var temp = {
                    paymentStatus: "",
                    responseText: ""
                  }
                  if(results.data.isApproved==true){ temp.paymentStatus = "approved"; }
                  else { temp.paymentStatus = "declined"; }
                  $state.go("paymentNotificationCybersource", {
                    paymentStatus: temp.paymentStatus,
                    responseText: temp.responseText
                  })
                });
              }

              var sendPaymentFAC = function(orderId, card){
                //Build request
                var request = {
                  orderId: orderId,
                  number: card.number,
                  expMonth: card.expMonth,
                  expYear: card.expYear,
                  cvc: card.cvc
              };
                return $http.post("https://api2.madebyblume.com/v3/payments/fac/submit", request).then(function (results) {
                  var temp = {
                    paymentStatus: "",
                    responseText: ""
                  }
                  if(results.data.isApproved==true){ temp.paymentStatus = "approved"; temp.responseText = "Tu transacción ha sido aprobada"; }
                  else { temp.paymentStatus = "declined"; temp.responseText = "Tu transacción ha sido denegada"; }
                  $state.go("paymentNotification", {
                    paymentMethod: temp.paymentStatus,
                    responsetext: temp.responseText
                  })
                });
              }

              var receivePaymentNotificationCredix = function(){
                if($state.$current.name=='paymentNotificationCredix'){
                  //Disect location
                  var n = $location.path().lastIndexOf('/');
                  var result = $location.path().substring(n + 1);
                  var paymentStatus = "";
                  var orderId = 0;
                  //Get payment status
                  if(result=="approved"){
                    paymentStatus="approved";
                    orderId=$location.search().referencia;
                  } else {
                    paymentStatus = "declined";
                    orderId=$location.search().referencia;
                  }
                  var responseText = "";
                  var temp = {
                      paymentStatus: paymentStatus,
                      responseText: responseText
                  };
                  if(paymentStatus.toLowerCase()=="approved"){ temp.responseText = "Tu compra fue aprobada."; ngCart.init(); } else { temp.responseText = "Tu compra fue denegada." }
                  return $http.get("https://api2.madebyblume.com/v3/payments/ipn/credix?paymentStatus=" + paymentStatus + "&orderId=" + orderId).then(function (results) {
                    return temp;
                  });
                }
              }

              var receivePaymentNotificationFttech = function(){
                //Disect location
                var n = $location.path().lastIndexOf('/');
                var result = $location.path().substring(n + 1);
                //Get payment status
                var array = result.split('&');
                var paymentStatus = array[0].toLowerCase();
                var orderId = array[1].split('=')[1];
                var responseText = "";
                var temp = {
                    paymentStatus: paymentStatus,
                    responseText: responseText
                };
                if(paymentStatus=="approved"){ temp.responseText = "Tu compra fue aprobada."; ngCart.init(); } else { temp.responseText = "Tu compra fue denegada." }
                return $http.get("https://api2.madebyblume.com/v3/payments/ipn/fttech?paymentStatus=" + paymentStatus + "&orderId=" + orderId).then(function (results) {
                  return temp;
                });
              }

              var receivePaymentNotificationGreenPay = function(){
                //Disect location
                var n = $location.path().lastIndexOf('/');
                var result = $location.path().substring(n + 1);
                //Get payment status
                var array = result.split('&');
                var paymentStatus = array[0].toLowerCase();
                var orderId = array[1].split('=')[1];
                var responseText = array[2].split('=')[1];;
                var temp = {
                    paymentStatus: paymentStatus,
                    responseText: responseText
                };
                return $http.get("https://api2.madebyblume.com/v3/payments/ipn/greenPay?paymentStatus=" + paymentStatus + "&orderId=" + orderId + "&responseText=" + responseText).then(function (results) {
                  return temp;
                });
              }

              var receivePaymentNotificationCybersource = function(){
                //Disect location
                var n = $location.path().lastIndexOf('/');
                var result = $location.path().substring(n + 1);
                //Get payment status
                var array = result.split('&');
                var paymentStatus = array[0].toLowerCase();
                var responseText = "";
                var temp = {
                    paymentStatus: paymentStatus,
                    responseText: responseText
                };
                if(paymentStatus=="approved"){ temp.responseText = "Tu compra fue aprobada."; ngCart.init(); } else { temp.responseText = "Tu compra fue denegada." }
                return temp;
              }

              var receivePaymentNotification = function(){
                var temp = {
                    paymentStatus: $state.params.paymentMethod,
                    responseText: $state.params.responsetext
                };
                return temp;
              }
              
              return {
                availableMethods: availableMethods,
                bacCreateMd5Hash: bacCreateMd5Hash,
                sendPaymentFttech: sendPaymentFttech,
                sendPaymentGreenPay: sendPaymentGreenPay,
                sendPaymentCredix: sendPaymentCredix,
                sendPaymentCybersource: sendPaymentCybersource,
                sendPaymentFAC: sendPaymentFAC,
                receivePaymentNotificationCredix: receivePaymentNotificationCredix,
                receivePaymentNotificationFttech: receivePaymentNotificationFttech,
                receivePaymentNotificationGreenPay: receivePaymentNotificationGreenPay,
                receivePaymentNotificationCybersource: receivePaymentNotificationCybersource,
                receivePaymentNotification: receivePaymentNotification
              }
          }
  })();
  