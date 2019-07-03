(function() {
    'use strict';

    angular
        .module('angular')
        .controller('PaymentNotificationController', PaymentNotificationController);
        PaymentNotificationController.$inject = ['Payments','DataCollection','$location'];
        function PaymentNotificationController(Payments,DataCollection,$location) {
        var vm = this;
        init();
        ///////////////

        function init() {
            //Initialize Controller
            vm.loading = false;
            Payments.receivePaymentNotificationCredix();
            // vm.paymentData = DataCollection.logPayment();
        }

    }
})();