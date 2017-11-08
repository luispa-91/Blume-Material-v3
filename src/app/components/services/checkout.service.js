(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Checkout', Checkout);
        Checkout.$inject = ['$http', 'ngCart', '$state', 'Delivery', '$mdDialog', '$rootScope', 'APP_INFO', '$timeout', 'md5'];
        function Checkout($http, ngCart, $state, Delivery, $mdDialog, $rootScope, APP_INFO, $timeout, md5){

          var settings = {};
          var getSettings = Delivery.getSettings;
          getSettings().then(function(results){
                settings = results;
            })
          var customer = Delivery.customer;
          var address = Delivery.address;
          var billing_address = Delivery.billing_address;
          var billing_information = Delivery.billing_information;
          var customer_address = Delivery.customer_address;

          var discount_code = {
            valid: false,
            value: '',
            amount: 0
          }

          var card = {
            number: '',
            name: '',
            expiry: '',
            cvc: ''
          }

          var card_options = {
            debug: false,
            formatting: true,
            container: 'card-container'
          }

          var two_co = {
            seller_id: '',
            publishable_key: ''
          }

          var temp = {
            customer_id: 0,
            purchase: {
              order_id: 0,
              shipment_id: 0
            },
            token: '',
            progress: 1,
            loading: false,
            error_message: '',
            prehash: '',
            hash: '',
            timestamp: ''
          }

          var order = {
            company_id: APP_INFO.ID,
            customer_id: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            created_by: '',
            payment_method: '',
            items: []
          }

          var checkStock = function () {

            if(discount_code.valid){
                discount_code.valid = false;
                discount_code.value = '';
                discount_code.amount = 0;
            }

            var outOfStockVariants = 0;
            var cartItems = ngCart.$cart.items;

            for (var i = cartItems.length - 1; i >= 0; i--) {
                if(cartItems[i]._quantity > cartItems[i]._data.stock){
                    outOfStockVariants += 1;
                }
            }
            if(outOfStockVariants > 0){
                if(outOfStockVariants == 1){
                    swal('Atención','Un producto en su carrito no está disponible, revise la cantidad o comuníquese con nosotros para más información','warning');
                } else {
                    swal('Atención','Algunos productos en su carrito no están disponibles, revise la cantidad o comuníquese con nosotros para más información','warning');
                }
            } else {
              //Recalculate delivery if address is already set
                if(Delivery.destination_coords.distance > 0){
                  $rootScope.$emit('notifying-service-event');
                }
                $state.go('checkout.address');
            }

          }

          //Data validation before submitting card information
          var verifyData = function(pickup_in_store, international_shipping){
             
             //Initialize variables
             var address_complete = false;
             var customer_complete = false;
             var billing_address_complete = false;
             Delivery.pickup_in_store = pickup_in_store;

            //Validate customer data
            if(Delivery.customer.full_name == ""){
              swal('Atención','Por favor ingrese su nombre','warning');
            } else if(Delivery.customer.email == ""){
              swal('Atención','Por favor ingrese su correo electrónico','warning');
            } else if(Delivery.customer.phone == ""){
              swal('Atención','Por favor ingrese su teléfono','warning');
            } else {
              customer_complete = true;
              //Verify delivery or billing address
              if(pickup_in_store){
                  if(Delivery.billing_address.country == ""){
                    swal('Atención','Por favor ingrese el país','warning');
                  } else if(Delivery.billing_address.state == ""){
                    swal('Atención','Por favor ingrese el estado / provincia','warning');
                  } else if(Delivery.billing_address.city == ""){
                    swal('Atención','Por favor ingrese la ciudad','warning');
                  } else if(Delivery.billing_address.address == ""){
                    swal('Atención','Por favor ingrese la dirección exacta','warning');
                  } else {
                    billing_address_complete = true;
                  }
              } else {
                if(Delivery.address.address2 == "" && !international_shipping){
                  swal('Atención','Por favor haga click en el mapa o ingrese un de referencia para la entrega.','warning');
                } else if(Delivery.address.note == "" && !international_shipping){
                  swal('Atención','Por favor ingrese la dirección exacta para la entrega.','warning');
                } else {
                  address_complete = true;
                }
              }
            }

            if(customer_complete && billing_address_complete || customer_complete && address_complete){
              createCustomer().then(function(results){
                  $timeout(function () { 
                      temp.timestamp = Math.round((new Date()).getTime() / 1000);
                      var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                      temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|jbYeT4VfN9QsP3X4vh3Kz5c9sv6q5yx9";
                      temp.hash = md5.createHash(temp.prehash);
                      // submitBAC();
                       }, 2000, true);
                  $rootScope.$emit('notifying-service-event');
                  $state.go('checkout.placeOrder');
              });
              
            }

          }

          var showPrompt = function (ev) {
              // Appending dialog to document.body to cover sidenav in docs app
              var confirm = $mdDialog.prompt()
                .title('Ingrese el cupón de descuento')
                .ariaLabel('Discount code input')
                .targetEvent(ev)
                .ok('Aceptar')
                .cancel('Cancelar');

              $mdDialog.show(confirm).then(function(result) {
                //If a discount code was typed, look for it and apply it
                discount_code.value = result;
                applyDiscount();
              }, function() {
                discount_code.valid = false;
              });
            };

          var verifyDiscount = function () {
                return $http.get('https://central-api.madebyblume.com/v1/company/promocode/apply?word=' + discount_code.value + '&order_id=' + temp.purchase.order_id).then(function (results) {
                    return results;
                });
            };

          var applyDiscount = function (){
            verifyDiscount().then(function (response) {
                var promo = response.data;
                var total = $rootScope.cart.totalCost();
                var shipping = $rootScope.cart.getShipping();
                var tax = $rootScope.cart.getTax();
                if(promo.id != 0){
                  if(promo.type == "Amount"){
                    if($rootScope.cart.totalCost() < promo.discount){
                      swal('No se puede activar el cupón','El monto de la compra es menor al descuento del cupón.','error');
                    }
                    discount_code.amount = promo.discount;
                    discount_code.valid = true;
                    temp.timestamp = Math.round((new Date()).getTime() / 1000);
                    var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|jbYeT4VfN9QsP3X4vh3Kz5c9sv6q5yx9";
                    temp.hash = md5.createHash(temp.prehash);
                  } 
                  if(promo.type == "Percentage"){
                    var pretotal = total - shipping - tax;
                    discount_code.amount = (promo.discount / 100) * pretotal;
                    discount_code.valid = true;
                    temp.timestamp = Math.round((new Date()).getTime() / 1000);
                    var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|jbYeT4VfN9QsP3X4vh3Kz5c9sv6q5yx9";
                    temp.hash = md5.createHash(temp.prehash);
                  }
                  if(promo.type == "Shipping"){
                    discount_code.amount = (promo.discount / 100) * shipping;
                    discount_code.valid = true;
                    temp.timestamp = Math.round((new Date()).getTime() / 1000);
                    var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|jbYeT4VfN9QsP3X4vh3Kz5c9sv6q5yx9";
                    temp.hash = md5.createHash(temp.prehash);
                  }
                }
                $rootScope.$emit('notifying-service-event');
            })
          }

          var getToken = function () {
            
                return $http.get('https://central-api.madebyblume.com/v1/payments/2co/key?company_id=' + APP_INFO.ID).then(function (results) {
                    two_co.seller_id = results.data.sellerID;
                    two_co.publishable_key = results.data.twoCOPublishableKey;
                });
            };

          var makePayment = function () {

            //Clear error message
            temp.error_message = '';

            //Start progress bar
            temp.loading = true;
            temp.progress = 15;

            //split expiry date
            card.exp_month = parseInt(card.expiry.substring(0, 2));
            if(card.expiry.length > 7){
              card.exp_year = parseInt('20' + card.expiry.substring(7, 9));
            } else {
              card.exp_year = parseInt('20' + card.expiry.substring(5, 7));
            }

            //Setup token request arguments

            var args = {
              sellerId: two_co.seller_id,
              publishableKey: two_co.publishable_key,
              ccNo: card.number,
              cvv: card.cvc,
              expMonth: card.exp_month,
              expYear: card.exp_year
            };
            // Make the token request
            TCO.requestToken(successCallback, errorCallback, args);

          }

          var successCallback = function(data){
            
            //Set token value
            temp.token = data.response.token.token;

            //Create customer and order, then charge card
            createCustomer();

          }

          var errorCallback = function(data){
            temp.loading = false;
            // Retry the token request if ajax call fails
            if (data.errorCode === 200) {
               // This error code indicates that the ajax call failed. We recommend that you retry the token request.
               swal('Error','Hubo en problema con su conexión, el pago no se pudo realizar. Por favor inténtelo de nuevo.','error');
               getToken();
            } else {
              swal('Error', 'Por favor ingrese los datos de la tarjeta o inténtelo de nuevo en otro buscador.','error');
            }
          }

          var createCustomer = function(){

            return $http.post('https://central-api.madebyblume.com/v1/website/customer', customer).then(function (results) {
                temp.customer_id = results.data;
                temp.progress = 33;
                //Build order with current cart information and store settings
                if(Delivery.pickup_in_store){
                  buildOrder();
                } else {
                  customer_address.id = temp.customer_id;
                  customer_address.note = address.note;
                  createCustomerAddress();
                }
            });
          }

          var createCustomerAddress = function(){
            return $http.post('https://central-api.madebyblume.com/v1/website/customer/address', customer_address).then(function (results) {
                      temp.progress = 33;
                      //Build order with current cart information and store settings
                      buildOrder();
                  });
          }

          var chargeCard = function (token, billingInfo) {
            
            return $http.post('https://central-api.madebyblume.com/v1/payments/2co/invoice?token=' + token, billingInfo).then(function (results) {
                //Verify if payment is approved
                if(results.data[0] == "A"){
                  temp.progress = 100;
                  //Verify if order is to be picked up at the store
                  if(Delivery.pickup_in_store){
                    sendConfirmationEmail();
                    updateStoreStock();
                  } else {
                    createShippingInvoice();
                    sendConfirmationEmailWithTracking();
                    updateStoreStock();
                  }
                } else {
                  temp.progress = 1;
                  temp.loading = false;
                  temp.error_message = results.data.Message;
                  getToken();
                }

            });
          };

          var createShippingInvoice = function(){
            return $http.post('https://central-api.madebyblume.com/v1/website/shipping/gopato?order_id=' + temp.purchase.order_id + '&shipment_id=' + temp.purchase.shipment_id).then(function (results) {
                    return results;
                });
          }

          var sendConfirmationEmail = function(){
            return $http.post('https://central-api.madebyblume.com/v1/mail/order?order_id=' + temp.purchase.order_id).then(function (results) {
                    discount_code = {
                      valid: false,
                      value: '',
                      amount: 0
                    };
                    ngCart.empty();
                    $state.go('checkout.confirmed');
                });
          }

          var sendConfirmationEmailWithTracking = function(){
            return $http.post('https://central-api.madebyblume.com/v1/mail/order/delivery?order_id=' + temp.purchase.order_id).then(function (results) {
                    discount_code = {
                      valid: false,
                      value: '',
                      amount: 0
                    };
                    ngCart.empty();
                    $state.go('checkout.confirmed');
                });
          }

          var buildOrder = function(){

            temp.progress = 66;
            //Verify if customer was created
            if(temp.customer_id == 0){
              swal('Aviso','Por favor presione el botón de revisar datos y verifique que sean correctos.', 'info');
            } else {
              //Set created by
              var created_by = '';
              if(settings.currency == "CRC"){
                created_by = 'WebsiteCRC'
              } else {
                created_by = 'Website'
              }

              //Sync order data with cart data
              order.customer_id = temp.customer_id;
              order.subtotal = ngCart.getSubTotal();
              order.tax = ngCart.getTax();
              order.shipping = ngCart.getShipping();
              order.discount = discount_code.amount;
              order.total = ngCart.totalCost() - order.discount;
              order.created_by = created_by;
              order.items = ngCart.getCustomItems();
              //If order is to be picked up at the store
              if(Delivery.pickup_in_store){
                createOrder();
              } else {
                createOrderWithDelivery();
              }
            }
          }

          var buildBillingInformation = function(){
            temp.progress = 85
            //Verify if order needs delivery
            if(Delivery.pickup_in_store){
              billing_information.address = billing_address.address;
              billing_information.city = billing_address.city;
              billing_information.zipCode = billing_address.zip_code;
              billing_information.state = billing_address.state;
              billing_information.country = billing_address.country;
              billing_information.name = customer.full_name;
              billing_information.email = customer.email;
              billing_information.phoneNumber = customer.phone;
              billing_information.total = Math.round((order.total + 0.00001) * 100) / 100;
              billing_information.order_id = temp.purchase.order_id;
              billing_information.currency = settings.currency;
            } else {
              billing_information.name = customer.full_name;
              billing_information.email = customer.email;
              billing_information.phoneNumber = customer.phone;
              billing_information.total = Math.round((order.total + 0.00001) * 100) / 100;
              billing_information.order_id = temp.purchase.order_id;
              billing_information.currency = settings.currency;
            }
            //Charge card
            chargeCard(temp.token, billing_information);
          }

          var createOrder = function(){
            return $http.post('https://central-api.madebyblume.com/v1/website/order/pickup', order).then(function (results) {
                  temp.purchase = results.data;
                  //Build billing information
                  if(order.payment_method == 'Credit Card'){
                    buildBillingInformation();
                  }
              });
          }

          var createOrderWithDelivery = function(){
            return $http.post('https://central-api.madebyblume.com/v1/website/order/deliver?courier=' + Delivery.destination_coords.delivery_type , order).then(function (results) {
                  temp.purchase = results.data;
                  //Build billing information
                  if(order.payment_method == 'Credit Card'){
                    buildBillingInformation();
                  }
              });
          }

          var updateStoreStock = function(order_id){
            return $http.post('https://central-api.madebyblume.com/v1/orders/stock-update?order_id=' + order_id).then(function (results) {
                return results;
              });
          }

            return {
              checkStock: checkStock,
              showPrompt: showPrompt,
              verifyData: verifyData,
              discount_code: discount_code,
              card: card,
              card_options: card_options,
              two_co: two_co,
              temp: temp,
              getToken: getToken,
              chargeCard: chargeCard,
              makePayment: makePayment,
              order: order,
              createCustomer: createCustomer,
              updateStoreStock: updateStoreStock
            }
        }
})();
