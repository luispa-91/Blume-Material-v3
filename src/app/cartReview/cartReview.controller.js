(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CartReviewController', CartReviewController);
  CartReviewController.$inject = ['$stateParams','Cart','$state','Discount'];
  function CartReviewController($stateParams,Cart,$state,Discount) {
    var vm = this;

    init();
    ///////////////

    function init(){
      //Initialize Controller
      vm.cartId = "";
      if($stateParams.cartId){vm.cartId = $stateParams.cartId;}
      Discount.reset();
      
      Cart.verifyStock();

      //Bind Functions
      vm.continueToCheckout = continueToCheckout;
    }

    function continueToCheckout (){
      $state.go('checkout');
    }

  }
})();
