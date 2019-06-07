(function() {
  'use strict';

  angular
    .module('angular')
    .controller('ProductDetailController', ProductDetailController);
  ProductDetailController.$inject = ['BlumeAnalytics','$stateParams','Products'];
  function ProductDetailController(BlumeAnalytics,$stateParams,Products) {
    var vm = this;
    
    init();
    ///////////////
    function init() {

      //Get Parameters
      vm.referenceCode = "";
      vm.colorCode = "";
      if($stateParams.referenceCode){vm.referenceCode = $stateParams.referenceCode;}
      if($stateParams.colorCode){vm.colorCode = $stateParams.colorCode;}

      //Initialize Variables
      Products.expand(vm.referenceCode,vm.colorCode).then(function(data){
        vm.products = data.products;
        vm.productImages = data.images;
        vm.product = vm.products[0];
        vm.option1 = vm.product.externalId;
        vm.relatedProducts = data.relatedProducts;
        BlumeAnalytics.fbPixelViewContent(vm.product);
      });
      
    }

      vm.setActive = function(index) {
        vm.productImages[index].active=true;
      }

  }
})();
