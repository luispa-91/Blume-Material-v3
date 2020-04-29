(function(){
'use strict';
    angular
    .module('angular')
    .factory('Personalization', Personalization);
    Personalization.$inject = [];
    function Personalization(){

        var navbar = function(site){
            var theme = {
            topbar: {
                'background-color': '#000',
                'color': '#ffffff',
                'font-family': 'Camphor'
                },
                navbar: {
                'background-color': '#fff',
                'color': '#000',
                'font-family': 'Camphor'
                }
            }
            //Ruta Urbana
            if(site=="rutaurbana.com"){
                theme.topbar["background-color"] = "#275A53";
            } else if(site=="bajoaqua.com"){
                theme.topbar["background-color"] = "#e8ba90";
            } else if(site=="antonellaboutiquecr.com"){
                theme.topbar["background-color"] = "#d5a8af";
            }

            return theme;
        }


        var footer = function(site){
            var theme = {
                footer: {
                    'background-color': '#fff',
                    'color': '#000',
                    'font-family': 'Camphor'
                }
            }
            //Ruta Urbana
            if(site=="rutaurbana.com"){
                theme.footer["background-color"] = "#F1F1F1";
            }

            return theme;
        }

        var mainPageBanners = function(site){
            var banners = {};
            if(site=="nmnuevomundo.com"){
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannernmmid.jpg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              } else if(site=="cachoscr.com"){
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannermidcachos.jpg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              } else if(site=="dieciseiscr.com"){
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannermidDieciseis.jpeg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              }
              else if(site=="antonellaboutiquecr.com"){
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannerBotAntonella.png',
                      linkUrl: '/sale',
                      style: 'full'
                    }
                  ]
                }
              }
              else if(site=="mare.cr"){
                banners = {
                  sectionOne: [
                    {
                        imageUrl: 'assets/images/bannerMidMare1.jpg',
                        linkUrl: '#',
                        style: 'full'
                    },
                    {
                        imageUrl: 'assets/images/bannerMidMare2.jpg',
                        linkUrl: '#',
                        style: 'full'
                    },
                    {
                        imageUrl: 'assets/images/bannerMidMare3.jpg',
                        linkUrl: '#',
                        style: 'full'
                    }
                  ]
                }
              }
              return banners;
        }

        return {
            navbar: navbar,
            footer: footer,
            mainPageBanners: mainPageBanners
        }
    }
  })();
  