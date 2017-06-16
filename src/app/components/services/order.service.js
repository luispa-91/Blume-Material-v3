(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Order', Order);

    Order.$inject = ['$http', 'ngCart','APP_INFO', '$localStorage'];
        function Order($http, ngCart,APP_INFO, $localStorage){

          var createDeliveryOrder = function(customer_id, total){

            var currency = $localStorage.storeData.currency;
            var created_by = "";
            if(currency == 'USD'){
              created_by = "Website"
            } else {
              created_by = "Website" + currency;
            }

            return $http({
                  method: "POST",
                  url: "https://central-api.madebyblume.com/v1/website/order/deliver",
                  data: {
                      company_id: APP_INFO.ID,
                      customer_id: customer_id,
                      subtotal: ngCart.getSubTotal(),
                      discount: $localStorage.discount,
                      shipping: ngCart.getShipping(),
                      tax: ngCart.getTax(),
                      total: total,
                      created_by: created_by,
                      items: ngCart.getCustomItems()
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          };

          var createDeliveryPayPal = function(customer_id){

            return $http({
                  method: "POST",
                  url: "https://central-api.madebyblume.com/v1/website/paypal/deliver",
                  data: {
                      company_id: APP_INFO.ID,
                      customer_id: customer_id,
                      subtotal: ngCart.getSubTotal(),
                      discount: $localStorage.discount,
                      shipping: ngCart.getShipping(),
                      tax: ngCart.getTax(),
                      total: ngCart.totalCost(),
                      items: ngCart.getCustomItems()
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          };

          var createPickupOrder = function(customer_id, total){

            var currency = $localStorage.storeData.currency;
            var created_by = "";
            if(currency == 'USD'){
              created_by = "Website"
            } else {
              created_by = "Website" + currency;
            }

              return $http({
                  method: "POST",
                  url: "https://central-api.madebyblume.com/v1/website/order/pickup",
                  data: {
                      company_id: APP_INFO.ID,
                      customer_id: customer_id,
                      subtotal: ngCart.getSubTotal(),
                      discount: $localStorage.discount,
                      shipping: ngCart.getShipping(),
                      tax: ngCart.getTax(),
                      total: total,
                      created_by: created_by,
                      items: ngCart.getCustomItems()
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var createPickupPayPal = function(customer_id){

              return $http({
                  method: "POST",
                  url: "https://central-api.madebyblume.com/v1/website/paypal/pickup",
                  data: {
                      company_id: APP_INFO.ID,
                      customer_id: customer_id,
                      subtotal: ngCart.getSubTotal(),
                      discount: $localStorage.discount,
                      shipping: ngCart.getShipping(),
                      tax: ngCart.getTax(),
                      total: ngCart.totalCost(),
                      items: ngCart.getCustomItems()
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

            var _mailReceipt = function (order_id) {
     
                return $http.post('https://central-api.madebyblume.com/v1/mail/order?order_id=' + order_id).then(function (results) {
                    return results;
                });
            };

            var _mailReceiptWithTracking = function (order_id) {
     
                return $http.post('https://central-api.madebyblume.com/v1/mail/order/delivery?order_id=' + order_id).then(function (results) {
                    return results;
                });
            };

            var _createShippingInvoice = function (order) {
     
                return $http.post('https://central-api.madebyblume.com/v1/website/shipping/gopato?order_id=' + order.order_id + '&shipment_id=' + order.shipment_id).then(function (results) {
                    return results;
                });
            };

            var _saveAsPaid = function (order_id) {

                return $http.post('https://central-api.madebyblume.com/v1/orders/pay?order_id=' + order_id).then(function (results) {
                    return results;
                });
            };

            var _applyDiscount = function (promoCode) {

                return $http.get('https://central-api.madebyblume.com/v1/company/find/promocode?word=' + promoCode + '&company_id=' + APP_INFO.ID).then(function (results) {
                    return results;
                });
            };

            return {
                createDeliveryOrder: createDeliveryOrder,
                createPickupOrder: createPickupOrder,
                mailReceipt: _mailReceipt,
                mailReceiptWithTracking: _mailReceiptWithTracking,
                createShippingInvoice: _createShippingInvoice,
                applyDiscount: _applyDiscount,
                saveAsPaid: _saveAsPaid
            }

        }

})();
