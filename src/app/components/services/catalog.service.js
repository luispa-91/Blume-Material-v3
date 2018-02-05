(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Catalog', Catalog);
        Catalog.$inject = ['$http', '$localStorage', 'ngCart', '$state', 'APP_INFO'];
        function Catalog($http, $localStorage, ngCart, $state, APP_INFO){

          var baseUrl = "";

          var getProducts = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/website/products?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getMoreProducts = function (company_id, load_count) {
              return $http.get("https://central-api.madebyblume.com/v1/website/products/loadMore?company_id=" + company_id + '&load_count=' + load_count + '&page_size=' + APP_INFO.page_size).then(function (results) {
                  return results.data;
              });
          }

          var getDiscountProducts = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/products/sale/all?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getCategories = function(company_id){
              return $http.get("https://central-api.madebyblume.com/v1/website/product-types?company_id=" + company_id).then(function (results) {
                  return results.data;
              });
          }

          var getFeaturedProducts = function (company_id) {
              return $http.get("https://central-api.madebyblume.com/v1/products/featured?company_id=" + company_id).then(function (results) {
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

          var getProductTypesByCollection = function(company_id, collection){
              return $http.get("https://central-api.madebyblume.com/v1/website/collection/product-types?company_id=" + company_id + "&collection=" + collection).then(function (results) {
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
              getMoreProducts: getMoreProducts,
              getDiscountProducts: getDiscountProducts,
              getFeaturedProducts: getFeaturedProducts,
              getCategories: getCategories,
              productExpand: productExpand,
              getCollections: getCollections,
              setStoreData: setStoreData,
              getProductTypesByCollection: getProductTypesByCollection
            }
        }
})();
