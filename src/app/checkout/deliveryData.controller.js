(function() {
    'use strict';
    angular
        .module('angular')
        .controller('DeliveryDataController', DeliveryDataController);
        DeliveryDataController.$inject = ['LocationAutoComplete', 'Delivery'];
    function DeliveryDataController(LocationAutoComplete, Delivery) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.addressComplete = false;
            vm.address = {};
            vm.provinces = LocationAutoComplete.costaRicaProvinces;
            vm.states = LocationAutoComplete.costaRicaStates;
            vm.cities = LocationAutoComplete.costaRicaCities;
            vm.countries = LocationAutoComplete.countries;

            //Bind functions
            vm.verify = verify;
            vm.selectProvince = selectProvince;
            vm.selectCity = selectCity;
            vm.selectState = selectState;
            vm.clearStateAndCity = clearStateAndCity;
            vm.getDeliveryCost = Delivery.getDeliveryCost;
            vm.toggleDeliveryMethod = toggleDeliveryMethod;

            getDeliveryMethods();
        }

        function verify(isValid){
            if(isValid){
                vm.addressComplete = true;
            } else {
                vm.addressComplete = false;
            }
        }

        function getDeliveryMethods(){
            Delivery.availableMethods().then(function(data){ vm.deliveryMethods = data; });
        }

        function toggleDeliveryMethod(selectedMethod){
            vm.addressComplete = false;
            vm.deliveryMethod = selectedMethod;
            Delivery.reset();
        }

        function clearStateAndCity(){
            vm.selectedState = "";
            vm.selectedCity = "";
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
