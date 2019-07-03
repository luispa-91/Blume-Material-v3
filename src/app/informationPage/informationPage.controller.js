(function() {
    'use strict';

    angular
        .module('angular')
        .controller('InformationPageController', InformationPageController);

        InformationPageController.$inject = ['Website', '$stateParams'];
        function InformationPageController(Website, $stateParams) {
        var vm = this;
        init();

        function init(){
            //Get Parameters
            vm.pageName = "";
            if($stateParams.pageName){vm.pageName = $stateParams.pageName;}

            //Get Page information and layout settings
            Website.getCustomPage(vm.pageName).then(function(data){ vm.page = data; });
        }
        
    }
})();
