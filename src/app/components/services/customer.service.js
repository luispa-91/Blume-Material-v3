(function() {
    'use strict';

    angular
        .module('angular')
        .factory('Customer', Customer);

        Customer.$inject = ['$http','$localStorage','$rootScope'];
        function Customer($http,$localStorage,$rootScope){

            var verify = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/verify",request).then(function (results) {
                    $localStorage.customerId = results.data.data.id;
                    $rootScope.$emit('customerComplete');
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

            var create = function (customer) {
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/create",customer).then(function (results) {
                    $localStorage.customerId = results.data.data.id;
                    $rootScope.$emit('customerComplete');
                    return results.data.data;
                },function(err){console.log(err);});
            }

            var update = function (email) {
                var request = {
                    email: email
                }
                return $http.post("https://api2.madebyblume.com/v3/storeFront/customers/update",request).then(function (results) {
                    $rootScope.$emit('customerComplete');
                    return results.data.data;
                });
            }

            var broadcastCustomerComplete = function(scope, callback) {
                var handler = $rootScope.$on('customerComplete', callback);
                scope.$on('$destroy', handler);
            }

        return {
            verify:verify,
            expand:expand,
            update:update,
            login:login,
            create:create,
            broadcastCustomerComplete: broadcastCustomerComplete
        }
    }

})();
