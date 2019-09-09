(function() {
'use strict';
angular
    .module('angular')
    .controller('ProductsController', ProductsController);
    ProductsController.$inject = ['$location','Website','Products','$state'];
    function ProductsController($location, Website,Products,$state) {
    var vm = this;

    init();
    ///////////////
    function init() {

        vm.products = [];
        vm.activeFilters = [];
        vm.criteria = "";
        vm.brandBanner = "";
        vm.loadingContent = false;
        vm.showFiltersMobile = false;
        vm.itemsDisplayed = 9;
        vm.state = $state.$current.name;
        if($state.params.s){
            vm.criteria = $state.params.s;
        }

        loadProducts();

        vm.setFilter = setFilter;
        vm.removeFilter = Website.removeFilter;
        vm.addMoreItems = addMoreItems;
        vm.saleProducts = saleProducts;
    }

    function addMoreItems () {
        vm.itemsDisplayed += 3;
    }

    function saleProducts(prop, val){
        return function(item){
          if(vm.state=='sale'){
            return item[prop] > val;
          } else {
              return item;
          }
        }
    }

    function setFilter(filter,value){
        filter.criteria = value;
        Website.setFilter(filter);
        if(!filter.isActive){
            filter.isActive = true;
        }
    }

    function loadProducts() {
        vm.loading = true;
        var url = $location.url().substring(1);
        url = url.replace("?","/");
        url = url.replace(/=/g,"/");
        url = url.replace(/&/g,"/");
        var filterArray = url.split('/');
        Products.list(filterArray).then(function (results) { vm.loading = false; vm.products = results; },function(err){ Mail.errorLog(err) });
        Products.filterList(filterArray).then(function (results) { vm.filters = results; },function(err){ Mail.errorLog(err) });
    }

}
})();
