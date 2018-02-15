(function() {
  'use strict';

  angular
    .module('angular')
    .controller('MainController', MainController)
    .controller('LeftCtrl',LeftCtrl);

  /** @ngInject */
  function MainController(APP_INFO, Website, Products, Personalization, $sce, Catalog, Mail) {
    var vm = this;

    function init(){

      vm.widgetApprovedUrl = "";
      vm.instagram = APP_INFO.instagram;
      vm.loader = true;
      vm.styles = Personalization.styles;
      vm.companyName = APP_INFO.directory;

      //Get featured products
      Products.featured().then(function (data) { vm.featuredProducts = data; vm.loader = false; },function(err){ Mail.errorLog(err) });

      //Get currency
      Website.settings().then(function (data) { vm.currency = data.currency; },function(err){ Mail.errorLog(err) });

      //Build home page
      Website.home().then(function (data){ 
        vm.home = data; 
        vm.widgetApprovedUrl = $sce.trustAsResourceUrl("//lightwidget.com/widgets/"+vm.home.secondaryBodyDescription+".html"); 
      },function(err){ Mail.errorLog(err) });
    }

    init();
  }

  function LeftCtrl($scope, $timeout, $mdSidenav, $log, $state, $cookies, $rootScope, Catalog, APP_INFO, Website, Mail){
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
