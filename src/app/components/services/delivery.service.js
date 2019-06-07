(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Delivery', Delivery);
        Delivery.$inject = ['$http'];
        function Delivery($http){
          
            return {
              
            }
        }
})();
