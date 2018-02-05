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
        function FooterController(Website, APP_INFO) {
            var vm = this;

            Website.footer().then(function(results){
              vm.footer = results;
              var logo_url = "//cms.blumewebsites.com/" + vm.footer.logoUrl;

              if(APP_INFO.chat.facebook){
                //Initialize Chat Bubble
                  var options = {
                        facebook: APP_INFO.chat.facebook, // Facebook page ID
                        whatsapp: APP_INFO.chat.whatsapp, // WhatsApp number
                        company_logo_url: logo_url, // URL of company logo (png, jpg, gif)
                        greeting_message: "Necesita ayuda? Escríbanos y estaremos en contacto pronto", // Text of greeting message
                        call_to_action: "Envíenos un mensaje", // Call to action
                        button_color: "#129BF4", // Color of button
                        position: "right", // Position may be 'right' or 'left'
                        order: APP_INFO.chat.order // Order of buttons
                    };
                    var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
                    var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
                    s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
                    var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
              }

            })
            vm.selectedMode = 'md-fling';
            vm.selectedDirection = 'right';
            vm.isOpen = false;

        };

    }

})();
