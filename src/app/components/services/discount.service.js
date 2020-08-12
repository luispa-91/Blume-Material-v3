(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Discount', Discount);

        Discount.$inject = ['$http','$localStorage','ngCart','$rootScope'];
        function Discount($http,$localStorage,ngCart,$rootScope){

            var verify = function (discount) {
                var request = {
                    code: discount.code,
                    items: ngCart.getCustomItems()
                }
                //Verify discount
                return $http.post("https://api2.madebyblume.com/v3/discounts/verify",request).then(function (results) {
                    var discount = results.data.data;
                    //If it applies to delivery, calculate the actual amount
                    if(discount.applyTo=="delivery"){
                        var multiplier = discount.value / 100;
                        discount.value = multiplier * ngCart.getShipping();
                    }
                    $localStorage.discount = discount;
                    return discount;
                });
            }

            var broadcastDiscountUpdate = function(scope, callback) {
                var handler = $rootScope.$on('discountUpdate', callback);
                scope.$on('$destroy', handler);
            }

            var reset = function() {
                delete $localStorage.discount;
            }

        return {
            verify:verify,
            broadcastDiscountUpdate: broadcastDiscountUpdate,
            reset:reset
        }
    }

})();
