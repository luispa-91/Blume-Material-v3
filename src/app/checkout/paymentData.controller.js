(function() {
    'use strict';
    angular
        .module('angular')
        .controller('PaymentDataController', PaymentDataController);
        PaymentDataController.$inject = ['Payments','Order','DataCollection','BlumeStorage','$scope','$localStorage','Helper','Personalization','Mail'];
    function PaymentDataController(Payments,Order,DataCollection,BlumeStorage,$scope,$localStorage,Helper,Personalization,Mail) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.sessionId = Helper.getKountSessionId();
            vm.saving = false;
            vm.useTasaCero = false;
            vm.useTasaCero6 = false;
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
            vm.site = Helper.currentSite();
            vm.customStyles = Personalization.customStyles(vm.site);

            //Bind functions
            vm.makePayment = makePayment;
            
            getPaymentMethods();
            Helper.setSessionId(vm.sessionId);

        }

        BlumeStorage.broadcastUploadComplete($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                vm.moneyTransferReceiptSent = true;
                $scope.$apply();
                }, 500);
        });

        function getPaymentMethods(){
            Helper.currency().then(function (results) { 
                vm.currency = results;
                if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
                Payments.availableMethods().then(function(data){ vm.paymentMethods = data; });
            });
        }

        function makePayment(){
          vm.saving = true;
          vm.errorMessage = "";
          vm.moneyTransferReceiptSent = false;
          if(vm.acceptedPrivacyPolicy==true){
            if(!$localStorage.deliveryType){
              vm.errorMessage = "Para continuar con tu compra debes escoger un método de entrega";
              vm.saving = false;
            } else if(!$localStorage.customerComplete||!$localStorage.customerId){
              vm.errorMessage = "Para continuar con tu compra debes completar tus datos personales";
              vm.saving = false;
            } else if(!$localStorage.addressComplete){
              vm.errorMessage = "Para continuar con tu compra debes completar tus datos de envío";
              vm.saving = false;
            } else if(vm.paymentMethod==''){
              vm.errorMessage = "Para continuar con tu compra debes escoger un método de pago";
              vm.saving = false;
            } else if(vm.paymentMethod=='moneytransfer'&&vm.uploader.queue.length==0){
              vm.errorMessage = "Para pagar con transferencia debes adjuntar el comprobante de pago. Haz click en el botón de adjuntar comprobante, una vez seleccionado, haz click en Finalizar Compra.";
              vm.saving = false;
            } else {
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
                          if(vm.paymentMethods.bac.processorId=="grupocachos"){ vm.paymentMethods.bac.processorId="grupocachostc3"; }
                          else if(vm.paymentMethods.bac.processorId=="11040616") { vm.paymentMethods.bac.processorId="11486398"; }
                        } 
                        if(vm.useTasaCero6==true) { vm.paymentMethods.bac.processorId="11486401"; }
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
                  case "greenpay":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,vm.payment.card.number).then(function(data){ 
                      Payments.sendPaymentGreenPay(vm.payment.orderId,vm.payment.card,vm.sessionId).then(function(data){ vm.saving = false; });
                    });
                    break;
                  case "cybersource":
                    DataCollection.getClientInfo().then(function(response){
                      var clientInfo = response; 
                      var deviceFingerprintId = cybs_dfprofiler(vm.paymentMethods.cybersource.merchantId,"live");
                      Payments.sendPaymentCybersource(vm.payment.orderId,clientInfo,deviceFingerprintId,vm.payment.card).then(function(data){ vm.saving = false; });
                    })
                    break;
                  case "fac":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,vm.payment.card.number).then(function(data){ 
                      Payments.sendPaymentFAC(vm.payment.orderId,vm.payment.card).then(function(data){ vm.saving = false; });
                    });
                    break;
                  case "credix":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"Credix").then(function(data){
                      var submitUrl = "https://webpay.credix.com/consumo#hash=" + vm.paymentMethods.credix.hash + "&referencia=" + vm.payment.orderId + "&monto=" + vm.payment.amount + ".00&moneda=188";
                      Payments.sendPaymentCredix(submitUrl).then(function(data){ vm.saving = false; });
                    });
                    break;
                  case "moneytransfer":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"Transferencia").then(function(data){ 
                      vm.uploader.uploadAll();
                      vm.saving = false;
                    });
                    break;
                  case "po":
                    DataCollection.logPayment(vm.payment.orderId,vm.paymentMethod,"Orden de Pago").then(function(data){ 
                      vm.moneyTransferReceiptSent = true;
                      vm.saving = false;
                      Mail.sendEmail(vm.payment.orderId,'pending').then(function(response){ });
                    });
                    break;
                }
              },function(err){console.log(err); vm.saving = false; });
            }
          } else {
            vm.errorMessage = "Para continuar con tu compra debes aceptar las políticas de privacidad.";
            vm.saving = false;
          }
        }
    }
})();
