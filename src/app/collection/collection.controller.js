(function(){
  angular
    .module('angular')
    .controller('CollectionController',CollectionController);
    function CollectionController($stateParams, Catalog, APP_INFO, $scope, Personalization, Mail){
      var vm = this;
      vm.collection = $stateParams.name;

	    init();
	    $scope.setCategoryFilter = setCategoryFilter;

	    function init() {
	      vm.loader = true;
	      vm.styles = Personalization.styles;
	      Catalog.getProducts(APP_INFO.ID)
	          .then(function (data) {
	              $scope.catalog = data;
	              vm.loader = false;
	          },function(err){ Mail.errorLog(err) });

	      Catalog.getProductTypesByCollection(APP_INFO.ID,vm.collection)
	          .then(function (data) {
	              vm.categories = data;
	          },function(err){ Mail.errorLog(err) });

          //Set store configuration
          Catalog.setStoreData(APP_INFO.ID)
            .then(function (response) {
              vm.currency = response.data.currency;
            },function(err){ Mail.errorLog(err) });

	    }

	    function setCategoryFilter(category){
	        vm.selectedCategory = category.title;
	    }

    }
})();
