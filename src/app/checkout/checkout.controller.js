(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['ngCart', 'Checkout', 'Delivery', 'Website', '$scope', 'md5', 'APP_INFO', '$timeout'];
    function CheckoutController(ngCart, Checkout, Delivery, Website, $scope, md5, APP_INFO, $timeout) {
        var vm = this;

        init();
        //Initialize token on checkout start
        vm.getToken();

        function init(){

            //Initialize variables
            vm.customer = Delivery.customer;
            vm.address = Delivery.address;
            vm.billing_address = Delivery.billing_address;
            vm.destination_coords = Delivery.destination_coords;
            vm.discount_code = Checkout.discount_code;
            vm.website_url = APP_INFO.website_url;
            vm.loading_location = false;
            vm.card = Checkout.card;
            vm.card_options = Checkout.card_options;
            vm.two_co = Checkout.two_co;
            vm.temp = Checkout.temp;
            vm.selected_method = "";
            vm.customer_address = Delivery.customer_address;
            if(!vm.address.address){
                ngCart.setShipping(0);
            }
            vm.getStoreSettings = Website.getStoreSettings;
            vm.getStoreSettings().then(function(results){
                vm.store = results;
                setTaxRate();

                setDefaultPaymentMethod();
            });
            //Get Website settings
            vm.getSettings = Delivery.getSettings;
            vm.getSettings().then(function(results){
                vm.settings = results;
            })

            TCO.loadPubKey('production');


            //Cart summary functions
            vm.checkStock = Checkout.checkStock;

            //Cart address functions
            vm.mapClick = Delivery.mapClick;
            vm.placeLookup = Delivery.placeLookup;
            vm.dragDestination = Delivery.dragDestination;
            vm.verifyData = Checkout.verifyData;
            vm.calculateShipping = Delivery.calculateShipping;
            vm.syncCustomerAddress = Delivery.syncCustomerAddress;
            vm.syncBillingAddress = Delivery.syncBillingAddress;
            vm.toggleDelivery = Delivery.toggleDelivery;
            vm.distanceBasedPricing = Delivery.distanceBasedPricing;
            vm.weightBasedPricing = Delivery.weightBasedPricing;
            vm.currentLocation = currentLocation;

            //Cart checkout functions
            vm.getToken = Checkout.getToken;
            vm.showPrompt = Checkout.showPrompt;
            vm.makePayment = Checkout.makePayment;
            vm.createCustomer = Checkout.createCustomer;
            vm.setPaymentMethod = setPaymentMethod;

            vm.timestamp = Math.round((new Date()).getTime() / 1000);


            

        }
        
        // Broadcast notification after calculating shipping cost
        Delivery.broadcastShippingCost($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                vm.calculateShipping();
                vm.syncCustomerAddress();
                vm.syncBillingAddress();
                vm.loading_location = false;
                $scope.$apply();
                }, 500);
        });

        function setTaxRate(){
            if(vm.store.charge_tax){
                ngCart.setTaxRate(vm.store.tax_rate);
            } 
        }

        function setPaymentMethod(){
            if(vm.selected_method == 'TwoCheckout'){
                Checkout.order.payment_method = 'Credit Card'
                console.log(Checkout.order);
                vm.makePayment();
            } else if(vm.selected_method == 'BankAccount'){
                Checkout.order.payment_method = 'Bank Transfer'
                vm.createCustomer();
            } else if(vm.selected_method == 'BACSanJose'){
                Checkout.order.payment_method = 'BAC San Jose'
                vm.createCustomer().then(function(results){
                    $timeout(function () { 
                        var total = (ngCart.totalCost()) - vm.discount_code.amount;
                        vm.prehash = vm.temp.purchase.order_id + "|" + total + "|" + vm.timestamp + "|CAwDP8vg6wbxP42FS775r6Q8RfB2j2Ep";
                        vm.hash = md5.createHash(vm.prehash);
                        submitBAC();
                         }, 2000, true);
                });
            } else if(vm.selected_method == 'Paypal'){
                Checkout.order.payment_method = 'Paypal'
                vm.createCustomer().then(function(results){
                    $timeout(function () { 
                        submitPaypal();
                         }, 2000, true);
                });
            }
        }

        function currentLocation(){
            vm.loading_location = true;
            Delivery.currentLocation();
        }

        function setDefaultPaymentMethod(){
            if(vm.store.payment_options.twocheckout){
                vm.selected_method = "TwoCheckout";
            } else if(vm.store.payment_options.bacsanjose){
                vm.selected_method = "BACSanJose";
            } else if(vm.store.payment_options.paypal){
                vm.selected_method = "Paypal";
            } else if(vm.store.payment_options.banktransfer) {
                vm.selected_method = "BankTransfer";
            }
        }

        function submitBAC(){
            document.getElementById("CredomaticPost").submit();
        }

        function submitPaypal(){
            document.getElementById("PaypalPost").submit();
        }

    }
})();
