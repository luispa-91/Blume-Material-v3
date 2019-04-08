(function() {
    'use strict';

    angular
        .module('angular')
        .controller('DiscountController', DiscountController);
        function DiscountController($scope, Catalog, APP_INFO, Personalization, Mail, $state) {
        var vm = this;

        $scope.setCategoryFilter = setCategoryFilter;
        init();

        function init() {

          $scope.selectedCategory = "";

          vm.loader = true;
          vm.styles = Personalization.styles;
          vm.itemsDisplayed = 8;
          vm.addMoreItems = addMoreItems;
          vm.companyId = APP_INFO.ID;
          vm.setSizeFilter = setSizeFilter;

          Catalog.getDiscountProducts(APP_INFO.ID)
              .then(function (data) {
                  $scope.catalog = data;
                  vm.loader = false;
              },function(err){ Mail.errorLog(err) });

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

        function setCategoryFilter(category){
            $scope.selectedCategory = category.title;
        }
    }
})();
