(function(){
'use strict';
    angular
        .module('angular')
        .factory('DataCollection', DataCollection);
        DataCollection.$inject = ['$http'];
        function DataCollection($http){

            var paymentLog = {
                paymentMethod: '',
                orderId: 0,
                lastFourDigits: '',
                clientIp:'',
                clientDevice:'',
                clientLocation:''
            };

            var logPayment = function (orderId,paymentMethod,cardNumber){
                var lastFourDigits = cardNumber.substr(cardNumber.length - 4);
                paymentLog.paymentMethod = paymentMethod;
                paymentLog.orderId = orderId;
                paymentLog.lastFourDigits = lastFourDigits;
                //Hacer esto dentro del mismo call del log
                return $http.get('https://api.ipstack.com/check?access_key=16c6f4370e3ec63ddcfaba935c844c99').then(function (results) {
                    paymentLog.clientIp = results.data.ip;
                    paymentLog.clientDevice = results.data.type;
                    paymentLog.clientLocation = results.data.city + ", " + results.data.country_name;
                    return $http.post("https://api2.madebyblume.com/v3/storeFront/payment/log",paymentLog).then(function (results) {
                        return results.data.data;
                    });
                });
            }

            var getClientInfo = function(){
                return $http.get('https://api.ipstack.com/check?access_key=16c6f4370e3ec63ddcfaba935c844c99').then(function (results) {
                    paymentLog.clientIp = results.data.ip;
                    paymentLog.clientDevice = results.data.type;
                    paymentLog.clientLocation = results.data.city + ", " + results.data.country_name;
                    return paymentLog;
                });
            }

            return {
                logPayment:logPayment,
                getClientInfo: getClientInfo
            }
        }
})();
  