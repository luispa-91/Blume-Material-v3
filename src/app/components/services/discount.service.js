(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Discount', Discount);

        Discount.$inject = ['$http','$localStorage','ngCart','$rootScope','Helper'];
        function Discount($http,$localStorage,ngCart,$rootScope,Helper){

            var calculateDiscount = function(){
                var discount = { value: 0 };

                //------- START SPECIAL RULE ----------//
                var site = Helper.currentSite();
                if(site=="rutaurbana.com"){
                    if(ngCart.getSubTotal()>10000){
                        discount = {
                            name: "Regla Especial",
                            applyTo: "delivery",
                            type: "percent",
                            value: 100,
                            code: "reglaespecial",
                            total: 0
                        };
                        $localStorage.discount = discount;
                    } else  {
                        discount = { code: '', name:'', value: 0 };
                        $localStorage.discount = { code: '', value: 0 };
                    }
                } 
                //------- END SPECIAL RULE ----------//

                //Verify if discount has been applied
                if($localStorage.discount){
                    console.log($localStorage.discount);
                    discount = $localStorage.discount;
                    discount.total = 0;
                    //Verify discount type
                    if(discount.type=="percent"){
                        //Define total amount of discount based on current cart
                        var multiplier = discount.value / 100;
                        //Apply discount to
                        if(discount.applyTo=="subtotal"){
                            var items = ngCart.getCart().items;
                            discount.total = 0;
                            console.log(items);
                            for (var i = 0; i < items.length; i++) {
                                if(items[i]._data.isDiscountPrice==0){
                                    discount.total += multiplier * (items[i]._price * items[i]._quantity);
                                }
                            } 
                        } else if (discount.applyTo=="delivery") {
                            discount.total = multiplier * ngCart.getShipping();
                        }
                    } else if(discount.type=="amount"){
                        if(discount.applyTo=="subtotal"){
                            var items = ngCart.getCart().items;
                            discount.total = 0;
                            for (var i = 0; i < items.length; i++) {
                                if(items[i]._data.isDiscountPrice==0){
                                    discount.total += (items[i]._price * items[i]._quantity);
                                }
                            }
                            if(discount.total > discount.value){ discount.total = discount.value; } 
                        } else if (discount.applyTo=="delivery") {
                            discount.total = discount.value;
                            if(discount.total > ngCart.getShipping()){ discount.total = ngCart.getShipping(); } 
                        }
                    }
                    else if(discount.type=="combo"){
                        discount.total = discount.value;
                    }
                } else {
                    discount = { code: '', value: 0, total: 0 };
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

            var verifyRules = function () {
                var request = {
                    items: ngCart.getCustomItems()
                }
                //Verify discount
                return $http.post("https://api2.madebyblume.com/v3/storeFront/discounts/verify/rule",request).then(function (results) {
                    if(results.data.data.value>0){
                        $localStorage.discount = results.data.data;
                        calculateDiscount();
                    }
                    return results.data.data;
                });
            }

            var broadcastDiscountUpdate = function(scope, callback) {
                var handler = $rootScope.$on('discountUpdate', callback);
                scope.$on('$destroy', handler);
            }

            var reset = function() {
                $localStorage.discount = { code: '', value: 0 };
            }

        return {
            calculateDiscount: calculateDiscount,
            verify:verify,
            verifyRules: verifyRules,
            broadcastDiscountUpdate: broadcastDiscountUpdate,
            reset:reset
        }
    }

})();
