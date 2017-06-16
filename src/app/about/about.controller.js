(function() {
    'use strict';

    angular
        .module('angular')
        .controller('AboutController', AboutController);
        function AboutController(Website) {
        var vm = this;

        //Get Website settings
        vm.getAbout = Website.getAbout;
        vm.getAbout().then(function(data){
        	vm.about = data
        })
        

    }
})();
