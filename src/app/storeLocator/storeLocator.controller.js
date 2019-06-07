(function() {
    'use strict';

    angular
        .module('angular')
        .controller('StoreLocatorController', StoreLocatorController);
        function StoreLocatorController(Website, Mail) {
        var vm = this;

        //Initialize controller
        init();

        function init(){
            //Get store locations settings
            // vm.getStoreSettings = Website.getStoreSettings;
            // vm.getStoreSettings().then(function(results){
            //     vm.storeLocations = results.locations;
            //     for (var i = 0; i < vm.storeLocations.length; i++) {
            //         vm.storeLocations[i].description = "Ejemplo de descripción para tienda seleccionada";
            //     }
            // },function(err){ Mail.errorLog(err) });
        }


    }
})();