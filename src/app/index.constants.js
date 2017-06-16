/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angular')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('APP_INFO',{
        'ID': 74,
        'name': 'Tiendas Blume',
        'directory': 'demoshop',
        'website_url': 'https://website2.madebyblume.com/',
        'contact': {
        	'email': 'info@madebyblume.com',
        	'address': 'San Jose, Costa Rica.',
        	'phone': '+506 7012 5006'
        }
      });
})();
