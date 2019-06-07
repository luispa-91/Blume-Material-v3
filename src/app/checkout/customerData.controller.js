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

            //Bind functions
            vm.verify = verify;
        }

        function verify(isValid){
            if(isValid){
                vm.customerComplete = true;
            } 
            //Verify if customer already exists
            // if(vm.customer.email=='luispa91@gmail.com'){
            //     vm.customer.exists = true;
            // }
        }
    }
})();
