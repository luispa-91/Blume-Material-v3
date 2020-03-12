(function() {
  'use strict';

  angular
    .module('angular')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('products', {
        url: '/products?productType&gender&brand&size&color&s',
        templateUrl: 'app/products/products.view.html',
        params: {
          productType: {squash:true},
          gender: {squash:true},
          brand: {squash:true},
          size: {squash:true},
          color: {squash:true},
          s: {squash:true}
        },
        controller: 'ProductsController',
        controllerAs: 'vm'
      })
      .state('keds', {
        url: '/keds',
        templateUrl: 'app/products/products.view.html',
        controller: 'ProductsController',
        controllerAs: 'vm'
      })
      .state('sale', {
        url: '/sale?productType&gender&brand&size&color',
        templateUrl: 'app/products/products.view.html',
        params: {
          productType: {squash:true},
          gender: {squash:true},
          brand: {squash:true},
          size: {squash:true},
          color: {squash:true}
        },
        controller: 'ProductsController',
        controllerAs: 'vm'
      })
      .state('product', {
        url: '/product?referenceCode&colorCode',
        templateUrl: 'app/product/product.view.html',
        params: {
          referenceCode: {squash:true},
          colorCode: {squash:true}
        },
        controller: 'ProductDetailController',
        controllerAs: 'vm'
      })
      .state('cartReview', {
        url: '/cartReview?orderId',
        templateUrl: 'app/cartReview/cartReview.view.html',
        params: {
          orderId: {squash:true}
        }
      })
      .state('checkout', {
        url: '/checkout?customerId',
        templateUrl: 'app/checkout/checkout.view.html',
        params: {
          customerId: {squash:true}
        }
      })
      .state('paymentNotification', {
        url: '/payment/:paymentMethod?orderStatus&lastFour&orderid&response_code&responsetext&authcode&transactionid&hash',
        title: 'Notificación del Pago',
        templateUrl: 'app/paymentNotification/paymentNotification.view.html',
        params: {
          orderStatus: {squash:true},
          orderid: {squash:true},
          response_code: {squash:true},
          responsetext: {squash:true},
          authcode: {squash:true},
          transactionid: {squash:true},
          lastFour: {squash:true},
          hash: {squash:true}
        },
        controller: 'PaymentNotificationController',
        controllerAs: 'vm'
      })
      .state('paymentNotificationPayPal', {
        url: '/payment/paypal/:paymentStatus',
        title: 'Notificación del Pago',
        templateUrl: 'app/paymentNotification/paymentNotification.view.html',
        controller: 'PaymentNotificationController',
        controllerAs: 'vm'
      })
      .state('paymentNotificationCybersource', {
        url: '/payment/cybersource/:paymentStatus',
        title: 'Notificación del Pago',
        templateUrl: 'app/paymentNotification/paymentNotification.view.html',
        controller: 'PaymentNotificationController',
        controllerAs: 'vm'
      })
      .state("paymentNotificationFttech", {
        url: "/payment/fttech/:paymentStatus&orderId=:orderId",
        title: "Notificación del Pago",
        templateUrl: "app/paymentNotification/paymentNotification.view.html",
        controller: "PaymentNotificationController",
        controllerAs: "vm"
      })
    .state("paymentNotificationCredix", {
        url: "/payment/credix/:paymentStatus?hash&referencia",
        title: "Notificación del Pago",
        templateUrl: "app/paymentNotification/paymentNotification.view.html",
        controller: "PaymentNotificationController",
        controllerAs: "vm",
        params: {
          hash: {squash:true},
          referencia: {squash:true}
        }
      })
        .state('informationPage', {
          url: '/info/:pageName',
          title: 'Página Informativa',
          templateUrl: 'app/informationPage/informationPage.view.html',
          controller: 'InformationPageController',
          controllerAs: 'vm'
        })
        .state('promoSelina', {
          url: '/promoselina',
          title: 'Promo Selina',
          templateUrl: 'app/informationPage/informationPage.view.html',
          controller: 'InformationPageController',
          controllerAs: 'vm'
        })
        .state('storeLocations', {
          url: '/storeLocations',
          title: 'Puntos de Venta',
          templateUrl: 'app/storeLocator/storeLocator.view.html',
          controller: 'StoreLocatorController',
          controllerAs: 'vm'
        })
        .state('privacyPolicy', {
          url: '/politica-de-privacidad',
          title: 'Politicas de Privacidad',
          templateUrl: 'app/components/partials/privacyPolicy.html'
        })
        .state('termsAndConditions', {
          url: '/terminos-y-condiciones',
          title: 'Términos y Condiciones',
          templateUrl: 'app/components/partials/termsAndConditions.html'
        })
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
})();
