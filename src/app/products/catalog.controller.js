(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CatalogController', CatalogController);
        function CatalogController($scope, Catalog, APP_INFO) {
        var vm = this;

        $scope.setCategoryFilter = setCategoryFilter;
        init();

        function init() {
          vm.loader = true;
          Catalog.getProducts(APP_INFO.ID)
              .success(function (data) {
                  $scope.catalog = data;
                  vm.loader = false;
              });

          Catalog.getCategories(APP_INFO.ID)
              .success(function (data) {
                  $scope.categories = data;
              });

          //Set store configuration
          Catalog.setStoreData(APP_INFO.ID)
            .then(function (response) {
              vm.currency = response.data.currency;
            });

        }

        function setCategoryFilter(category){
            $scope.selectedCategory = category.title;
        }
    }
})();
