(function() {
    'use strict';

    angular
        .module('angular')
        .controller('BlogController', BlogController);
        function BlogController($scope, Blog, APP_INFO) {
        var vm = this;

        init();

        function init() {
          vm.loader = true;
          Blog.getPosts(APP_INFO.ID)
              .success(function (data) {
                  $scope.posts = data;
                  vm.loader = false;
              });

        }

    }
})();
