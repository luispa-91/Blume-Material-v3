(function() {
    'use strict';
  
    angular
      .module('angular')
      .controller('HeadController', HeadController);
      
    HeadController.$inject = ['$scope','$location','Website','Prerender','$sce'];
    function HeadController($scope,$location,Website,Prerender,$sce) {
  
      function buildTags(){
        $scope.metaTags = {};
        $scope.faviconUrl = "";
          switch ($location.$$path) {
            case "/":
              Prerender.mainPage().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
            case "/product":
              Prerender.product().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
            case "/products":
              Prerender.products().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
            case "/storeLocations":
              Prerender.storeLocations().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
            case "/checkout":
              Prerender.checkout().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
            default:
              Prerender.mainPage().then(function (data) { $scope.metaTags = data; $scope.faviconUrl = $sce.trustAsResourceUrl("https://cms.blumewebsites.com/"+$scope.metaTags.directory+"/website/logo.png"); });
                  break;
          }
      }

      Website.broadcastUrlChanged($scope, function broadcastUpdate() {
        // Handle notification
        setTimeout(function(){
            buildTags();
            $scope.$apply();
            }, 500);
    });
  
    }
  })();
  