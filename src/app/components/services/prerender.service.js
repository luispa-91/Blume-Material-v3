(function(){
    'use strict';
      angular
          .module('angular')
          .factory('Prerender', Prerender);
          Prerender.$inject = ['$http','$stateParams'];
          function Prerender($http,$stateParams){
  
              var mainPage = function () {
                  return $http.get("https://api2.madebyblume.com/v3/prerender/main").then(function (results) {
                      return results.data;
                  }, function(err){ });
              }

              var products = function () {
                return $http.get("https://api2.madebyblume.com/v3/prerender/products").then(function (results) {
                    return results.data;
                }, function(err){ });
            }

            var product = function () {
                var request = {
                    referenceCode: "",
                    colorCode: ""
                }
                if($stateParams.referenceCode){request.referenceCode = $stateParams.referenceCode;}
                if($stateParams.colorCode){request.colorCode = $stateParams.colorCode;}
                
                return $http.post("https://api2.madebyblume.com/v3/prerender/product", request).then(function (results) {
                    return results.data;
                }, function(err){ });
            }

            var storeLocations = function () {
                return $http.get("https://api2.madebyblume.com/v3/prerender/storeLocations").then(function (results) {
                    return results.data;
                }, function(err){ });
            }

            var checkout = function () {
                return $http.get("https://api2.madebyblume.com/v3/prerender/checkout").then(function (results) {
                    return results.data;
                }, function(err){ });
            }
  
              return {
                  mainPage: mainPage,
                  products: products,
                  product: product,
                  storeLocations: storeLocations,
                  checkout: checkout
              }
          }
  })();
  