(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Customer', Customer);

        Customer.$inject = ['$http','$localStorage'];
        function Customer($http,$localStorage){

            var verify = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/verify",request).then(function (results) {
                    return results.data.data;
                });
            }

            var login = function (customer) {
                var request = {
                    email: customer.email,
                    password: customer.password
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/login",request).then(function (results) {
                    return results.data.data;
                });
            }

            var expand = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/expand",request).then(function (results) {
                    return results.data.data;
                });
            }

            var create = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/create",request).then(function (results) {
                    return results.data.data;
                });
            }

            var update = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/update",request).then(function (results) {
                    return results.data.data;
                });
            }

        return {
            verify:verify,
            expand:expand,
            update:update,
            login:login,
            create:create
        }
    }

})();
