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
          Helper.$inject = ['$http'];
          function Helper($http){
  
              var currency = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/helper/currency").then(function (results) {
                      return results.data.data;
                  });
              }

              var googleAnalyticsId = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/googleAnalytics").then(function (results) {
                    return results.data.data;
                });
            }
              
              return {
                currency:currency,
                googleAnalyticsId: googleAnalyticsId
              }
          }
  })();
  