(function() {
    'use strict';

    angular
        .module('angular')
        .controller('ConfirmationController', ConfirmationController);
        function ConfirmationController($location, Order, Checkout, Website) {
        var vm = this;
        vm.map = null;

        //Initialize controller
        init();

        function init(){
            //Get store locations settings
            vm.temp = Checkout.temp;
            vm.response_text = "";
            Website.getStoreSettings().then(function(results){
                vm.store = results;
                    if(vm.store.payment_options.bacsanjose){
                    vm.response_code = $location.search().response_code;
                    vm.order_id = $location.search().orderid;

                    if(vm.response_code == '100'){
                        //Mark as paid
                        Order.saveAsPaid(vm.order_id).then(function(results){
                            var temp = results.data;
                            if(temp.shipment_id != 0){
                              Order.mailReceiptWithTracking(vm.order_id).then(function (results) {
                              });
                              Order.createShippingInvoice(vm.order_id, temp.shipment_id).then(function (results) {
                              });
                              Checkout.updateStoreStock(vm.order_id).then(function (results) {
                              });
                            } else {
                              Order.mailReceipt(vm.order_id).then(function (results) {
                                
                              });
                              Checkout.updateStoreStock(vm.order_id).then(function (results) {
                              });
                            }
                        });
                    } else {
                        if(vm.order_id == 0){
                          vm.response_text = "No se pudo crear la orden, por favor inténtelo de nuevo.";
                        } else {
                          vm.response_text = $location.search().responsetext;
                          Order.saveAsDraft(vm.order_id).then(function(results){});
                          Checkout.addOrderNote(vm.order_id,true,vm.response_text,vm.response_code);
                          Checkout.errorDebugBAC(vm.order_id);
                        }
                    }
                }
            });

             
            
        }

    }
})();