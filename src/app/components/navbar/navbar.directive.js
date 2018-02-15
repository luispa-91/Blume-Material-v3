(function() {
  'use strict';

  angular
    .module('angular')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
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
    function NavbarController($scope, $timeout, $mdSidenav, $log, $mdDialog, $rootScope, Catalog, APP_INFO, Website, Mail) {
      var vm = this;

      function init(){

        //Initialize variables
        vm.companyId = APP_INFO.ID;
        
        //Get Catalog collection titles
        Catalog.getCollections(APP_INFO.ID).then(function (data) { vm.collections = data; },function(err){ Mail.errorLog(err) });

        //Get navbar tabs
        Website.navbar().then(function(results){ vm.navbar = results; },function(err){ Mail.errorLog(err) });

        //Get total cart items
        vm.items = $rootScope.cart.getTotalItems();

      }

      init();

      $rootScope.$on('updateItemQ', function (event, data) {
        vm.items = $rootScope.cart.getTotalItems();
      });

      $scope.toggleLeft = buildDelayedToggler('left');
      $scope.toggleRight = buildToggler('right');
      $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
      };
      /**
       * Supplies a function that will continue to operate until the
       * time is up.
       */
      function debounce(func, wait, context) {
        var timer;
        return function debounced() {
          var context = $scope,
              args = Array.prototype.slice.call(arguments);
              $timeout.cancel(timer);
              timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
              }, wait || 10);
            };
      }
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildDelayedToggler(navID) {
        return debounce(function() {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }, 200);
      }
      function buildToggler(navID) {
        return function() {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }
      }

      var originatorEv;
      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };
      this.notificationsEnabled = true;
      this.toggleNotifications = function() {
        this.notificationsEnabled = !this.notificationsEnabled;
      };
      this.redial = function() {
        $mdDialog.show(
          $mdDialog.alert()
            .targetEvent(originatorEv)
            .clickOutsideToClose(true)
            .parent('body')
            .title('Suddenly, a redial')
            .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
            .ok('That was easy')
        );
        originatorEv = null;
      };
    }
  }

})();
