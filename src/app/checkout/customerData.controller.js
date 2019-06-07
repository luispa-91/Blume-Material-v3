import { chmod } from "fs";

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
            vm.customer = {fullName:'',documentId:'',email:'',phone:'',password:'',isLoggedIn:false,exists:false};
            vm.customerComplete = false;
            vm.loginModuleVisible = false;

            //Bind functions
            vm.verify = verify;
            vm.login = login;
        }

        function verify(isValid){
            if(isValid){
                vm.customerComplete = true;
            } 
            //Verify if customer already exists
            if(vm.customer.email!=''){
                Customer.verify(vm.customer.email).then(function(response){ vm.customer.exists = response.exists; })
            }
            if(vm.customerComplete){
                Customer.create(vm.customer).then(function(response){  })
            }
        }

        function login(){
            
        }
    }
})();
