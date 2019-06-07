(function() {
    'use strict';

    angular
        .module('angular')
        .controller('PaymentNotificationController', PaymentNotificationController);
        PaymentNotificationController.$inject = ['Mail','DataCollection'];
        function PaymentNotificationController(Mail,DataCollection) {
        var vm = this;
        init();
        ///////////////

        function init() {
            //Initialize Controller
            vm.loading = false;
            vm.paymentData = DataCollection.logPayment();
            vm.sendEmail = Mail.sendOrderDetails;
        }

    }
})();