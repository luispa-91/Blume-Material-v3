(function() {
    'use strict';
    angular
        .module('angular')
        .controller('CartTotalsController', CartTotalsController);
        CartTotalsController.$inject = ['Discount','$scope','Helper','Personalization'];
    function CartTotalsController(Discount,$scope,Helper,Personalization) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.discount = { code: '', name:'', value: 0 };
            vm.showDiscountCodeInput = false;
            vm.currency = {value: '', symbol: ''}; 
            vm.site = Helper.currentSite();
            vm.customStyles = Personalization.customStyles(vm.site);

            //Bind functions
            vm.verifyDiscount = verifyDiscount;
            calculateDiscount();

            Helper.currency().then(function (results) { 
                vm.currency = results;
                if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
             });
             if(vm.site=="kamlungpuravida.com"){
                Helper.currencyExchangeRate().then(function (results) { 
                    vm.currencyExchangeRate = results;
                });
            }
            vm.buttonPrimaryStyle = {
            'border-radius': '0px'
            }
            vm.buttonSecondaryStyle = {
            'border-radius': '0px'
            }
            Discount.verifyRules().then(function(data){ if(data.value>0){ vm.discount = data; } });
        }

        Discount.broadcastDiscountUpdate($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                if(vm.discount.type=='combo'){
                    Discount.verifyRules().then(function(data){ if(data.value>0){ vm.discount = data; } else { Discount.reset(); } });
                }
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
