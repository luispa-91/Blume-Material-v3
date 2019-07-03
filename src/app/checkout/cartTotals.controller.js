(function() {
    'use strict';
    angular
        .module('angular')
        .controller('CartTotalsController', CartTotalsController);
        CartTotalsController.$inject = ['Discount','$scope'];
    function CartTotalsController(Discount,$scope) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.discount = { code: '', name:'', value: 0 };
            vm.showDiscountCodeInput = false;

            //Bind functions
            vm.verifyDiscount = verifyDiscount;
            calculateDiscount();
        }

        Discount.broadcastDiscountUpdate($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                calculateDiscount();
                $scope.$apply();
                }, 500);
        });

        function verifyDiscount(){
            Discount.verify(vm.discount.code).then(function(data){ vm.discount = data; });
        }

        function calculateDiscount(){
            vm.discount = Discount.calculateDiscount();
        }
    }
})();
