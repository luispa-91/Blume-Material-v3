(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Products', Products);
        Products.$inject = ['$http', 'APP_INFO'];
        function Products($http, APP_INFO){

          var all = function () {
              return $http.get("https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestProducts?code=D9wCpljr6pIkVsDqMz7TAM2DHHzXTO3nGW1Hmw4tatapVWQ9jgoqSw==&companyId=" + APP_INFO.ID).then(function (results) {
                  return results.data;
              });
          }

          var allByVariantName = function (variantName) {
              return $http.get("https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestProductsByVariantName?code=maVjSbWTapFjsg3Yhiz9EKoVyNKw8O4QNBb1yNRvdeS0H5ZGFMLt3w==&companyId=" + APP_INFO.ID + "&variantName=" + variantName).then(function (results) {
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
              allByVariantName: allByVariantName,
              featured: featured
            }
        }
})();
