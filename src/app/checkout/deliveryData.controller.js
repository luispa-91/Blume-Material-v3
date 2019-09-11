(function() {
    'use strict';
    angular
        .module('angular')
        .controller('DeliveryDataController', DeliveryDataController);
        DeliveryDataController.$inject = ['LocationAutoComplete', 'Delivery', '$localStorage'];
    function DeliveryDataController(LocationAutoComplete, Delivery,$localStorage) {
        var vm = this;
        init();
        ///////////////

        function init(){
            //Initialize Controller
            vm.addressComplete = false;
            vm.addressCreated = false;
            vm.showStorePickup = false;
            vm.address = { customerId: 0, isDefault: true };
            vm.provinces = LocationAutoComplete.costaRicaProvinces;
            vm.states = LocationAutoComplete.costaRicaStates;
            vm.cities = LocationAutoComplete.costaRicaCities;
            vm.countries = LocationAutoComplete.countries;
            vm.selectedFare= 0;
            vm.orderNote = "";

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
            $localStorage.orderNote = vm.orderNote;
            if(isValid){
                vm.addressComplete = true;
            } else {
                vm.addressComplete = false;
            }
            //Verify if customer already exists
            if(vm.addressComplete&&!vm.addressCreated){
                Delivery.createAddress(vm.address,vm.orderNote).then(function(response){ vm.addressCreated = true; });
            }
        }

        function getDeliveryMethods(){
            Delivery.availableMethods().then(function(data){ 
                vm.deliveryMethods = data;
                vm.selectedFare=vm.deliveryMethods[0].id;
                for (var i = 0; i < vm.deliveryMethods.length; i++) {
                    if(vm.deliveryMethods[i].deliveryType=="storepickup"){
                        vm.showStorePickup = true;
                    }
                }
             });
        }

        function toggleDeliveryMethod(selectedMethod){
            vm.addressComplete = false;
            vm.deliveryMethod = selectedMethod;
            Delivery.reset(selectedMethod,vm.selectedFare,vm.deliveryMethods);
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
