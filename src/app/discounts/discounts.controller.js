(function() {
    'use strict';

    angular
        .module('angular')
        .controller('DiscountController', DiscountController);
        function DiscountController($scope, Catalog, APP_INFO, Personalization, Mail) {
        var vm = this;

        $scope.setCategoryFilter = setCategoryFilter;
        init();

        function init() {

          $scope.selectedCategory = "";

          vm.loader = true;
          vm.styles = Personalization.styles;
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

        function setCategoryFilter(category){
            $scope.selectedCategory = category.title;
        }
    }
})();
