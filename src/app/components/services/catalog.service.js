(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Catalog', Catalog);
        Catalog.$inject = ['$http', '$localStorage', 'ngCart', '$state', 'APP_INFO'];
        function Catalog($http, $localStorage, ngCart, $state, APP_INFO){

          var getProducts = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/website/products?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getCategories = function(company_id){
              return $http.get("https://central-api.madebyblume.com/v1/website/product-types?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getFeaturedProducts = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/website/products/featured?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var productExpand = function (product_id) {
              return $http.get("https://central-api.madebyblume.com/v1/website/products/expand?product_id=" + product_id).then(function (results) {
                  return results.data;
              });
          }

          var getCollections = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/website/collections?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getSliderPhotos = function (company_name) {
              return $http.get("https://central-api.madebyblume.com/v1/files/images?company_name=" + company_name + "&image_dir=website/slider").then(function (results) {
                  return results.data;
              });
          }

          var setStoreData = function (company_id) {
     
              return $http.get("https://central-api.madebyblume.com/v1/website/storeData?company_id=" + company_id).then(function (results) {
                  
                  $localStorage.storeData = results.data;

                  return results;
              });
          };



            return {
              getProducts: getProducts,
              getFeaturedProducts: getFeaturedProducts,
              getCategories: getCategories,
              productExpand: productExpand,
              getCollections: getCollections,
              getSliderPhotos: getSliderPhotos,
              setStoreData: setStoreData
            }
        }
})();
