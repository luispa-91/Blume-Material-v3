(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CatalogController', CatalogController);
        function CatalogController($scope, Catalog, APP_INFO, Personalization) {
        var vm = this;

        $scope.setCategoryFilter = setCategoryFilter;
        init();

        function init() {

          $scope.selectedCategory = "";
          $scope.catalog = [];
          vm.load_count = 0;
          vm.busy = false;
          vm.styles = Personalization.styles;
          // vm.stop_loading = false;

          vm.loader = true;
          Catalog.getProducts(APP_INFO.ID)
              .then(function (data) {
                  $scope.catalog = data;

                  //Uncomment for infinite scroll + lazy load
                  // vm.loadMore = function() {
                  //   vm.busy = true;
                  //   //Call api to get more products
                  //   if(vm.stop_loading == false){
                  //     vm.load_count += 1;
                  //     Catalog.getMoreProducts(APP_INFO.ID, vm.load_count).then(function(results){
                  //     var new_products = results;
                  //     if (new_products.length > 0){
                  //       for(var i = 1; i <= new_products.length; i++) {
                  //         $scope.catalog.push(new_products[i]);
                  //       }
                  //       vm.busy = false;
                  //     } else {
                  //       vm.stop_loading = true;
                  //       vm.busy = false;
                  //     }
                      
                  //   });
                  //   } else {
                  //     vm.busy = false;
                  //   }
                    
                    
                  // }.bind(vm);
                  
                  vm.loader = false;
              });

          Catalog.getCategories(APP_INFO.ID)
              .then(function (data) {
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
