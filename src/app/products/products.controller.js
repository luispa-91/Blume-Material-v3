(function() {
'use strict';
angular
    .module('angular')
    .controller('ProductsController', ProductsController);
    ProductsController.$inject = ['$location','Website','Products','$state','$scope','Helper'];
    function ProductsController($location, Website,Products,$state,$scope,Helper) {
    var vm = this;

    init();
    ///////////////
    function init() {

        vm.products = [];
        vm.activeFilters = [];
        vm.criteria = "";
        vm.customBanner = "";
        vm.loadingContent = false;
        vm.showFiltersMobile = false;
        vm.itemsDisplayed = 9;
        vm.currency = {value: '', symbol: ''}; 
        vm.site = Helper.currentSite();
        vm.state = $state.$current.name;
        vm.loadingPage = true;
        vm.timestamp = new Date().getTime();
        if($state.params.s){
            vm.criteria = $state.params.s;
        }
        //Grupo Cachos brand banners
        vm.brand = $location.search().brand;
        vm.customBanner = $location.search().customValueC;
        if(vm.site=="nmnuevomundo.com"&&vm.customBanner){ vm.customBanner = vm.customBanner.replace(/\W/g, '').toLowerCase(); }
        if(vm.brand){ vm.brand = vm.brand.replace(/\W/g, '').toLowerCase(); }

        vm.setFilter = setFilter;
        vm.removeFilter = Website.removeFilter;
        vm.addMoreItems = addMoreItems;
        vm.saleProducts = saleProducts;

    }

    Website.broadcastUrlChanged($scope, function broadcastUpdate() {
        // Handle notification
        setTimeout(function(){
            if(vm.state=='keds'){
                loadKeds();
            } else {
                loadProducts();
            }
            $scope.$apply();
            });
    });

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

    function loadKeds(){
        Helper.currency().then(function (results) { 
            vm.currency = results;
            if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
            vm.loading = true;
            Products.keds().then(function (results) { vm.loading = false; vm.products = results; vm.loadingPage = false; },function(err){ Mail.errorLog(err); vm.loadingPage = false; });
         });
    }

    function loadProducts() {
        Helper.currency().then(function (results) { 
            vm.currency = results;
            if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
            vm.loading = true;
            var url = $location.url().substring(1);
            url = decodeURIComponent(url);
            url = url.replace("?","/");
            url = url.replace(/=/g,"/");
            url = url.replace(/&/g,"/");
            var filterArray = url.split('/');
            Products.list(filterArray).then(function (results) { vm.loading = false; vm.products = results; vm.loadingPage = false; },function(err){ Mail.errorLog(err); vm.loadingPage = false; });
            Products.filterList(filterArray).then(function (results) { vm.filters = results; },function(err){ Mail.errorLog(err) });
         });
    }

}
})();
