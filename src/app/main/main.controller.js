(function() {
  'use strict';

  angular
    .module('angular')
    .controller('MainController', MainController);
    
  MainController.$inject = ['Website', 'Mail','Helper'];
  function MainController(Website, Mail, Helper) {
    var vm = this;

    init();

    function init(){

      //Initialize variables
      vm.carousel = [];
      vm.instagramFeed = {};
      vm.banners = [];
      vm.featuredCollections = [];
      vm.featuredProducts = [];
      vm.currency = {value: '', symbol: ''}; 
      vm.site = Helper.currentSite();
      vm.timestamp = new Date().getTime();
      vm.loadingPage = true;

      //Load MainPage
      Website.mainPage().then(function (data) { 
        vm.carousel = data.slides;
        vm.featuredLists = data.featured;
        vm.currency.value = data.currency;
        if(vm.currency.value=='USD'){vm.currency.symbol='$'} else {vm.currency.symbol='₡'};
        //Load Instagram Feed
        Website.getInstagramFeed(data.instagramAccessToken).then(function (data) { vm.instagramFeed.limit = 8; vm.instagramFeed.posts = data; },function(err){ Mail.errorLog(err) });
        vm.loadingPage = false;
      },function(err){ Mail.errorLog(err) });

      //Load FullWidthBanners
      // vm.banners = [{imageUrl:'https://source.unsplash.com/random/960x500',linkUrl:'/products',text:'<h2>Título Ejemplo<h2><p>Este es el texto de ejemplo. Este es el texto de ejemplo. Este es el texto de ejemplo.<p>',style:'textRight'},{imageUrl:'https://source.unsplash.com/random/1920x500',linkUrl:'/products',text:'',style:'imageFull'},{imageUrl:'https://source.unsplash.com/random/960x500',linkUrl:'/products',text:'<h2>Título Ejemplo<h2><p>Este es el texto de ejemplo. Este es el texto de ejemplo. Este es el texto de ejemplo.',style:'textLeft'}];

      //Load Featured Collection Links
      //Temporarily disabled -> Make a good looking example before launch
    }

  }
})();
