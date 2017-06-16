(function() {
  'use strict';

  angular
    .module('angular')
    .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController(Catalog,APP_INFO,$scope,$stateParams) {
    var vm = this;
        $scope.myInterval = 3000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        init();
        ////////////////

        function init() {

          $scope.option1 = "";
          $scope.option2 = "";
          $scope.option3 = "";

          var product_id = $stateParams.product_id;

          //Set store configuration
          Catalog.setStoreData(APP_INFO.ID)
            .then(function (response) {
              $scope.currency = response.data.currency;
            });

          Catalog.productExpand(product_id)
              .success(function (data) {
                  $scope.product = data;

                  $scope.price = $scope.product.variants[0].price;

                  if($scope.product.options.length > 0){
                      $scope.option1 = $scope.product.options[0].values[0];
                  }
                  if($scope.product.options.length > 1){
                      $scope.option2 = $scope.product.options[1].values[0];
                  }
                  if($scope.product.options.length > 2){
                      $scope.option3 = $scope.product.options[2].values[0];
                  }

              })

        }

        $scope.share = function(product){
          FB.ui(
          {
              method: 'feed',
              name: product.title,
              link: APP_INFO.website_url + '#/product/'+ product.id,
              picture: 'http://cms.blumewebsites.com/' + product.images[0].relative_url,
              caption: APP_INFO.name,
              description: product.short_description,
              message: ''
          });
        }
  }
})();
