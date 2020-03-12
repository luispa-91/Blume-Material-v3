(function() {
    'use strict';
    angular
        .module('angular')
        .controller('CartTotalsController', CartTotalsController);
        CartTotalsController.$inject = ['Discount','$scope','Helper'];
    function CartTotalsController(Discount,$scope,Helper) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.discount = { code: '', name:'', value: 0 };
            vm.showDiscountCodeInput = false;
            vm.currency = {value: '', symbol: ''}; 

            //Bind functions
            vm.verifyDiscount = verifyDiscount;
            calculateDiscount();

            Helper.currency().then(function (results) { 
                vm.currency = results;
                if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
             });
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
