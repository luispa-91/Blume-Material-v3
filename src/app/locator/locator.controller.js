(function() {
    'use strict';

    angular
        .module('angular')
        .controller('LocatorController', LocatorController);
        function LocatorController(Website, NgMap) {
        var vm = this;
        vm.map = null;

        //Initialize controller
        init();

        function init(){
            //Get store locations settings
            vm.selected_store = {};
            vm.getStoreSettings = Website.getStoreSettings;
            vm.getStoreSettings().then(function(results){
                vm.store_locations = results.locations;
                vm.location = results.location;
                NgMap.getMap().then(function(map) { 
                    vm.map = map;
                  });
            });

            //Bind functions
            vm.showInfo = showInfo;
        }

        function showInfo(event, store){
            vm.selected_store = store;
            vm.map.showInfoWindow('foo', this);
        }

        

    }
})();