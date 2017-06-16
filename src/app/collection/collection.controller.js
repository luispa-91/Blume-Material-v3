(function(){
  angular
    .module('angular')
    .controller('CollectionController',CollectionController);
    function CollectionController($stateParams, Catalog, APP_INFO, $scope){
      var vm = this;
      vm.collection = $stateParams.name;

	    init();
	    $scope.setCategoryFilter = setCategoryFilter;

	    function init() {
	      vm.loader = true;
	      Catalog.getProducts(APP_INFO.ID)
	          .success(function (data) {
	              $scope.catalog = data;
	              vm.loader = false;
	          });

	      Catalog.getCategories(APP_INFO.ID)
	          .success(function (data) {
	              $scope.categories = data;
	          });

          //Set store configuration
          Catalog.setStoreData(APP_INFO.ID)
            .then(function (response) {
              vm.currency = response.data.currency;
            });

	    }

	    function setCategoryFilter(category){
	        $scope.selectedCategory = category.title;
	    }

    }
})();
