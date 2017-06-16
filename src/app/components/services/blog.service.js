(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Blog', Blog);
        Blog.$inject = ['$http'];
        function Blog($http){

          var getPosts = function (company_id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/blog-posts",
                  params: {
                      company_id: company_id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

          var getPostDetails = function (id) {
              return $http({
                  method: "GET",
                  url: "https://central-api.madebyblume.com/v1/website/post/expand",
                  params: {
                      id: id
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
          }

            return {
              getPosts: getPosts,
              getPostDetails: getPostDetails
            }
        }
})();
