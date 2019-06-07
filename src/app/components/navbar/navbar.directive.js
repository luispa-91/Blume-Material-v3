(function() {
  'use strict';

  angular
    .module('angular')
    .directive('blumeNavbar', blumeNavbar)
    .controller('LeftCtrl',LeftCtrl);;

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
    function NavbarController(Navbar, ngCart) {
      var vm = this;

      init();

      function init(){

        //Initialize variables
        vm.navbar = {};
        vm.toggleLeft = Navbar.buildToggler('left');
        vm.toggleRight = Navbar.buildToggler('right');
        vm.isOpenRight = Navbar.openRight;
        vm.cart = ngCart;

        //Get navbar
        Navbar.get().then(function(results){ vm.navbar = results; },function(err){ Mail.errorLog(err) });

      }

      vm.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      };
      
    }
  }

  function LeftCtrl(Navbar){
    var vm = this;

    init();

    function init(){
      //Get navbar
      vm.navbar = Navbar.example;
      //Bind functions
      vm.close = Navbar.close;
      vm.goTo = Navbar.goTo;
    }

  }

})();
