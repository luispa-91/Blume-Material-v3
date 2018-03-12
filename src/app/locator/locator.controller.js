(function() {
    'use strict';

    angular
        .module('angular')
        .controller('LocatorController', LocatorController);
        function LocatorController(Website, NgMap, Personalization, Mail) {
        var vm = this;
        vm.map = null;

        //Initialize controller
        init();

        function init(){
            //Get store locations settings
            vm.selected_store = {};
            vm.center = "San José, Costa Rica";
            vm.getStoreSettings = Website.getStoreSettings;
            vm.styles = Personalization.styles;
            vm.getStoreSettings().then(function(results){
                vm.store_locations = results.locations;
                vm.location = results.location;
                NgMap.getMap().then(function(map) { 
                    vm.map = map;
                  });
            },function(err){ Mail.errorLog(err) });

            //Bind functions
            vm.showInfo = showInfo;
            vm.centerMap = centerMap;
        }

        function showInfo(event, store){
            vm.selected_store = store;
            vm.map.showInfoWindow('foo', this);
        }

        function centerMap(location){
            vm.center = location.coordinates;
        }
        

    }
})();