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
            vm.page = {
                htmlContent: '<h1 style="text-align: center;">Acerca de Nosotros</h1><p style="text-align: center;">oeant enatoeh antohe nathoe tnho ethaonethnath otneha noteha otneh etnaohentoahe ntaohe nath entohe natohe natohenatohe natohenatohe anoteh anoteh.</p><p style="text-align: center;"><br/></p><p style="text-align: center;">​<img class="ta-insert-video" src="https://img.youtube.com/vi/DAE1NbKstqk/hqdefault.jpg" ta-insert-video="https://www.youtube.com/embed/DAE1NbKstqk" contenteditable="false" allowfullscreen="true" frameborder="0" style="width: 617px;height: 462px;"/></p><p style="text-align: center;"><br/></p>'
            }
        }
        

    }
})();
