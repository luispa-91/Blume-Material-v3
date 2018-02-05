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

          var card_options_2 = {
            debug: false,
            formatting: true,
            container: 'card-container-2'
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
            } else if(Delivery.destination_coords.delivery_type == 'express' && Delivery.destination_coords.selected_fare == 0){
              swal('Atención','Debe escoger un tipo de transporte','warning');
            } else {

              customer_complete = true;
              //Verify delivery or billing address
              if(pickup_in_store){
                  billing_address_complete = true;
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
                      temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|" + APP_INFO.bac.applicationPassword;
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
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|" + APP_INFO.bac.applicationPassword;
                    temp.hash = md5.createHash(temp.prehash);
                  } 
                  if(promo.type == "Percentage"){
                    var pretotal = total - shipping - tax;
                    discount_code.amount = (pretotal * (promo.discount / 100)) - promo.exclude_discount;
                    discount_code.valid = true;
                    temp.timestamp = Math.round((new Date()).getTime() / 1000);
                    var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|" + APP_INFO.bac.applicationPassword;
                    temp.hash = md5.createHash(temp.prehash);
                  }
                  if(promo.type == "Shipping"){
                    discount_code.amount = (promo.discount / 100) * shipping;
                    discount_code.valid = true;
                    temp.timestamp = Math.round((new Date()).getTime() / 1000);
                    var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
                    temp.prehash = temp.purchase.order_id + "|" + total + "|" + temp.timestamp + "|" + APP_INFO.bac.applicationPassword;
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
            buildBillingInformation();

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
                customer_address.id = temp.customer_id;
                customer_address.note = address.note;
                createCustomerAddress();
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
                    updateStoreStock(billingInfo.order_id);
                  } else {
                    createShippingInvoice();
                    sendConfirmationEmailWithTracking();
                    updateStoreStock(billingInfo.order_id);
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

            var temp_total = ngCart.totalCost() - discount_code.amount;
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
              billing_information.total = Math.round((temp_total + 0.00001) * 100) / 100;
              billing_information.order_id = temp.purchase.order_id;
              billing_information.currency = settings.currency;
            } else {
              billing_information.name = customer.full_name;
              billing_information.email = customer.email;
              billing_information.phoneNumber = customer.phone;
              billing_information.total = Math.round((temp_total + 0.00001) * 100) / 100;
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
            return $http.post('https://central-api.madebyblume.com/v1/website/order/express?fare_id=' + Delivery.destination_coords.selected_fare, order).then(function (results) {
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

          var addOrderNote = function(order_id, hasRefId, refId, comments){
            var temp = {
              order_id: order_id,
              comments: comments,
              paidTime: '',
              transactionRefId: ''
            }
            if(hasRefId){
              temp.transactionRefId = refId;
            }
            return $http.post('https://central-api.madebyblume.com/v1/orders/addNote', temp).then(function (results) {
                return results;
              });
          }

          var chargeCardUsingFtTechnologies = function(billingInfo){
            //Start progress bar
            temp.loading = true;
            temp.progress = 33;
            var paymentURL = APP_INFO.gateway.url + '/api/AppApplyDirectCharge';
            return $http.post(paymentURL, billingInfo).then(function (results) {
              console.log(results.data);
                    if(results.data.isApproved){
                        temp.progress = 100;
                      //Verify if order is to be picked up at the store
                      if(Delivery.pickup_in_store){
                        sendConfirmationEmail();
                        updateStoreStock(temp.purchase.order_id);
                        saveAsPaid(temp.purchase.order_id);
                        addOrderNote(temp.purchase.order_id,true,results.data.retrievalRefNo,billing_address.address);
                      } else {
                        createShippingInvoice();
                        sendConfirmationEmailWithTracking();
                        updateStoreStock(temp.purchase.order_id);
                        saveAsPaid(temp.purchase.order_id);
                        addOrderNote(temp.purchase.order_id,true,results.data.retrievalRefNo,address.note);
                      }
                    } else {
                      temp.progress = 1;
                      temp.loading = false;
                      temp.error_message = "No se pudo realizar el pago, por favor contactenos a través del chat para ayudarle con su compra.";
                      saveAsDraft(temp.purchase.order_id);
                      addOrderNote(temp.purchase.order_id,true,results.data.reasonText,address.note);
                    }
                }, function(error){
                  temp.loading = false;
                  temp.progress = 0;
                  temp.error_message = "Hubo un error de conexión, por favor contáctenos para ayudarle a realizar su compra.";
                  saveAsDraft(temp.purchase.order_id);
                  addOrderNote(temp.purchase.order_id,true,'Error de conexión, contactar cliente',address.note);
                });
          }

          var saveAsPaid = function (order_id) {

              return $http.post('https://central-api.madebyblume.com/v1/orders/pay?order_id=' + order_id).then(function (results) {
                  $state.go('checkout.confirmed');
              });
          };

          var saveAsDraft = function (order_id) {

              return $http.post('https://central-api.madebyblume.com/v1/orders/save-draft?order_id=' + order_id).then(function (results) {
                  
              });
          };

          var errorDebugBAC = function (order_id) {

              var total = (ngCart.totalCost() - discount_code.amount).toFixed(2);
              var message = "";
              message += "Hash: " + temp.hash + "\n";
              message += "Timestamp: " + temp.timestamp + "\n";
              message += "Amount: " +  total + "\n";
              message += "Type: sale \n";
              message += "OrderId: " +  order_id + "\n";
              message += "Key_id: " +  APP_INFO.bac.key_id + "\n";
              message += "Processor_id: " + APP_INFO.bac.processor_id + "\n";
              message += "Address: " + address.state + "\n";
              message += "WebsiteURL: " + APP_INFO.website_url + "/checkout/confirmed \n";

              return $http.post('https://central-api.madebyblume.com/v1/mail/contact?company_name=Blume&company_email=durenap@baccredomatic.cr&customer_name=BACForm&customer_email=info@madebyblume.com&message=' + message).then(function (results) {
                  
              });
          };

            return {
              checkStock: checkStock,
              showPrompt: showPrompt,
              verifyData: verifyData,
              discount_code: discount_code,
              card: card,
              card_options: card_options,
              card_options_2: card_options_2,
              two_co: two_co,
              temp: temp,
              getToken: getToken,
              chargeCard: chargeCard,
              makePayment: makePayment,
              order: order,
              createCustomer: createCustomer,
              updateStoreStock: updateStoreStock,
              chargeCardUsingFtTechnologies: chargeCardUsingFtTechnologies,
              addOrderNote: addOrderNote,
              errorDebugBAC: errorDebugBAC
            }
        }
})();
