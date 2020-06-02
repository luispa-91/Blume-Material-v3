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
            switch(site){
              case "rutaurbana.com":
                theme.topbar["background-color"] = "#275A53";
                break;
              case "bajoaqua.com":
                theme.topbar["background-color"] = "#e8ba90";
                break;
              case "antonellaboutiquecr.com":
                theme.topbar["background-color"] = "#d5a8af";
                break;
              case "mare.cr":
                theme.topbar["background-color"] = "#c3b48b";
                break;
              case "desinid.madebyblume.com":
                theme.topbar["background-color"] = "#f46a17";
                break;
              case "maky.madebyblume.com":
                theme.topbar["background-color"] = "#2e2f7f";
                theme.topbar["font-family"] = "Roboto Mono";
                theme.navbar["font-family"] = "Roboto Mono";
                break;
              case "elmercatico.com":
                theme.topbar["background-color"] = "#2E3192";
                break;
              case "coolbandscr.com":
                theme.topbar["background-color"] = "#fff";
                theme.topbar["color"] = "#000";
                break;
              case "pasocacr.com":
                theme.topbar["background-color"] = "#5cb5e5";
                break;
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
            
            switch(site){
              case "rutaurbana.com":
                theme.footer["background-color"] = "#F1F1F1";
              break;
              case "coolbandscr.com":
                theme.footer["background-color"] = "#ff807f";
                theme.footer["color"] = "#036780";
              break;
              case "maky.madebyblume.com":
                theme.footer["font-family"] = "Roboto Mono";
              break;
            }

            return theme;
        }

        var customStyles = function(site){
          var theme = {
            'background-color': '#fff',
            'color': '#000',
            'font-family': 'Camphor'
          }
          
          switch(site){
            case "maky.madebyblume.com":
              theme["font-family"] = "Roboto Mono";
            break;
          }

          return theme;
      }

        var mainPageBanners = function(site){
            var banners = {};
            switch(site){
              case "nmnuevomundo.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannernmmid.jpg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "cachoscr.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannermidcachos.jpg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "tiendavertigo.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/vertigo-banner-mid.jpg',
                      linkUrl: '#',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "dieciseiscr.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannermidDieciseis.jpeg',
                      linkUrl: '/products',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "antonellaboutiquecr.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannerBotAntonella.png',
                      linkUrl: '/sale',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "desinid.madebyblume.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannerBotDesinid.png',
                      linkUrl: '/sale',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "elmercatico.com":
                banners = {
                  sectionTwo: [
                    {
                      imageUrl: 'assets/images/bannerBotMercatico.jpg',
                      linkUrl: '#',
                      style: 'full'
                    }
                  ]
                }
              break;
              case "mare.cr":
                banners = {
                  sectionOne: [
                    {
                        imageUrl: 'assets/images/bannerMidMare0.jpg',
                        linkUrl: '#',
                        style: 'full'
                    },
                    {
                        imageUrl: 'assets/images/bannerMidMare1.jpg',
                        linkUrl: '#',
                        style: 'full'
                    },
                    {
                        imageUrl: 'assets/images/bannerMidMare2.jpg',
                        linkUrl: '#',
                        style: 'full'
                    }
                  ]
                }
              break;
              case "coolbandscr.com":
                banners = {
                  sectionOne: [
                    {
                        imageUrl: 'assets/images/bannerMasCategoriasCoolbands.png',
                        linkUrl: '/info/mascategorias',
                        style: 'full'
                    },
                    {
                        imageUrl: 'assets/images/bannerMidCoolbands.jpg',
                        linkUrl: '/info/puntosdeventa',
                        style: 'full'
                    }
                  ]
                }
              break;
            }
            
            return banners;
        }

        return {
            navbar: navbar,
            footer: footer,
            customStyles: customStyles,
            mainPageBanners: mainPageBanners
        }
    }
  })();
  