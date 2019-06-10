(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Delivery', Delivery);
        Delivery.$inject = ['$http','ngCart'];
        function Delivery($http,ngCart){

            var availableMethods = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/deliveryMethods").then(function (results) {
                    return results.data.data;
                });
            }

            var getDeliveryCost = function(method) {
              //Evaluate delivery method to calculate cost
              var deliveryCost = 0;
              //--------- Pricing Types ---------//
              // Flat 
              if(method.pricingType=='flat'){
                  deliveryCost = method.basePrice;
                  ngCart.setShipping(deliveryCost);
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
                return deliveryCost;
              }
            }

            var reset = function(){
              ngCart.setShipping(0);
            }
            
            return {
              availableMethods: availableMethods,
              getDeliveryCost: getDeliveryCost,
              reset: reset
            }
        }
})();
