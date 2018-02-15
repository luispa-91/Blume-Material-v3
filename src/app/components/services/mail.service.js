(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Mail', Mail);
        Mail.$inject = ['$http', 'APP_INFO', '$location'];
        function Mail($http, APP_INFO, $location){

            var errorLog = function (err) {

                var url = $location.absUrl().split('?')[0];

                var customError = {
                    status: err.status,
                    text: err.data.message,
                    url: err.config.url,
                    company: APP_INFO.name,
                    source: url
                }

                return $http.post('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteSendErrorLog?code=H5jgabzIcbW3qxxcwjxa1AVjyq6qhtHukwv3apyxCaYPiQWzzGsqkQ==', customError).then(function (results) {
                    return results.data;
                });
            };

            var ftPurchaseParameterLog = function (params) {

                var url = $location.absUrl().split('?')[0];

                var text = "";
                text += "Application name: " + params.applicationName + "<br />";
                text += "Application password: " + params.applicationPassword + "<br />";
                text += "Charge description: " + params.chargeDescription + "<br />";
                text += "Transaction currency: " + params.transactionCurrency + "<br />";
                text += "Transaction amount: " + params.transactionAmount + "<br />";

                var customError = {
                    status: 0,
                    text: text,
                    url: "Parameters sent",
                    company: APP_INFO.name,
                    source: url
                }

                return $http.post('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteSendParameterLog?code=wJVSJ0pdFGF1iudOXDTdiUdPvpwbIOc1JKK7wvMRt07vXVfaUt7Z3A==', customError).then(function (results) {
                    return results.data;
                });
            };

            var bacPurchaseParameterLog = function (params) {

                var url = $location.absUrl().split('?')[0];

                var text = "";
                text += "Application name: " + params.applicationName + "<br />";
                text += "Application password: " + params.applicationPassword + "<br />";
                text += "Charge description: " + params.chargeDescription + "<br />";
                text += "Transaction currency: " + params.transactionCurrency + "<br />";
                text += "Transaction amount: " + params.transactionAmount + "<br />";

                var customError = {
                    status: 0,
                    text: text,
                    url: "Parameters sent",
                    company: APP_INFO.name,
                    source: url
                }

                return $http.post('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteSendParameterLog?code=wJVSJ0pdFGF1iudOXDTdiUdPvpwbIOc1JKK7wvMRt07vXVfaUt7Z3A==', customError).then(function (results) {
                    return results.data;
                });
            };

            return {
              errorLog: errorLog,
              ftPurchaseParameterLog: ftPurchaseParameterLog,
              bacPurchaseParameterLog: bacPurchaseParameterLog
            }
        }
})();
