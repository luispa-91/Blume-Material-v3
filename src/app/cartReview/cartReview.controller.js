(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CartReviewController', CartReviewController);
  CartReviewController.$inject = ['$stateParams','Cart','$state','Discount','Delivery'];
  function CartReviewController($stateParams,Cart,$state,Discount,Delivery) {
    var vm = this;

    init();
    ///////////////

    function init(){
      //Initialize Controller
      vm.cartId = "";
      if($stateParams.cartId){vm.cartId = $stateParams.cartId;}
      Discount.reset();
      Delivery.restart();
      
      Cart.verifyStock();

      //Bind Functions
      vm.continueToCheckout = continueToCheckout;
    }

    function continueToCheckout (){
      $state.go('checkout');
    }

  }
})();
