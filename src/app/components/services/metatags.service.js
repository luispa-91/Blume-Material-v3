(function(){
  'use strict';
    angular
        .module('angular')
        .service('MetaTags', MetaTags);
        MetaTags.$inject = ['$http', 'APP_INFO'];
        function MetaTags($http, APP_INFO){

            var title = APP_INFO.name;
		      return {
		        title: function() { return title; },
		        setTitle: function(newTitle) { title = newTitle; }
		      };
        }
})();
