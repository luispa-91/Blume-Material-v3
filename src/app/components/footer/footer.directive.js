(function() {
    'use strict';

    angular
        .module('angular')
        .directive('acmeFooter', acmeFooter);

    /** @ngInject */
    function acmeFooter() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/footer/footer.html',
            scope: {
                creationDate: '='
            },
            controller: FooterController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function FooterController(Website) {
            var vm = this;

            vm.getWebsiteSettings = Website.getWebsiteSettings;
            vm.getWebsiteSettings().then(function(results){
              vm.settings = results;
            })
            vm.selectedMode = 'md-fling';
            vm.selectedDirection = 'right';
            vm.isOpen = false;
        };

    }

})();
