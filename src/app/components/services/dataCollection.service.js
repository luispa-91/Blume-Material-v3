(function(){
'use strict';
    angular
        .module('angular')
        .factory('DataCollection', DataCollection);
        DataCollection.$inject = ['$stateParams','$http'];
        function DataCollection($stateParams,$http){

            var paymentLog = {
                paymentMethod: '',
                paymentStatus: '',
                responseCode: '',
                orderId: 0,
                responseText: '',
                authCode: '',
                transactionId: '',
                lastFourDigits: '',
                clientIp:'',
                clientDevice:'',
                clientLocation:'',
                hash:''
            };

            var logPayment = function (){
                paymentLog.paymentMethod = $stateParams.paymentMethod;
                paymentLog.responseCode = $stateParams.response_code;
                paymentLog.orderId = $stateParams.orderid;
                paymentLog.responseText = $stateParams.responsetext;
                paymentLog.lastFourDigits = $stateParams.lastFour;
                paymentLog.hash = $stateParams.hash;
                if(paymentLog.responseCode=='100'){
                    paymentLog.transactionId = $stateParams.transactionid;
                    paymentLog.authCode = $stateParams.authcode;
                    paymentLog.paymentStatus = "approved";
                } else {
                    paymentLog.paymentStatus = "declined";
                }
                //Hacer esto dentro del mismo call del log
                getClientInfo();

                return paymentLog;
            }

            var getClientInfo = function (){
                return $http.get('http://api.ipstack.com/check?access_key=16c6f4370e3ec63ddcfaba935c844c99').then(function (results) {
                    return results;
                });
            }

            return {
                logPayment:logPayment
            }
        }
})();
  