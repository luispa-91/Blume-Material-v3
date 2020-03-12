(function() {
    'use strict';

    angular
        .module('angular')
        .controller('InformationPageController', InformationPageController);

        InformationPageController.$inject = ['Website', '$stateParams','$state'];
        function InformationPageController(Website, $stateParams,$state) {
        var vm = this;
        init();

        function init(){
            //Get Parameters
            vm.pageName = "";
            if($stateParams.pageName){vm.pageName = $stateParams.pageName;}
            if($state.$current.name=="promoSelina"){
                vm.pageName = "promoselina";
            }
            //Get Page information and layout settings
            Website.getCustomPage(vm.pageName).then(function(data){ vm.page = data; });
        }

    }
})();
