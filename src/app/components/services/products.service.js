(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Products', Products);
        Products.$inject = ['$http'];
        function Products($http){

          var list = function (filterArray) {
              return $http.post("https://api2.madebyblume.com/v3/storeFront/products",filterArray).then(function (results) {
                  return results.data.data;
              });
          }

          var filterList = function (filterArray) {
              return $http.post("https://api2.madebyblume.com/v3/storeFront/products/filters",filterArray).then(function (results) {
                  return results.data.data;
              });
          }

          var expand = function (referenceCode,colorCode) {
              var request = {
                  referenceCode: referenceCode,
                  colorCode: colorCode
              }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/products/expand",request).then(function (results) {
                    return results.data.data;
                });
            }

            return {
              list: list,
              filterList: filterList,
              expand: expand
            }
        }
})();
