(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Order', Order);
        Order.$inject = ['$http','$localStorage','ngCart'];
        function Order($http,$localStorage,ngCart){

          var create = function (currency, paymentMethod) {

            var deliveryType = "";
            var deliveryMethod = "";
            
            if($localStorage.deliveryType){ deliveryType = $localStorage.deliveryType; } else { deliveryType = "storepickup" };
            if($localStorage.deliveryMethod){ deliveryMethod = $localStorage.deliveryMethod; } else { deliveryMethod = "Recoger en Tienda" };

            var request = {
              customerId: $localStorage.customerId,
              paymentMethod: paymentMethod,
              createdBy: "website",
              currency: currency,
              deliveryCost: ngCart.getShipping(),
              subtotal: ngCart.getSubTotal(),
              discount: "",
              tax: ngCart.getTax(),
              total: ngCart.totalCost(),
              customerMessage: $localStorage.orderNote,
              couponUsed: "",
              couponName: "",
              couponDiscount: "",
              deliveryType: deliveryType,
              deliveryMethod: deliveryMethod,
              items: ngCart.getCustomItems()
            }

            if($localStorage.discount){
              var discount = $localStorage.discount;
              if(discount.value!=0&&discount.total){
                request.couponUsed = true;
                request.couponName = discount.name;
                request.couponDiscount = discount.value;
                request.discount = discount.total;
                request.total = request.total - discount.total;
              }
            }
              return $http.post("https://api2.madebyblume.com/v3/storeFront/order/create",request).then(function (results) {
                  return results.data.data;
              },function(err){ });
          }

            return {
              create: create
            }
        }
})();
