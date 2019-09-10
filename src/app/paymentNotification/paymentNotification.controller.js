(function() {
    'use strict';

    angular
        .module('angular')
        .controller('PaymentNotificationController', PaymentNotificationController);
        PaymentNotificationController.$inject = ['Payments','$state'];
        function PaymentNotificationController(Payments,$state) {
        var vm = this;
        init();
        ///////////////

        function init() {
            //Initialize Controller
            vm.loading = false;
            vm.paymentData = {};
            if($state.$current.name=="paymentNotificationCredix"){
                Payments.receivePaymentNotificationCredix().then(function(response){ vm.paymentData = response; });
            } else if($state.$current.name=="paymentNotificationFttech"){
                Payments.receivePaymentNotificationFttech().then(function(response){ vm.paymentData = response; });
            } else if($state.$current.name=="paymentNotification"){
                Payments.receivePaymentNotificationCredix();
            }
        }

    }
})();