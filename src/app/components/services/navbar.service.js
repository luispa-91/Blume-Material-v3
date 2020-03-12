(function(){
'use strict';
    angular
        .module('angular')
        .factory('Navbar', Navbar);
        Navbar.$inject = ['$mdSidenav', '$log', '$location','$http'];
        function Navbar($mdSidenav, $log, $location,$http){

            var buildToggler = function (navID) {
                return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
                }
            }

            var openRight = function(){
                return $mdSidenav('right').isOpen();
            };

            var close = function () {
                $mdSidenav('left').close()
                  .then(function () {
                  });
              };

            var goTo = function (linkUrl) {
                $location.path(linkUrl);
                close();
            }

            var get = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/navbar").then(function (results) {
                    return results.data.data;
                });
            }

            return {
                buildToggler: buildToggler,
                openRight: openRight,
                close: close,
                goTo: goTo,
                get: get
            }
        }
  })();
  