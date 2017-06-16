(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Website', Website);
        Website.$inject = ['$http', 'APP_INFO'];
        function Website($http, APP_INFO){

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

            var getWebsiteSettings = function () {
                return $http.get('https://central-api.madebyblume.com/v1/website/settings?company_id=' + APP_INFO.ID).then(function (results) {
                    return results.data;
                });
            };

            return {
              getAbout: getAbout,
              getStoreSettings: getStoreSettings,
              getWebsiteSettings: getWebsiteSettings
            }
        }
})();
