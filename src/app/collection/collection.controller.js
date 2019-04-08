(function(){
  angular
    .module('angular')
    .controller('CollectionController',CollectionController);
    function CollectionController($stateParams, Catalog, Products, APP_INFO, $scope, Personalization, Mail, $state){
      var vm = this;
      vm.collection = $stateParams.name;

	    init();

	    function init() {
	      vm.loader = true;
		  vm.styles = Personalization.styles;
		  vm.itemsDisplayed = 8;
          vm.addMoreItems = addMoreItems;
          vm.companyId = APP_INFO.ID;
          vm.setSizeFilter = setSizeFilter;
          $scope.setCategoryFilter = setCategoryFilter;

          if($stateParams.variantName){
            Products.allByVariantName($stateParams.variantName)
            .then(function (data) {
                vm.catalog = data;
                vm.loader = false;
            },function(err){ Mail.errorLog(err) });
          } else {
            Products.all()
              .then(function (data) {
                  vm.catalog = data;
                  vm.loader = false;
              },function(err){ Mail.errorLog(err) });
          }

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
		
		function setSizeFilter(sizeFilter){
            if(sizeFilter != ''){
                $state.go('collectionByVariantName' ,{name: $stateParams.name, variantName: sizeFilter});
            } else {
                $state.go('collection', {name:$stateParams.name});
            }
        }

        function addMoreItems(){
            vm.itemsDisplayed += 4;
        }

	    function setCategoryFilter(category){
	        vm.selectedCategory = category.title;
	    }

    }
})();
