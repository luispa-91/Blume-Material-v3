(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CartReviewController', CartReviewController);
  CartReviewController.$inject = ['$stateParams','Cart','$state'];
  function CartReviewController($stateParams, Cart,$state) {
    var vm = this;

    init();
    ///////////////

    function init(){
      //Initialize Controller
      vm.cartId = "";
      if($stateParams.cartId){vm.cartId = $stateParams.cartId;}
      //Cart.verifyStock();

      //Bind Functions
      vm.continueToCheckout = continueToCheckout;
    }

    function continueToCheckout (){
      $state.go('checkout');
    }

  }
})();
