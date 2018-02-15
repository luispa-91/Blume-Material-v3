(function() {
    'use strict';

    angular
        .module('angular')
        .controller('AboutController', AboutController);
        function AboutController(Website, Mail) {
        var vm = this;

        //Get Website settings
        vm.getAbout = Website.getAbout;
        vm.getAbout().then(function(data){
        	vm.about = data
        },function(err){ Mail.errorLog(err) })
        

    }
})();
