(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Catalog', Catalog);
        Catalog.$inject = ['$http', '$localStorage', 'ngCart', '$state', 'APP_INFO'];
        function Catalog($http, $localStorage, ngCart, $state, APP_INFO){

          var getProducts = function (company_id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/products",
                  params: {
                      company_id: company_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var getCategories = function(company_id){
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/product-types",
                  params: {
                      company_id: company_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var getFeaturedProducts = function (company_id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/products/featured",
                  params: {
                      company_id: company_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var productExpand = function (product_id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/products/expand",
                  params: {
                      product_id: product_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var getCollections = function (company_id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/collections",
                  params: {
                      company_id: company_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var getSliderPhotos = function (company_name) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/files/images",
                  params: {
                      company_name: company_name,
                      image_dir: 'website/slider'
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
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
