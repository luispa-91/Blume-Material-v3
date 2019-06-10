(function() {
    'use strict';

    angular
        .module('angular')
        .controller('CustomerDataController', CustomerDataController);
        CustomerDataController.$inject = ['Customer'];
    function CustomerDataController(Customer) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.customer = {id: '', fullName:'',documentId:'',email:'',phone:'',password:'',isLoggedIn:false,exists:false};
            vm.customerComplete = false;
            vm.loginModuleVisible = false;

            //Bind functions
            vm.verify = verify;
            vm.login = login;
        }

        function verify(isValid){
            if(isValid){
                vm.customerComplete = true;
            } else {
                vm.customerComplete = false;
            }
            //Verify if customer already exists
            if(vm.customer.email!=''&&vm.customer.id==''){
                Customer.verify(vm.customer.email).then(function(response){ vm.customer.exists = response.exists; vm.customer.id = response.id; })
            }
            if(vm.customerComplete&&!vm.customer.exists){
                Customer.create(vm.customer).then(function(response){ vm.customer.id = response.id; });
            }
        }

        function login(){
            
        }
    }
})();
