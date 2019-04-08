(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['ngCart', 'Checkout', 'Delivery', 'Website', '$scope', 'md5', 'APP_INFO', 'Countries', 'Mail', '$state', '$localStorage'];
    function CheckoutController(ngCart, Checkout, Delivery, Website, $scope, md5, APP_INFO, Countries, Mail, $state, $localStorage) {
        var vm = this;

        init();

        function init(){
            vm.temp = Checkout.temp;
            vm.companyId = APP_INFO.ID;
            vm.useMap = APP_INFO.use_map;
            vm.showTotals = true;
            if($state.current.name == 'checkout.confirmed' || $state.current.name == 'checkout.confirmedPayPal' || $state.current.name == 'checkout.confirmedCredix'){
                vm.showTotals = false;
            } else if($state.current.name == 'checkout.placeOrder') {
                if(vm.temp.purchase.order_id==0 && $localStorage.orderId){
                    vm.temp.purchase.order_id=$localStorage.orderId;
                    if($localStorage.shipmentId){
                        vm.temp.purchase.shipment_id=$localStorage.shipmentId;
                    }
                    if($localStorage.customerId){
                        vm.temp.customer_id=$localStorage.customerId;
                    }
                }
            }
            
            //Initialize variables
            vm.loader = false;
            // vm.documentId = "";
            vm.customer = Delivery.customer;
            vm.address = Delivery.address;
            vm.billing_address = Delivery.billing_address;
            vm.destination_coords = Delivery.destination_coords;
            if(Checkout.discount_code.valid){
                Checkout.discount_code.valid = false;
                Checkout.discount_code.value = '';
                Checkout.discount_code.amount = 0;
            }
            vm.has_international_shipping = APP_INFO.international_shipping;
            vm.discount_code = Checkout.discount_code;
            vm.website_url = APP_INFO.website_url;
            vm.loading_location = false;
            vm.card = Checkout.card;
            vm.card_options = Checkout.card_options;
            vm.card_options_2 = Checkout.card_options_2;
            vm.two_co = Checkout.two_co;
            vm.selected_method = "TwoCheckout";
            vm.use_ft_payment = false;
            vm.countries = Countries.list;
            vm.provinces = Countries.costaRicaProvinces;
            vm.states = Countries.costaRicaStates;
            vm.cities = Countries.costaRicaCities;
            vm.country_selected = "";
            vm.selectedProvince = "";
            vm.selectedState = "";
            vm.selectedCity = "";
            vm.pickup_in_store = false;
            vm.bac = APP_INFO.bac;
            vm.getDeliveryFares = Delivery.getDeliveryFares;
            vm.months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
            vm.years = ["2018","2019","2020","2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"];
            vm.changeDeliveryCompany = Delivery.changeDeliveryCompany;
            vm.getDeliveryFares().then(function(results){
                vm.store_fares = results;
                if(vm.store_fares.length == 0){
                    vm.pickup_in_store = true;
                } else {
                    vm.destination_coords.selected_fare = vm.store_fares[0].id;
                    vm.changeDeliveryCompany();
                }
            },function(err){ Mail.errorLog(err) });
            

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
            },function(err){ Mail.errorLog(err) });
            //Get Website settings
            vm.getSettings = Delivery.getSettings;
            vm.getSettings().then(function(results){
                vm.settings = results;
            },function(err){ Mail.errorLog(err) })

            //Cart summary functions
            vm.checkStock = Checkout.checkStock;
            Checkout.verifyStock();

            //Cart address functions
            vm.selectProvince = selectProvince;
            vm.selectState = selectState;
            vm.selectCity = selectCity;
            vm.mapClick = Delivery.mapClick;
            vm.placeLookup = Delivery.placeLookup;
            vm.dragDestination = Delivery.dragDestination;
            vm.verifyData = Checkout.verifyData;
            vm.calculateShipping = Delivery.calculateShipping;
            vm.syncCustomerAddress = Delivery.syncCustomerAddress;
            vm.syncBillingAddress = Delivery.syncBillingAddress;
            vm.toggleDelivery = Delivery.toggleDelivery;
            vm.toggleDeliveryAlt = toggleDeliveryAlt;
            vm.distanceBasedPricing = Delivery.distanceBasedPricing;
            vm.weightBasedPricing = Delivery.weightBasedPricing;
            vm.currentLocation = currentLocation;
            vm.calculateExportShipping = Delivery.calculateExportShipping;
            vm.toggleExport = toggleExport;

            //Cart checkout functions
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
                if(!vm.export){
                    vm.calculateShipping();
                } 
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

        function selectProvince(province){
            vm.address.country = province.name;
        }

        function selectState(state){
            vm.address.state = state.name;
        }

        function selectCity(city){
            vm.address.city = city.name;
        }

        function toggleDeliveryAlt(pickup_in_store){
            if(pickup_in_store){
                vm.pickup_in_store = false;
                Delivery.toggleDelivery(pickup_in_store);
            } else {
                Delivery.toggleDelivery(pickup_in_store);
            }
        }

        function toggleExport(){
            if(vm.country_selected!=''){
                vm.calculateExportShipping(vm.country_selected);
            }
        }

        function setPaymentMethod(){
            vm.syncCustomerAddress();
            if(Delivery.customer.full_name!=''){
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
            } else {
                swal('Atención','Haga click en volver y verifique sus datos de envío.','warning');
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
            vm.loader = true;
            vm.temp = Checkout.temp;
            vm.discount_code = Checkout.discount_code;
            
            if(!vm.card.exp_month){
                vm.card.exp_month = vm.card.expiry.substring(0, 2);
                if(vm.card.expiry.length > 7){
                  vm.card.exp_year = vm.card.expiry.substring(7, 9);
                } else {
                  vm.card.exp_year = vm.card.expiry.substring(5, 7);
                }
            }

            vm.card.expiry = vm.card.exp_month + vm.card.exp_year;
            
            if(vm.temp.purchase.order_id != 0 && vm.temp.purchase.order_id != null){
                
                vm.temp.timestamp = Math.round((new Date()).getTime() / 1000);
                var total = (ngCart.totalCost() - vm.discount_code.amount).toFixed(2);
                vm.temp.prehash = vm.temp.purchase.order_id + "|" + total + "|" + vm.temp.timestamp + "|" + APP_INFO.bac.applicationPassword;
                vm.temp.hash = md5.createHash(vm.temp.prehash);
                
                Mail.bacPurchaseParameterLog(vm.temp,vm.total,vm.address, vm.card.exp_month, vm.card.exp_year).then(function (response) { console.log("API call logged")} );

                setTimeout(function(){
                    document.getElementById("CredomaticPost").submit();
                    }, 2000);
            } else {
                vm.loader = false;
                vm.error_message = "Hubo un error al crear su orden, por favor haga click en volver, refresque la página y vuelva a intentarlo.";
            }

            
        }

        function submitPaypal(){
            document.getElementById("PaypalPost").submit();
        }

        function payWithFtTechnologies(){
            
            vm.temp = Checkout.temp;
            
            var args = {
                applicationName:APP_INFO.gateway.applicationName,
                applicationPassword:APP_INFO.gateway.applicationPassword,
                chargeDescription: vm.temp.purchase.order_number,
                transactionCurrency: vm.store.currency,
                transactionAmount: vm.total,
                primaryAccountNumber: vm.card.number,
                expirationMonth: vm.card.exp_month,
                expirationYear: vm.card.exp_year,
                verificationValue: vm.card.cvc
            };

            Mail.ftPurchaseParameterLog(args).then(function (response) { console.log("Call logged")} );

            Checkout.chargeCardUsingFtTechnologies(args).then(function (response) {
                //Send parameter log
                
            },function(err){ Mail.errorLog(err) });

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
