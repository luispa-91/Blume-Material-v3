(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['ngCart', 'Checkout', 'Delivery', 'Website', '$scope', 'md5', 'APP_INFO', '$timeout', 'Countries'];
    function CheckoutController(ngCart, Checkout, Delivery, Website, $scope, md5, APP_INFO, $timeout, Countries) {
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
            if(Checkout.discount_code.valid){
                Checkout.discount_code.valid = false;
                Checkout.discount_code.value = '';
                Checkout.discount_code.amount = 0;
            }
            vm.discount_code = Checkout.discount_code;
            vm.website_url = APP_INFO.website_url;
            vm.loading_location = false;
            vm.card = Checkout.card;
            vm.card_options = Checkout.card_options;
            vm.card_options_2 = Checkout.card_options_2;
            vm.two_co = Checkout.two_co;
            vm.temp = Checkout.temp;
            vm.selected_method = "TwoCheckout";
            vm.use_ft_payment = false;
            vm.countries = Countries.list;
            vm.country_selected = "";
            vm.pickup_in_store = false;
            vm.bac = APP_INFO.bac;
            vm.getDeliveryFares = Delivery.getDeliveryFares;
            vm.changeDeliveryCompany = Delivery.changeDeliveryCompany;
            vm.getDeliveryFares().then(function(results){
                vm.store_fares = results;
                if(vm.store_fares.length == 0){
                    vm.pickup_in_store = true;
                }
            });
            

            vm.total = (ngCart.totalCost() - vm.discount_code.amount).toFixed(2);
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
            vm.calculateExportShipping = Delivery.calculateExportShipping;

            //Cart checkout functions
            vm.getToken = Checkout.getToken;
            vm.showPrompt = Checkout.showPrompt;
            vm.makePayment = Checkout.makePayment;
            vm.createCustomer = Checkout.createCustomer;
            vm.setPaymentMethod = setPaymentMethod;
            vm.payWithFtTechnologies = payWithFtTechnologies;
            vm.selectCardAsPaymentMethod = selectCardAsPaymentMethod;
            vm.submitBAC = submitBAC;

            vm.timestamp = Math.round((new Date()).getTime() / 1000);
            

        }
        
        // Broadcast notification after calculating shipping cost
        Delivery.broadcastShippingCost($scope, function broadcastUpdate() {
            // Handle notification
            setTimeout(function(){
                vm.calculateShipping();
                vm.syncCustomerAddress();
                vm.syncBillingAddress();
                vm.total = (ngCart.totalCost() - vm.discount_code.amount).toFixed(2);
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
            vm.syncCustomerAddress();
            if(vm.selected_method == 'TwoCheckout'){
                Checkout.order.payment_method = 'Credit Card';
                vm.makePayment();
            } else if(vm.selected_method == 'FtTechnologies'){
                Checkout.order.payment_method = 'Credit Card';
                payWithFtTechnologies();
            } else if(vm.selected_method == 'BankAccount'){
                Checkout.order.payment_method = 'Bank Transfer';
                vm.createCustomer();
            } else if(vm.selected_method =='Paypal'){
                Checkout.order.payment_method = 'Paypal';
                submitPaypal();
            }
        }

        function currentLocation(){
            vm.loading_location = true;
            Delivery.currentLocation();
        }

        function setDefaultPaymentMethod(){
            if(vm.store.payment_options.twocheckout){
                vm.selected_method = "TwoCheckout";
            } else if(vm.store.payment_options.fttechnologies){
                vm.selected_method = "FtTechnologies";
            } else if(vm.store.payment_options.bacsanjose){
                vm.selected_method = "BACSanJose";
            } else if(vm.store.payment_options.paypal){
                vm.selected_method = "Paypal";
            } else if(vm.store.payment_options.banktransfer) {
                vm.selected_method = "BankTransfer";
            }
        }

        function submitBAC(){
            vm.card.exp_month = vm.card.expiry.substring(0, 2);
            if(vm.card.expiry.length > 7){
              vm.card.exp_year = vm.card.expiry.substring(7, 9);
            } else {
              vm.card.exp_year = vm.card.expiry.substring(5, 7);
            }

            vm.card.expiry = vm.card.exp_month + vm.card.exp_year;
            

            setTimeout(function(){
                document.getElementById("CredomaticPost").submit();
                }, 1500);
        }

        function submitPaypal(){
            document.getElementById("PaypalPost").submit();
        }

        function payWithFtTechnologies(){

            //split expiry date
            vm.card.exp_month = parseInt(vm.card.expiry.substring(0, 2));
            if(vm.card.expiry.length > 7){
              vm.card.exp_year = parseInt('20' + vm.card.expiry.substring(7, 9));
            } else {
              vm.card.exp_year = parseInt('20' + vm.card.expiry.substring(5, 7));
            }

            var card_number = vm.card.number.replace(/\s/g, '');
            
            vm.temp = Checkout.temp;
            
            var args = {
                applicationName:APP_INFO.gateway.applicationName,
                applicationPassword:APP_INFO.gateway.applicationPassword,
                chargeDescription: vm.temp.purchase.order_number,
                transactionCurrency: vm.store.currency,
                transactionAmount: vm.total,
                primaryAccountNumber: card_number,
                expirationMonth: vm.card.exp_month,
                expirationYear: vm.card.exp_year,
                verificationValue: vm.card.cvc
            };

            Checkout.chargeCardUsingFtTechnologies(args);

        }

        function selectCardAsPaymentMethod() {
            if(vm.store.payment_options.fttechnologies){
                vm.selected_method = "FtTechnologies";
            } else if(vm.store.payment_options.twocheckout){
                vm.selected_method = "TwoCheckout";
            }
        }
    }
})();
