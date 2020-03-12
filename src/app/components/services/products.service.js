(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Products', Products);
        Products.$inject = ['$http'];
        function Products($http){

          var list = function (filterArray) {
              if(filterArray.includes('storeId')){
                return $http.post("https://api2.madebyblume.com/v3/storeFront/productsByStore",filterArray).then(function (results) {
                    return results.data.data;
                });
              } else {
                return $http.post("https://api2.madebyblume.com/v3/storeFront/products",filterArray).then(function (results) {
                    return results.data.data;
                });
              }
          }

          var keds = function () {
            return $http.post("https://api2.madebyblume.com/v3/storeFront/keds").then(function (results) {
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

            var availability = function (externalId) {
                var request = {
                    externalId: externalId
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/products/availability",request).then(function (results) {
                    return results.data.data;
                });
            }

            return {
              list: list,
              keds: keds,
              filterList: filterList,
              expand: expand,
              availability: availability
            }
        }
})();
