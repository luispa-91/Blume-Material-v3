(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Discount', Discount);

        Discount.$inject = ['$http','$localStorage','ngCart','$rootScope'];
        function Discount($http,$localStorage,ngCart,$rootScope){

            var calculateDiscount = function(){
                var discount = { value: 0 };
                //Verify if discount has been applied
                if($localStorage.discount){
                    discount = $localStorage.discount;
                    //Verify discount type
                    if(discount.type=="percent"){
                        //Define total amount of discount based on current cart
                        var multiplier = discount.value / 100;
                        //Apply discount to
                        if(discount.applyTo=="subtotal"){
                            discount.total = multiplier * ngCart.getSubTotal();
                        } else if (discount.applyTo=="delivery") {
                            discount.total = multiplier * ngCart.getShipping();
                        }
                    }
                } else {
                    discount = { code: '', value: 0 };
                }
                $localStorage.discount = discount;
                return discount;
            }

            var verify = function (code) {
                var request = {
                    code: code
                }
                //Verify discount
                return $http.post("https://api2.madebyblume.com/v3/storeFront/discounts/verify",request).then(function (results) {
                    $localStorage.discount = results.data.data;
                    calculateDiscount();
                    return results.data.data;
                });
            }

            var broadcastDiscountUpdate = function(scope, callback) {
                var handler = $rootScope.$on('discountUpdate', callback);
                scope.$on('$destroy', handler);
            }

        return {
            calculateDiscount: calculateDiscount,
            verify:verify,
            broadcastDiscountUpdate: broadcastDiscountUpdate
        }
    }

})();
