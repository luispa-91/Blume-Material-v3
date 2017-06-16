(function() {
    'use strict';
    angular
        .module('angular')
        .controller('Co2Controller', TwoCheckoutController);

    TwoCheckoutController.$inject = ['$scope', '$rootScope', 'Customer', '$localStorage','TwoCheckoutService','ngCart','Order','$state', 'Catalog', 'APP_INFO'];
    function TwoCheckoutController($scope, $rootScope, Customer, $localStorage,TwoCheckoutService,ngCart,Order,$state, Catalog, APP_INFO) {

      $scope.proceedToCheckout = proceedToCheckout;
      //$scope.loadOrderInfo = loadOrderInfo;
      $scope.validateCard = validateCard;
      $scope.btnPay = true;
      $scope.loader = false;
      TCO.loadPubKey('production');
        init();

        function init(){
        $scope.message = null;
            $rootScope.shipping = {};
        $scope.card = {};

        if($localStorage.discount){

          if($localStorage.discount > $rootScope.cart.totalCost()){
            $localStorage.discount = 0;
          }
          $scope.discount = $localStorage.discount;
        } else {
          $scope.discount = 0;
        }

        $scope.cardOptions = {
          debug: false,
          formatting: true,
          container: 'card-container'
        };

        Catalog.setStoreData(APP_INFO.ID)
          .then(function (response) {
            
          });

        TwoCheckoutService.getToken()
          .success(function(data){
            $scope.TwoCO_public = data;
            if(data.sellerID == null || data.twoCOPublishableKey == null){
              swal('Atención','La tienda no está lista para recibir pagos, cualquier compra será rechazada.','warning');
            }
          });
        }

        function validateCard(){

          if($scope.card.expiry.length > 7){
            swal('Atención','El año de la tarjeta solo debe contener los dos últimos numeros.','warning');
            $scope.btnPay = true;
            $scope.loader = false;
            console.log($scope.card.expiry.length);

          } else {
            proceedToCheckout();
          }
        }

        function proceedToCheckout(){
            var card = $scope.card;

            //split expiry date
            card.exp_month = parseInt(card.expiry.substring(0, 2));
            card.exp_year = parseInt('20' + card.expiry.substring(5, 7));

            // Setup token request arguments
            $scope.btnPay = false;
            $scope.disabled = true;
            $scope.loader = true;
            var args = {
              sellerId: $scope.TwoCO_public.sellerID,
              publishableKey: $scope.TwoCO_public.twoCOPublishableKey,
              ccNo: card.number,
              cvv: card.cvc,
              expMonth: card.exp_month,
              expYear: card.exp_year
            };

            // Make the token request
            TCO.requestToken(successCallback, errorCallback, args);

        }

        function successCallback(data){
        //$scope.order = $localStorage.order;
          var storePickup = $localStorage.storePickup;
          var currency = $localStorage.storeData.currency;

          var total = 0;

          if($localStorage.discount){
            total = $rootScope.cart.totalCost() - $localStorage.discount;
          } else {
            total = $rootScope.cart.totalCost();
          }
          
          if(!storePickup){

            //Create delivery order
            Order.createDeliveryOrder($localStorage.customer, total).then(function (response) {
              $localStorage.order = response.data;
              var billingInfo = {
                  address: $localStorage.globalAddress.address,
                  city: $localStorage.globalAddress.city,
                  zipCode: $localStorage.globalAddress.zip_code,
                  state: $localStorage.globalAddress.state,
                  country: $localStorage.globalAddress.country,
                  name: $scope.card.name,
                  email: $localStorage.globalCustomer.email,
                  phoneNumber: $localStorage.globalCustomer.phone,
                  total: total,
                  order_id: $localStorage.order.order_id
              };

              billingInfo.currency = currency;

              TwoCheckoutService.createPayment(data.response.token.token, billingInfo).then(function (results) {

                if(results.data[0] == "A"){

                  //If payment for delivery order is approved, create shipping invoice and mail it to store owner
                  Order.createShippingInvoice($localStorage.order).then(function (response) {
                          
                      })
                  Order.mailReceiptWithTracking(response.data.order_id).then(function (response) {
                      $state.go('checkout.confirmed');
                          ngCart.empty();
                          $localStorage.discount = 0;
                          $scope.discount = 0;
                  })

                } else {
                  
                  swal('El pago no fue autorizado','Por favor verifique que la información sea correcta o intente realizar la compra en otro buscador.','error');
                  $scope.btnPay = true;
                  $scope.loader = false;

                }
                
              }, function (error) {
                $scope.btnPay = true;
                $scope.loader = false;
              });
          },  function (error) {
              swal('Atención','Hubo en error con la compra, por favor refresque la página e inténtelo de nuevo, o intente realizar la compra en otro buscador.','warning');
                $scope.btnPay = true;
                $scope.loader = false;
              });
          }
          else{
            console.log(total);
            //Create pick-up order
            Order.createPickupOrder($localStorage.customer, total).then(function (response) {
              $localStorage.order = response.data;
              var billingInfo = {
                  address: $localStorage.globalAddress.address,
                  city: $localStorage.globalAddress.city,
                  zipCode: $localStorage.globalAddress.zip_code,
                  state: $localStorage.globalAddress.state,
                  country: $localStorage.globalAddress.country,
                  name: $scope.card.name,
                  email: $localStorage.globalCustomer.email,
                  phoneNumber: $localStorage.globalCustomer.phone,
                  total: total,
                  order_id: $localStorage.order.order_id
              };

              billingInfo.currency = currency;


              TwoCheckoutService.createPayment(data.response.token.token, billingInfo).then(function (results) {

                if(results.data[0] == "A"){
                  
                  //If payment for pickup order is approved, create shipping invoice and mail it to store owner
                  Order.mailReceipt(response.data.order_id).then(function (response) {
                                $state.go('checkout.confirmed');
                                ngCart.empty();
                                $localStorage.discount = 0;
                                $scope.discount = 0;
                            })

                }else {
                  
                  swal('El pago no fue autorizado','Por favor verifique que la información sea correcta o intente realizar la compra en otro buscador.','error');
                  $scope.btnPay = true;
                  $scope.loader = false;

                }
                
              }, function (error) {
                $scope.btnPay = true;
                $scope.loader = false;
              });
          },  function (error) {

            console.log(error);
              swal('Atención','Hubo en error con la compra, por favor refresque la página e inténtelo de nuevo, o intente realizar la compra en otro buscador.','warning');
                $scope.btnPay = true;
                $scope.loader = false;
              });
          }
        }

        var errorCallback = function(data) {
          // Retry the token request if ajax call fails
          if (data.errorCode === 200) {

             // This error code indicates that the ajax call failed. We recommend that you retry the token request.
             swal('Connection Error',data.errorMsg,'error');
              $scope.btnPay = true;
              $scope.loader = false;

          } else {
            
            swal('Error',data.errorMsg,'error');
            $scope.btnPay = true;
            $scope.loader = false;
            
          }
        };

    }
})();
