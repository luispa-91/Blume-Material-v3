(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Products', Products);
        Products.$inject = ['$http', 'APP_INFO'];
        function Products($http, APP_INFO){

          var all = function () {
              return $http.get("https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestFeaturedProducts?code=JfwyH9oLdKg14Ss7CiH6tDaa5X0MNl0CQxSYNcDw2zch3KFRDHZW8g==&companyId=" + APP_INFO.ID).then(function (results) {
                  return results.data;
              });
          }

          var featured = function () {
              return $http.get("https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestFeaturedProducts?code=JfwyH9oLdKg14Ss7CiH6tDaa5X0MNl0CQxSYNcDw2zch3KFRDHZW8g==&companyId=" + APP_INFO.ID).then(function (results) {
                  return results.data;
              });
          }

            return {
              all: all,
              featured: featured
            }
        }
})();
