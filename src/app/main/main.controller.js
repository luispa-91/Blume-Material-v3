(function() {
  'use strict';

  angular
    .module('angular')
    .controller('MainController', MainController)
    .controller('LeftCtrl',LeftCtrl);

  /** @ngInject */
  function MainController(APP_INFO, Website, Products, Personalization, $sce, Mail, $mdDialog, $timeout) {
    var vm = this;

    init();

    function init(){

      vm.widgetApprovedUrl = "";
      vm.instagram = APP_INFO.instagram;
      vm.loader = true;
      vm.styles = Personalization.styles;
      vm.companyName = APP_INFO.directory;
      vm.companyId = APP_INFO.ID;

      //Get featured products
      Products.featured().then(function (data) { vm.featuredProducts = data; vm.loader = false; },function(err){ Mail.errorLog(err) });

      //Get currency
      Website.settings().then(function (data) { vm.currency = data.currency; },function(err){ Mail.errorLog(err) });

      //Build home page
      Website.home().then(function (data){ 
        vm.home = data; 
        vm.widgetApprovedUrl = $sce.trustAsResourceUrl("//lightwidget.com/widgets/"+vm.home.secondaryBodyDescription+".html"); 
      },function(err){ Mail.errorLog(err) });

      if(vm.companyId==406){
        showPrompt();
      }
    }

    function showPrompt(ev){
      $timeout(function () { 
        var confirm = $mdDialog.prompt()
        .title('Ingresá tu correo para recibir promociones')
        .ariaLabel('Discount code input')
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');  

      $mdDialog.show(confirm).then(function(result) {
        //Create customer with newsletter = true
        var customer = {
          id: APP_INFO.ID,
          full_name: result,
          email: result,
          phone: "",
          subscribed_newsletter: true
        }
        Website.createCustomerSimple(customer).then(function(results){ console.log(results); });
      }, function() {
        //Close modal
      });
         }, 5000, true); 
    }
  }

  function LeftCtrl($mdSidenav, $state, Catalog, APP_INFO, Website, Mail){
    var vm = this;

    function init(){

      //Initialize variables
      vm.companyId = APP_INFO.ID;

      //Get Catalog collection titles
      Catalog.getCollections(APP_INFO.ID).then(function (data) { vm.collections = data; },function(err){ Mail.errorLog(err) });

      //Get navbar tabs
      Website.navbar().then(function (data){ vm.navbar = data; },function(err){ Mail.errorLog(err) });

    }
    init();

    vm.close = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
    };

    vm.goTo = function(tabName){
      $state.go(tabName);
      vm.close();
    }

    vm.collection = function(collection_title){
        $state.go('collection', {name: collection_title});
        vm.close();
    }

    vm.cremacion = function(){
        $state.go('cremacion');
        vm.close();
    }

    vm.preguntas = function(){
        $state.go('preguntas');
        vm.close();
    }

    vm.proveedor = function(){
        $state.go('proveedor');
        vm.close();
    }

    vm.discounts = function(){
        $state.go('discounts');
        vm.close();
    }

  }
})();
