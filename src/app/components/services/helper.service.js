(function(){
    'use strict';
      angular
          .module('angular')
          .directive('onErrorSend', function() {
            return {
                link: function(scope, element, attrs) {
                  element.bind('error', function() {
                    var lastslashindex = attrs.src.lastIndexOf('/');
                    var result= attrs.src.substring(lastslashindex  + 1).replace(".jpg","");
                    console.log(result);
                  });
                }
            }
        })
          .factory('Helper', Helper);
          Helper.$inject = ['$http','$location'];
          function Helper($http,$location){
  
              var currency = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/currency").then(function (results) {
                      return results.data.data;
                  });
              }

              var googleAnalyticsId = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/googleAnalytics").then(function (results) {
                    return results.data.data;
                });
            }

            var isGrupoCachos = function () {
              var websiteHost = $location.$$host;
              if(websiteHost=='cachoscr.com'||websiteHost=='nmnuevomundo.com'||websiteHost=='foxracingcr.com'||websiteHost=='newwavecr.com'||websiteHost=='beakcr.com'||websiteHost=='freaks.fit') {
                return true;
              } else {
                return false;
              }
            }

            var showWrapGift = function () {
              var websiteHost = $location.$$host;
              if(websiteHost=='killerqueencr.com'||websiteHost=='basicbcr.com'||websiteHost=='woohoocr.com'||websiteHost=='demo.madebyblume.com'||websiteHost=='localhost') {
                return true;
              } else {
                return false;
              }
            }
              
              return {
                currency:currency,
                googleAnalyticsId: googleAnalyticsId,
                isGrupoCachos: isGrupoCachos,
                showWrapGift: showWrapGift
              }
          }
  })();
  