(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CatalogController', CatalogController);
        function CatalogController($scope, Catalog, Products, APP_INFO, Personalization, Mail, $stateParams, $state) {
        var vm = this;

        $scope.setCategoryFilter = setCategoryFilter;
        init();

        function init() {

          $scope.selectedCategory = "";
          if($stateParams.productType){
            $scope.selectedCategory = $stateParams.productType;
          }
          $scope.catalog = [];
          vm.load_count = 0;
          vm.busy = false;
          vm.styles = Personalization.styles;
          // vm.stop_loading = false;
          vm.itemsDisplayed = 8;
          vm.addMoreItems = addMoreItems;
          vm.companyId = APP_INFO.ID;
          vm.setSizeFilter = setSizeFilter;

          vm.loader = true;
          if($stateParams.variantName){
            Products.allByVariantName($stateParams.variantName)
              .then(function (data) {
                  vm.catalog = data;
                  vm.loader = false;
              },function(err){ Mail.errorLog(err) });
          } else {
            Products.all()
              .then(function (data) {
                  vm.catalog = data;
                  vm.loader = false;
              },function(err){ Mail.errorLog(err) });
          }

          Catalog.getCategories(APP_INFO.ID)
              .then(function (data) {
                  $scope.categories = data;
              },function(err){ Mail.errorLog(err) });

          //Set store configuration
          Catalog.setStoreData(APP_INFO.ID)
            .then(function (response) {
              vm.currency = response.data.currency;
            },function(err){ Mail.errorLog(err) });

        }

        function setSizeFilter(sizeFilter){
            if(sizeFilter != ''){
                $state.go('productVariantsByName' ,{variantName: sizeFilter});
            } else {
                $state.go('products');
            }
        }

        function addMoreItems(){
            vm.itemsDisplayed += 4;
        }

        function setCategoryFilter(){
          console.log($scope.selectedCategory);
            $state.go('productsAlt',{'productType':$scope.selectedCategory});

        }
    }
})();
