(function() {
    'use strict';
    angular
        .module('angular')
        .controller('PaymentDataController', PaymentDataController);
        PaymentDataController.$inject = ['Customer'];
    function PaymentDataController(Customer) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller

            //Bind functions
            
        }
    }
})();
