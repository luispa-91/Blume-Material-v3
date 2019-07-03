(function() {
    'use strict';

    angular
        .module('angular')
        .directive('blumeFooter', blumeFooter);

    /** @ngInject */
    function blumeFooter() {
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
        function FooterController(Website, BlumeAnalytics) {
            var vm = this;

            init();

            function init(){

                //Initialize Variables
                vm.selectedMode = 'md-fling';
                vm.selectedDirection = 'right';
                vm.isOpen = false;
                
                //Get footer
                Website.footer().then(function(results){ 
                    vm.footer = results;
                    //Initialize chat bubble
                    if(vm.footer.chatBubble&&!vm.footer.isBitrixChat){ Website.createChatBubble(vm.footer); };
                    if(vm.footer.isBitrixChat){ Website.createBitrixChat(); };
                    //Initialize facebook pixel
                    BlumeAnalytics.fbPixelInit(vm.footer.facebookPixelId);
                    BlumeAnalytics.fbPixelPageView();
                },function(err){ Mail.errorLog(err) });

            }

        };

    }

})();
