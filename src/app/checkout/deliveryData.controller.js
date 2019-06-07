(function() {
    'use strict';
    angular
        .module('angular')
        .controller('DeliveryDataController', DeliveryDataController);
        DeliveryDataController.$inject = [];
    function DeliveryDataController() {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.customer = {fullName:'',documentId:'',email:'',phone:'',password:'',isLoggedIn:false};

            //Bind functions
            vm.selectProvince = selectProvince;
            vm.selectCity = selectCity;
            vm.selectState = selectState;
        }

        function selectProvince(province){
            vm.address.country = province.name;
        }

        function selectState(state){
            vm.address.state = state.name;
        }

        function selectCity(city){
            vm.address.city = city.name;
        }
    }
})();
