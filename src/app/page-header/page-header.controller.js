(function() {
  'use strict';

  angular
    .module('angular')
    .controller('PageHeaderController', PageHeaderController);

  /** @ngInject */
  function PageHeaderController(MetaTags, $scope) {
    var vm = this;
    $scope.Page = MetaTags;
    $scope.pixelId = "123123123";
  }

})();
