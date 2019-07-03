(function(){
'use strict';
    angular
    .module('angular')
    .factory('Cart', Cart);
    Cart.$inject = ['ngCart','$http','$rootScope'];
    function Cart(ngCart,$http,$rootScope){

        var verifyStock = function(){
            var cartItems = ngCart.$cart.items;
            for (var i = 0;  i < cartItems.length; i++) {
                requestProductVariantStock(cartItems[i]._id,i).then(function (results){ 
                    var tempItem = results;
                    if(tempItem.stock == 0){
                        ngCart.removeItemById(tempItem.externalId);
                    } else {
                        if(tempItem.discountPrice>0){
                            ngCart.$cart.items[tempItem.iterator]._price = tempItem.discountPrice;
                        } else {
                            ngCart.$cart.items[tempItem.iterator]._price = tempItem.price;
                        }
                    }
                    if(cartItems[i]._quantity > cartItems[i]._data.stock){
                        outOfStockVariants += 1;
                    }
                    });
            }
            $rootScope.$emit('discountUpdate');
        }

        var requestProductVariantStock = function(externalId, iterator){
            var request = {
                externalId: externalId,
                iterator: iterator
            }
            return $http.post('https://api2.madebyblume.com/v3/storeFront/verifyStock',request).then(function (results) {
                return results.data;
            },function (err){ Mail.errorLog(err) });
        }

        return {
            verifyStock:verifyStock
        }
    }
  })();
  