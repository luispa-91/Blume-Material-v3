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
            Website.storeLocations().then(function(results){
                vm.storeLocations = results;
            },function(err){ Mail.errorLog(err) });
        }


    }
})();