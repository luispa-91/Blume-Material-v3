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
        url: '/products',
        templateUrl: 'app/products/products.view.html',
        controller: 'CatalogController',
        controllerAs: 'vm'
      })
      .state('discounts', {
        url: '/discounts',
        templateUrl: 'app/discounts/discounts.view.html',
        controller: 'DiscountController',
        controllerAs: 'vm'
      })
      .state('product', {
        url: '/product/:product_id',
        templateUrl: 'app/product/product.view.html',
        controller: 'ProductController',
        controllerAs: 'vm'
      })
      .state('checkout.summary', {
        url: '/summary',
        templateUrl: 'app/cart-summary/cart-summary.view.html'
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: 'app/checkout/checkout.view.html'
      })
      .state('checkout.address', {
        url: '/shipping-and-billing-address',
        title: 'Cart Billing & Shipping Address',
        templateUrl: 'app/cart-address/cart-address.view.html'
      })
      .state('checkout.placeOrder', {
        url: '/place-order',
        title: 'Place order',
        templateUrl: 'app/place-order/place-order-view.html'
      })
      .state('checkout.confirmed', {
        url: '/confirmed',
        title: 'Confirmed',
        templateUrl: 'app/cart-confirmed/card-confirmed.view.html',
        controller: 'ConfirmationController',
        controllerAs: 'vm'
      })
        .state('about_us', {
          url: '/about-us',
          title: 'About',
          templateUrl: 'app/about/about.view.html',
          controller: 'AboutController',
          controllerAs: 'vm'
        })
        .state('contact', {
          url: '/contact',
          title: 'Contact',
          templateUrl: 'app/contact/contact.view.html'
        })
        .state('blog', {
          url: '/blog',
          title: 'blog',
          templateUrl: 'app/blog/blog.view.html',
          controller: 'BlogController',
          controllerAs: 'vm'
        })
        .state('blog-post', {
          url: '/blog/:post_id',
          templateUrl: 'app/blog/blog-post.view.html',
          controller: 'BlogPostController',
          controllerAs: 'vm'
        })
        .state('store_locator', {
          url: '/puntos-de-venta',
          title: 'Locator',
          templateUrl: 'app/locator/locator.view.html',
          controller: 'LocatorController',
          controllerAs: 'vm'
        })
        .state('cremacion', {
          url: '/cremacion',
          title: 'Cremacion',
          templateUrl: 'app/cremacion/cremacion.view.html'
        })
        .state('preguntas', {
          url: '/preguntas',
          title: 'Preguntas',
          templateUrl: 'app/faq/faq.view.html',
          controller: 'FAQController',
          controllerAs: 'vm'
        })
        .state('proveedor', {
          url: '/proveedor',
          title: 'Proveedor',
          templateUrl: 'app/proveedor/proveedor.view.html',
          controller: 'ContactController',
          controllerAs: 'vm'
        })
        .state('external', {
            url: '/admin',
            externalUrl: 'https://shops.madebyblume.com'
        })
        .state('collection', {
          url: '/collection/:name',
          title: 'Collection',
          templateUrl: 'app/collection/collection.view.html',
          controller : 'CollectionController',
          controllerAs: 'vm'
        });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
})();
