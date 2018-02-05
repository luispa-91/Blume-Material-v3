/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angular')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('APP_INFO',{
        'ID': 74,
        'name': 'Blume Demo',
        'directory': 'demoshop',
        'website_url': 'https://demo.madebyblume.com/',
        'gateway': {
            'url': 'http://www.fttserver.com:4217',
            'applicationName': 'SHOPS_TEST',
            'applicationPassword': 'Shops082017%'
        },
        'bac': {
            'key_id': '7185696',
            'processor_id': 'freaks2',
            'applicationPassword': 'CAwDP8vg6wbxP42FS775r6Q8RfB2j2Ep'
        },
        'chat': {
            'order': 'facebook,whatsapp',
            'facebook': '754771351335371',
            'whatsapp': '+50670125006'
        },
        'instagram': {
            'account': 'blumeapps',
            'mode': 'half'
          }
      });
})();
