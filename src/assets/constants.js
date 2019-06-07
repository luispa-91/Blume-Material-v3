/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angular')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('APP_INFO',{
        'ID': 74,
        'name': 'Demo Tienda',
        'directory': 'demoshop',
        'website_url': 'http://localhost:3000/checkout/confirmed',
        'international_shipping': true,
        'gateway': {
            'url': 'http://www.fttserver.com:4217',
            'applicationName': 'SHOPS_TEST',
            'applicationPassword': 'Shops082017%'
        },
        'bac': {
            'url': 'https://paycom.credomatic.com/PayComBackEndWeb/common/requestPaycomService.go',
            'key_id': '93458250',
            'processor_id': 'INET5598',
            'applicationPassword': 'ANKT75RcYU2Pek61rRl9L8HSbkKs4nQy'
        },
        'chat': {
            'order': 'facebook,whatsapp',
            'facebook': '754771351335371',
            'whatsapp': '+50670125006',
            'shortMessage': 'Envíenos un mensaje',
            'longMessage': 'Necesita ayuda? Escríbanos y estaremos en contacto pronto'
        },
        'instagram': {
            'account': 'blumeapps',
            'mode': 'half'
          }
      });
})();
