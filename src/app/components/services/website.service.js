(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Website', Website);
        Website.$inject = ['$http', 'APP_INFO', '$localStorage'];
        function Website($http, APP_INFO, $localStorage){

            var getAbout = function () {
                return $http.get('https://central-api.madebyblume.com/v1/website/about?company_id=' + APP_INFO.ID).then(function (results) {
                    return results.data;
                });
            };

            var getStoreSettings = function () {
                return $http.get('https://central-api.madebyblume.com/v1/website/store?company_id=' + APP_INFO.ID).then(function (results) {
                    return results.data;
                });
            };

            var navbar = function(){
                return $http.get('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestNavbar?code=a0J2AWiAMgVCbjRX3EYuEnuMXnRFWFVNFKjhwo0t4UfU4xWfeuSkBA==&companyId=' + APP_INFO.ID).then(function (results) {
                    return results.data;
                });
            }

            var footer = function(){
                return $http.get('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestFooter?code=9cRQwO3XSPsKxjor8SrV0YBF9Fwja2tfCWi23WdqR/yapQtUlJPnVQ==&companyId=' + APP_INFO.ID).then(function (results) {
                    return results.data;
                });
            }

            var home = function(){
                return $http.get('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestHome?code=rbR5Dc4ySxhh58I2QVQO3zkEjQpdaNfEBmtc6slMjmC4FX5jR0pDyQ==&companyId=' + APP_INFO.ID + '&companyName=' + APP_INFO.directory).then(function (results) {
                    return results.data;
                });
            }

            var settings = function () {
                return $http.get("https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestSettings?code=iGVGGgmLBYtRcMnQM1u/HBaQSmcav1gHpaffmSuRJKkNrWuTEMICnw==&companyId=" + APP_INFO.ID).then(function (results) {
                  $localStorage.storeData = results.data;
                  return results.data;
                });
            }

            var createCustomerSimple = function (customer) {
                return $http.post('https://central-api.madebyblume.com/v1/company/customers/submit', customer).then(function (results) {
                    return results;
                });
            };

            return {
              getAbout: getAbout,
              getStoreSettings: getStoreSettings,
              navbar: navbar,
              footer: footer,
              home: home,
              settings: settings,
              createCustomerSimple: createCustomerSimple
            }
        }
})();
