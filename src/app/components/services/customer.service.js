(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Customer', Customer);

        Customer.$inject = ['$http','APP_INFO'];
        function Customer($http, APP_INFO){

          var signUp = function (customer) {
          return $http({
              method: "POST",
              url: "https://central-api.madebyblume.com/v1/website/customer",
              data: {
                  id: APP_INFO.ID,
                  full_name: customer.full_name,
                  email: customer.email,
                  phone: customer.phone,
                  subscribed_newsletter: false
              },
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          })
      }

      var addAddress = function (address) {
          return $http({
              method: "POST",
              url: "https://central-api.madebyblume.com/v1/website/customer/address",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              data: {
                  id: address.customer_id,
                  city: address.city,
                  state: address.state,
                  country: address.country,
                  address: address.address,
                  address2: "",
                  zip_code: "",
                  note: address.note
              }
          })
      }

        return {
          signUp: signUp,
          addAddress: addAddress

        }
    }

})();
