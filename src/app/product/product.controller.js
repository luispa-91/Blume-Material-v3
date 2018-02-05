(function() {
  'use strict';

  angular
    .module('angular')
    .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController(Catalog,APP_INFO,$scope,$stateParams) {
    var vm = this;
    $scope.active = 0;
    init();
    ////////////////

    function init() {

      vm.option1 = "";
      vm.option2 = "";
      vm.option3 = "";

      var product_id = $stateParams.product_id;

      //Set store configuration
      Catalog.setStoreData(APP_INFO.ID)
        .then(function (response) {
          $scope.currency = response.data.currency;
        });

      Catalog.productExpand(product_id)
          .then(function (data) {
              $scope.product = data;

              $scope.price = $scope.product.variants[0].price;

              if($scope.product.options.length > 0){
                  vm.option1 = $scope.product.options[0].values[0];
              }
              if($scope.product.options.length > 1){
                  vm.option2 = $scope.product.options[1].values[0];
              }
              if($scope.product.options.length > 2){
                  vm.option3 = $scope.product.options[2].values[0];
              }
          })

    }

    $scope.share = function(product){
      window.open('https://www.facebook.com/sharer.php?caption=' + product.title + '&u=https://cms.blumewebsites.com/' + product.images[0].relative_url, 'Share', 'scrollbars=yes,resizable=yes,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no,width=400, height=300, top=300, left=300' );
    }
  }
})();
