(function() {
    'use strict';

    angular
        .module('angular')
        .factory('BlumeAnalytics', BlumeAnalytics);

        BlumeAnalytics.$inject = [];
        function BlumeAnalytics() {

            var fbPixelInit = function (pixelId){
                fbq('init', pixelId);
            }

            var fbPixelPageView = function (){
                fbq('track', 'PageView');
            };

            var fbPixelViewContent = function (product){
                //Build tags
                var productTags = fbPixelBuildProductMetaTags(product);
                //Track
                fbq('track', 'ViewContent', productTags);
            };

            var fbPixelBuildProductMetaTags = function(product){
                return {
                    "@context":"https://schema.org",
                    "@type":"Product",
                    "productID": product.externalId,
                    "name": product.title,
                    "description": product.title + " " + product.size + " " + product.colorCode,
                    "url":  "https://ssblumev3.azurewebsites.net/product?referenceCode="+product.referenceCode+"&colorCode="+product.colorCode,
                    "image": product.imageUrl,
                    "brand":"Blume",
                    "offers":[
                        {
                        "@type":"Offer",
                        "price": product.price,
                        "priceCurrency": "CRC",
                        "itemCondition":"https://schema.org/NewCondition",
                        "availability":"https://schema.org/InStock"
                        }
                    ]
                };
            }

            return {
                fbPixelInit: fbPixelInit,
                fbPixelPageView: fbPixelPageView,
                fbPixelViewContent: fbPixelViewContent
            };

        }

})();
