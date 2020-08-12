(function() {
  'use strict';

  angular
    .module('angular')
    .directive('blumeNavbar', blumeNavbar)
    .controller('LeftCtrl',LeftCtrl);

  /** @ngInject */
  function blumeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(Navbar, ngCart, Website, Helper, Personalization) {
      var vm = this;

      init();

      function init(){

        //Initialize variables
        vm.navbar = {};
        vm.toggleLeft = Navbar.buildToggler('left');
        vm.toggleRight = Navbar.buildToggler('right');
        vm.isOpenRight = Navbar.openRight;
        vm.cart = ngCart;
        vm.searchProducts = searchProducts;
        vm.site = Helper.currentSite();
        vm.theme = Personalization.navbar(vm.site);

        //Get navbar
        Navbar.get().then(function(results){ vm.navbar = results; },function(err){ Mail.errorLog(err) });
        Website.warehouseList().then(function(results){ vm.warehouseList = results; },function(err){ Mail.errorLog(err) });

      }

      vm.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      };

      function searchProducts(){
        var filter = {
            criteria: vm.searchQuery,
            type: "s"
        };
        Website.setFilter(filter);
      }
      
    }
  }

  function LeftCtrl(Navbar, Helper){
    var vm = this;

    init();

    function init(){
      vm.site = Helper.currentSite();
      //Get navbar
      Navbar.get().then(function(results){ vm.navbar = results; },function(err){ Mail.errorLog(err) });
      
      //Bind functions
      vm.close = Navbar.close;
      vm.goTo = Navbar.goTo;
    }

  }

})();
