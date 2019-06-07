(function(){
'use strict';
    angular
    .module('angular')
    .factory('Cart', Cart);
    Cart.$inject = [];
    function Cart(){

        var verifyStock = function(){
            var cartItems = ngCart.$cart.items;
            for (var i = 0;  i < cartItems.length; i++) {
                requestProductVariantStock(cartItems[i]._id,i).then(function (results){ 
                    var tempItem = results;
                    if(tempItem.stock == 0){
                        ngCart.removeItemById(tempItem.id);
                    } else {
                        ngCart.$cart.items[tempItem.iterator]._price = tempItem.price * ((100 - tempItem.sale_percentage) / 100);
                    }
                    if(cartItems[i]._quantity > cartItems[i]._data.stock){
                        outOfStockVariants += 1;
                    }
                    });
            }
        }

        var requestProductVariantStock = function(productVariantId, iterator){
            return $http.get('https://blumewebsitefunctions.azurewebsites.net/api/WebsiteRequestProductVariantStock?code=Y3IElQAmnPgSz0DCzTWUYkDflK6EQRkyMMavCbBOog1Ztxg51I9fuA==&productVariantId=' + productVariantId + '&iterator=' + iterator).then(function (results) {    
                return results.data;
            },function (err){ Mail.errorLog(err) });
        }

        return {
            verifyStock:verifyStock
        }
    }
  })();
  