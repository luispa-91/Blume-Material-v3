(function(){
    'use strict';
      angular
          .module('angular')
          .directive('onErrorSend', function() {
            return {
                link: function(scope, element, attrs) {
                  element.bind('error', function() {
                    var lastslashindex = attrs.src.lastIndexOf('/');
                    var result= attrs.src.substring(lastslashindex  + 1).replace(".jpg","");
                    console.log(result);
                  });
                }
            }
        })

        .directive('onErrorSrc', function() {
          return {
              link: function(scope, element, attrs) {
                element.bind('error', function() {
                  if (attrs.src != attrs.onErrorSrc) {
                    attrs.$set('src', attrs.onErrorSrc);
                  }
                });
              }
          }
      })
          .factory('Helper', Helper);
          Helper.$inject = ['$http','$location'];
          function Helper($http,$location){
  
              var currency = function () {
                  return $http.get("https://api2.madebyblume.com/v3/storeFront/currency").then(function (results) {
                      return results.data.data;
                  });
              }

              var googleAnalyticsId = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/googleAnalytics").then(function (results) {
                    return results.data.data;
                });
            }

            var isGrupoCachos = function () {
              var websiteHost = $location.$$host;
              if(websiteHost=='cachoscr.com'||websiteHost=='nmnuevomundo.com'||websiteHost=='foxracingcr.com'||websiteHost=='newwavecr.com'||websiteHost=='beakcr.com'||websiteHost=='freaks.fit') {
                return true;
              } else {
                return false;
              }
            }

            var currentSite = function () {
              return $location.$$host;
            }

            var showWrapGift = function () {
              var websiteHost = $location.$$host;
              if(websiteHost=='killerqueencr.com'||websiteHost=='basicbcr.com'||websiteHost=='woohoo.cr'||websiteHost=='demo.madebyblume.com'||websiteHost=='dieciseiscr.com'||websiteHost=='bajoaqua.com'||websiteHost=='localhost') {
                return true;
              } else {
                return false;
              }
            }

            var currencyExchangeRate = function(){
                return $http.get('https://api.currencylayer.com/live?access_key=fd4afd5638ec7614e784b2975e97b345&source=CRC&currencies=USD&format=1').then(function (results) {
                    return results.data.quotes.CRCUSD;
                });
            }

            var getDeviceFingerprintId = function (merchantID,environment) {  
             
             if (environment.toLowerCase() == 'live') {
               var org_id = 'k8vif92e';
             } else {
                 var org_id = '1snn5n9w';
             }
             
             var sessionID = new Date().getTime();
             
             //One-Pixel Image Code
             var paragraphTM = document.createElement("p");
             var str = "";
             str = "background:url(https://h.online-metrix.net/fp/clear.png?org_id=" + org_id + "&session_id=" + merchantID + sessionID + "&m=1)";
           
             paragraphTM.styleSheets = str;
           
             document.body.appendChild(paragraphTM);
             
             var img = document.createElement("img");
           
             str = "https://h.online-metrix.net/fp/clear.png?org_id=" + org_id + "&session_id=" + merchantID + sessionID + "&m=2";
           
             img.src = str;
             img.alt = "";
             
             document.body.appendChild(img);
             
             //Flash Code
             var objectTM = document.createElement("object");
           
             objectTM.data = "https://h.online-metrix.net/fp/fp.swf?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
           
             objectTM.type = "application/x-shockwave-flash";
             objectTM.width = "1";
             objectTM.height = "1";
             objectTM.id = "thm_fp";
             
             var param = document.createElement("param");
             param.name = "movie";
           
             param.value = "https://h.online-metrix.net/fp/fp.swf?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
               
             objectTM.appendChild(param);
             
             document.body.appendChild(objectTM);
           
             //JavaScript Code
             var tmscript = document.createElement("script");
           
             tmscript.src = "https://h.online-metrix.net/fp/tags.js?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
           
             tmscript.type = "text/javascript";
             
             document.body.appendChild(tmscript);
             
             return sessionID;
            }
            
            function getKountSessionId(){
              return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
              });
            }

            function setSessionId(sessionId){
              var JSLink = "https://ssl.kaptcha.com/collect/sdk?m=790000&s=" + sessionId;
              var JSElement = document.createElement('script');
              JSElement.src = JSLink;
              JSElement.onload = OnceLoaded;
              document.getElementsByTagName('head')[0].appendChild(JSElement);
            }
    
            function OnceLoaded() {
                // Once loaded.. load other JS or CSS or call objects of version.js
                var client = new ka.ClientSDK();
                client.autoLoadEvents();
            }
              
              return {
                currency:currency,
                googleAnalyticsId: googleAnalyticsId,
                isGrupoCachos: isGrupoCachos,
                showWrapGift: showWrapGift,
                currentSite: currentSite,
                getDeviceFingerprintId: getDeviceFingerprintId,
                currencyExchangeRate: currencyExchangeRate,
                getKountSessionId: getKountSessionId,
                setSessionId: setSessionId
              }
          }
  })();
  