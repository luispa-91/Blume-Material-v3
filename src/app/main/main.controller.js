(function() {
  'use strict';

  angular
    .module('angular')
    .controller('MainController', MainController)
    .controller('LeftCtrl',LeftCtrl);

  /** @ngInject */
  function MainController(Catalog, APP_INFO, Website) {
    var vm = this;

    function init(){

      vm.loader = true;

      //Get catalog products
      Catalog.getFeaturedProducts(APP_INFO.ID)
        .success(function (data) {
          vm.catalog = data;
          vm.loader = false;
        });

      Catalog.getSliderPhotos(APP_INFO.directory)
        .success(function (data) {
            vm.sliderPhotos = data;
            vm.company_name = APP_INFO.directory;
        });

      //Set store configuration
      Catalog.setStoreData(APP_INFO.ID)
        .then(function (response) {
          vm.currency = response.data.currency;
        });

      //Get Website settings
      vm.getWebsiteSettings = Website.getWebsiteSettings;
      vm.getWebsiteSettings().then(function(results){
        vm.settings = results;
      })
    }

    init();
  }

  function LeftCtrl($scope, $timeout, $mdSidenav, $log, $state, $cookies, $rootScope, Catalog, APP_INFO, Website){
    var vm = this;

    function init(){

      //Get collections
      Catalog.getCollections(APP_INFO.ID)
            .success(function (data) {
                $scope.collections = data;
            });

      //Get Website settings
      vm.getWebsiteSettings = Website.getWebsiteSettings;
      vm.getWebsiteSettings().then(function(results){
        vm.settings = results;
      })

    }
    init();

    vm.close = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
    };

    vm.home = function(){
      $state.go('home');
      vm.close();
    }

    vm.products = function(){
        $state.go('products');
        vm.close();
    }

    vm.collection = function(collection_title){
        $state.go('collection', {name: collection_title});
        vm.close();
    }

    vm.locator = function(){
        $state.go('locator');
        vm.close();
    }

    vm.about = function(){
        $state.go('about');
        vm.close();
    }

    vm.blog = function(){
        $state.go('blog');
        vm.close();
    }

    vm.contact = function(){
        $state.go('contact');
        vm.close();
    }









  }
})();
