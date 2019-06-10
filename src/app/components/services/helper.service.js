(function(){
    'use strict';
      angular
          .module('angular')
          .factory('Helper', Helper);
          Helper.$inject = ['$http'];
          function Helper($http){
  
              var currency = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/helper/currency").then(function (results) {
                      return results.data.data;
                  });
              }
              
              return {
                currency:currency
              }
          }
  })();
  