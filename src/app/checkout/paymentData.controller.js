(function() {
    'use strict';
    angular
        .module('angular')
        .controller('PaymentDataController', PaymentDataController);
        PaymentDataController.$inject = ['Payments'];
    function PaymentDataController(Payments) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.saving = false;
            vm.payment = {orderId: 0, amount: 0, card: {number: '', expMonth: '', expYear: '', cvc: '', expDate: ''}};
            vm.currency = { value: 'CRC', symbol: '₡' };

            //Bind functions
            vm.makePayment = makePayment;

            getPaymentMethods();
        }

        function getPaymentMethods(){
            Payments.availableMethods().then(function(data){ vm.paymentMethods = data; console.log(data); });
        }

        function makePayment(){
            switch (vm.paymentMethod) {
                case "paypal":
                    document.getElementById("PaypalPost").submit();
                  break;
                case "bacsanjose":
                    vm.payment.card.expDate = vm.payment.card.expMonth + vm.payment.card.expYear;
                    vm.paymentMethods.bac.timestamp = Math.round((new Date()).getTime() / 1000);
                    vm.paymentMethods.bac.hash = Payments.bacCreateMd5Hash(vm.payment.orderId,vm.payment.amount,vm.paymentMethods.bac.timestamp,vm.paymentMethods.bac.applicationPassword);
                    setTimeout(function(){
                        document.getElementById("CredomaticPost").submit();
                        }, 2000);
                  break;
                case "fttech":
                  Payments.sendPaymentFttech(vm.payment.orderId,vm.currency.value,vm.payment.amount,vm.payment.card,vm.paymentMethods.fttech);
                  break;
                case "credix":
                  //Add code here
                  break;
                case "moneytransfer":
                  //Add code here
                  break;
              }
        }
    }
})();
