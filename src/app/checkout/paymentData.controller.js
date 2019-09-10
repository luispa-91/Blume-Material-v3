(function() {
    'use strict';
    angular
        .module('angular')
        .controller('PaymentDataController', PaymentDataController);
        PaymentDataController.$inject = ['Payments','Order','DataCollection','BlumeStorage','$scope'];
    function PaymentDataController(Payments,Order,DataCollection,BlumeStorage,$scope) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.saving = false;
            vm.useTasaCero = false;
            vm.acceptedPrivacyPolicy = false;
            vm.moneyTransferReceiptSent = false;
            vm.errorMessage = "";
            vm.payment = {orderId: 0, url:'', amount: 0, card: {number: '', expMonth: '', expYear: '', cvc: '', expDate: ''}};
            vm.currency = { value: 'CRC', symbol: '₡' };
            vm.paymentMethod = "";
            vm.months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
            vm.years = ["2019","2020","2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"];
            vm.uploader = BlumeStorage.createImageUploader();
            vm.moneyTransferReceiptUrl = "moneyTransferReceipt/";

            //Bind functions
            vm.makePayment = makePayment;

            getPaymentMethods();
        }

        BlumeStorage.broadcastUploadComplete($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                vm.moneyTransferReceiptSent = true;
                $scope.$apply();
                }, 500);
        });

        function getPaymentMethods(){
            Payments.availableMethods().then(function(data){ vm.paymentMethods = data; });
        }

        function makePayment(){
          vm.saving = true;
          vm.errorMessage = "";
          if(vm.acceptedPrivacyPolicy==true){
            Order.create(vm.currency.value,vm.paymentMethod).then(function(data){
              vm.payment.orderId = data.id;
              vm.payment.amount = data.total;
              vm.payment.url = data.urlCode;
              vm.moneyTransferReceiptUrl += data.urlCode + "/";
              BlumeStorage.moneyTransferReceipt.url = vm.moneyTransferReceiptUrl;
              switch (vm.paymentMethod) {
                case "paypal":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"PayPal").then(function(data){ 
                      if(vm.currency.value=='CRC'){
                        vm.payment.amount = vm.payment.amount / 600;
                      }
                      document.getElementById("PayPalPost").submit(); 
                      vm.saving = false;
                    });
                  break;
                case "bacsanjose":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,vm.payment.card.number).then(function(data){
                      if(vm.useTasaCero==true){
                        vm.paymentMethods.bac.processorId="grupocachostc3";
                      }
                      vm.payment.card.expDate = vm.payment.card.expMonth + vm.payment.card.expYear;
                      vm.paymentMethods.bac.timestamp = Math.round((new Date()).getTime() / 1000);
                      vm.paymentMethods.bac.hash = Payments.bacCreateMd5Hash(vm.payment.orderId,vm.payment.amount,vm.paymentMethods.bac.timestamp,vm.paymentMethods.bac.applicationPassword);
                      setTimeout(function(){
                          document.getElementById("CredomaticPost").submit();
                          vm.saving = false;
                          }, 2000);
                    });
                  break;
                case "fttech":
                  DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,vm.payment.card.number).then(function(data){ 
                    Payments.sendPaymentFttech(vm.payment.orderId,vm.currency.value,vm.payment.amount,vm.payment.card,vm.paymentMethods.fttech).then(function(data){ vm.saving = false; });
                  });
                  break;
                case "credix":
                  DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"Credix").then(function(data){ 
                    var amount = vm.payment.amount * 100;
                    var submitUrl = "https://webpay.credix.com/consumo#hash=" + vm.paymentMethods.credix.hash + "&referencia=" + vm.payment.orderId + "&monto=" + amount + "&moneda=188";
                    Payments.sendPaymentCredix(submitUrl).then(function(data){ vm.saving = false; });
                  });
                  break;
                case "moneytransfer":
                  DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"Transferencia").then(function(data){ 
                    vm.uploader.uploadAll();
                    vm.saving = false;
                  });
                  break;
              }
            })
          } else {
            vm.errorMessage = "Para continuar con tu compra debes aceptar las políticas de privacidad.";
            vm.saving = false;
          }
        }
    }
})();
