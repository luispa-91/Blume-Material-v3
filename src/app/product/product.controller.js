(function() {
  'use strict';

  angular
    .module('angular')
    .controller('ProductDetailController', ProductDetailController);
  ProductDetailController.$inject = ['BlumeAnalytics','$stateParams','Products','Helper'];
  function ProductDetailController(BlumeAnalytics,$stateParams,Products,Helper) {
    var vm = this;
    
    init();
    ///////////////
    function init() {

      //Get Parameters
      vm.referenceCode = "";
      vm.colorCode = "";
      vm.isGrupoCachos = false;
      vm.getProductAvailability = getProductAvailability;
      if($stateParams.referenceCode){vm.referenceCode = $stateParams.referenceCode;}
      if($stateParams.colorCode){vm.colorCode = $stateParams.colorCode;}
      vm.currency = {value: '', symbol: ''}; 

      //Initialize Variables
      Helper.currency().then(function (results) { 
        vm.currency = results;
        if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
        Products.expand(vm.referenceCode,vm.colorCode).then(function(data){
          vm.products = data.products;
          vm.productImages = data.images;
          vm.product = vm.products[0];
          vm.option1 = vm.product.externalId;
          vm.relatedProducts = data.relatedProducts;
          vm.isGrupoCachos = data.isGrupoCachos;
          BlumeAnalytics.fbPixelViewContent(vm.product);
          vm.getProductAvailability();  
        });
     });
      
    }

    function getProductAvailability(){
      Products.availability(vm.option1).then(function(response){ vm.productAvailability = response; });
    }

      vm.setActive = function(index) {
        for (var i = 0; i < vm.productImages.length; i++) {
          vm.productImages[i].active=false;
        }
        vm.productImages[index].active=true;
      }

  }
})();