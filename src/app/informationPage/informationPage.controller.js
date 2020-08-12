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
            vm.bitrix = {
                formId: 0,
                formCode: ""
            };
            if($state.$current.name=="promoSelina"){
                vm.pageName = "promoselina";
                vm.bitrix.formId = 23;
                vm.bitrix.formCode = "c8idmp";
                (function(w,d,u,b){w['Bitrix24FormObject']=b;w[b] = w[b] || function(){arguments[0].ref=u;
                    (w[b].forms=w[b].forms||[]).push(arguments[0])};
                    if(w[b]['forms']) return;
                    var s=d.createElement('script');s.async=1;s.src=u+'?'+(1*new Date());
                    var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
            })(window,document,'https://grupocacho.bitrix24.com/bitrix/js/crm/form_loader.js','b24form');
    
            b24form({"id":vm.bitrix.formId,"lang":"en","sec":vm.bitrix.formCode,"type":"button","click":""});
            } else if($state.$current.name=="promoRideNM"){
                vm.pageName = "promo";
                vm.bitrix.formId = 2;
                vm.bitrix.formCode = "rpmlw3";
                (function(w,d,u,b){w['Bitrix24FormObject']=b;w[b] = w[b] || function(){arguments[0].ref=u;
                    (w[b].forms=w[b].forms||[]).push(arguments[0])};
                    if(w[b]['forms']) return;
                    var s=d.createElement('script');s.async=1;s.src=u+'?'+(1*new Date());
                    var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
            })(window,document,'https://grupocacho.bitrix24.com/bitrix/js/crm/form_loader.js','b24form');
    
            b24form({"id":vm.bitrix.formId,"lang":"en","sec":vm.bitrix.formCode,"type":"button","click":""});
            }
            //Get Page information and layout settings
            Website.getCustomPage(vm.pageName).then(function(data){ vm.page = data; });
        }

    }
})();
