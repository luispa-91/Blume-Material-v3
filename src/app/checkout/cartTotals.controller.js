(function() {
    'use strict';
    angular
        .module('angular')
        .controller('CartTotalsController', CartTotalsController);
        CartTotalsController.$inject = ['Discount','$scope','Helper','Personalization','$localStorage'];
    function CartTotalsController(Discount,$scope,Helper,Personalization,$localStorage) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.discount = getCurrentDiscount();
            vm.showDiscountCodeInput = false;
            vm.currency = {value: '', symbol: ''}; 
            vm.site = Helper.currentSite();
            vm.customStyles = Personalization.customStyles(vm.site);
            vm.verifyDiscount = verifyDiscount;

            Helper.currency().then(function (results) { 
                vm.currency = results;
                if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
             });
             if(vm.site=="kamlungpuravida.com"){
                // Helper.currencyExchangeRate().then(function (results) { 
                //     vm.currencyExchangeRate = results;
                // });
                vm.currencyExchangeRate = 0.001728;
            }
            vm.buttonPrimaryStyle = {
            'border-radius': '0px'
            }
            vm.buttonSecondaryStyle = {
            'border-radius': '0px'
            }

            verifyDiscount();
        }

        Discount.broadcastDiscountUpdate($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                verifyDiscount();
                $scope.$apply();
                }, 500);
        });

        function verifyDiscount(){
            Discount.verify(vm.discount).then(function(data){ vm.discount = data; });
        }

        function getCurrentDiscount(){
            if($localStorage.discount){
                return $localStorage.discount;
            } else { return { code: '', name:'', value: 0, type: '', applyTo: '' }; }
        }
    }
})();
