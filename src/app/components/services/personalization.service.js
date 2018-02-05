(function() {
    'use strict';

    angular
        .module('angular')
        .service('Personalization', Personalization);

    Personalization.$inject = ['$http','APP_INFO'];
    function Personalization($http,APP_INFO) {

        var serviceBase = 'https://central-api.madebyblume.com/';
        var Personalization = {};



        var styles = {
            titles: {
              'color': 'black'
            },
            menu: {
              'background-color': 'white'
            }
          }

        Personalization.styles = styles;

        return Personalization;

    }

})();
