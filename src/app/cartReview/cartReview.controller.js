(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CartReviewController', CartReviewController);
  CartReviewController.$inject = ['$stateParams','Cart','$state','Discount','Delivery','Helper'];
  function CartReviewController($stateParams,Cart,$state,Discount,Delivery,Helper) {
    var vm = this;

    init();
    ///////////////

    function init(){
      //Initialize Controller
      vm.cartId = "";
      if($stateParams.cartId){vm.cartId = $stateParams.cartId;}
      Discount.reset();
      Delivery.restart();
      vm.currency = {value: '', symbol: ''}; 
      
      Cart.verifyStock();

      //Bind Functions
      vm.continueToCheckout = continueToCheckout;

      
      Helper.currency().then(function (results) { 
        vm.currency = results;
        if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
      });
    }

    function continueToCheckout (){
      $state.go('checkout');
    }

  }
})();