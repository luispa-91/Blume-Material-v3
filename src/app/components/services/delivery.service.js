(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Delivery', Delivery);
        Delivery.$inject = ['$http','ngCart','$localStorage','$rootScope'];
        function Delivery($http,ngCart,$localStorage,$rootScope){

            var availableMethods = function () {
              ngCart.setShipping(0);
                return $http.get("https://api2.madebyblume.com/v3/storeFront/deliveryMethods").then(function (results) {
                    return results.data.data;
                });
            }

            var createAddress = function (deliveryAddress,orderNote) {
              $localStorage.orderNote = orderNote;
              if($localStorage.customerId){ deliveryAddress.customerId = $localStorage.customerId; } else { return null };
              return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/address/create",deliveryAddress).then(function (results) {
                  return results.data.data;
              });
          }

            var getDeliveryCost = function(method) {
              $localStorage.deliveryType = method.deliveryType;
              $localStorage.deliveryMethod = method.name;
              //Evaluate delivery method to calculate cost
              var deliveryCost = 0;
              //--------- Pricing Types ---------//
              // Flat 
              if(method.pricingType=='flat'){
                  deliveryCost = method.basePrice;
                  ngCart.setShipping(deliveryCost);
                  $rootScope.$emit('discountUpdate');
                  return deliveryCost;
              }
              //Distance
              else if(method.pricingType=='weight'){
                //Get package weight
                var weight = ngCart.getTotalWeight();
                //Evaluate weight
                if(weight > method.baseUnit){
                  var additionalWeight = weight - method.baseUnit;
                  deliveryCost = method.basePrice + ((additionalWeight / method.additionalUnit) * method.additionalPrice);
                } else {
                  deliveryCost = method.basePrice;
                }
                ngCart.setShipping(deliveryCost);
                $rootScope.$emit('discountUpdate');
                return deliveryCost;
              }
            }

            var getInternationalDeliveryCost = function(country,currencyValue){
              $localStorage.deliveryType = "international";
              $localStorage.deliveryMethod = "CCR";
              if(!country){
                ngCart.setShipping(0);
              } else {
                var weight = ngCart.getTotalWeight();
                return $http.get("https://api2.madebyblume.com/v3/storeFront/deliveryFare/CCR?country=" + country + "&weight="+ weight +"&currency=" + currencyValue).then(function (results) {
                    ngCart.setShipping(results.data);
                });
              }
            }

            var reset = function(selectedMethod,selectedFare,methods){
              if(selectedMethod=='national'){
                var method = {};
                for (var i = 0; i < methods.length; i++) { if(methods[i].id == selectedFare){ method = methods[i]; }}
                getDeliveryCost(method);
              } else if(selectedMethod=='storepickup') {
                $localStorage.deliveryType = "storepickup";
                $localStorage.deliveryMethod = "Recoger en tienda";
                ngCart.setShipping(0);
                $rootScope.$emit('discountUpdate');
              } 
            }

            var restart = function(){
              delete $localStorage.deliveryType;
              delete $localStorage.deliveryMethod;
              delete $localStorage.orderNote;
            }
            
            return {
              availableMethods: availableMethods,
              createAddress: createAddress,
              getDeliveryCost: getDeliveryCost,
              getInternationalDeliveryCost: getInternationalDeliveryCost,
              reset: reset,
              restart: restart
            }
        }
})();
