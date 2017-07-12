(function() {
  'use strict';

  angular
    .module('angular')
    .controller('BlogPostController', BlogPostController);

  /** @ngInject */
  function BlogPostController(Blog,APP_INFO,$scope,$stateParams) {
    var vm = this;
        $scope.myInterval = 3000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        init();
        ////////////////

        function init() {

          var post_id = $stateParams.post_id;

          Blog.getPostDetails(post_id)
              .then(function (data) {
                  $scope.post = data.data;
                  $scope.company_name = APP_INFO.directory;
              })

        }
  }
})();
