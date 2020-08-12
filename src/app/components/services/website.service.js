(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Website', Website);
        Website.$inject = ['$http','$location','$rootScope'];
        function Website($http,$location,$rootScope){

            var mainPage = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/mainPage").then(function (results) {
                    return results.data.data;
                }, function(err){ });
            }

            var getInstagramFeed = function(accessToken){
                return $http.get('https://graph.instagram.com/me/media?fields=id,timestamp,caption,media_url,permalink&access_token=' + accessToken).then(function (results) {    
                return results.data.data;
                });
            }

            var createChatBubble = function(footer){
                var options = {
                    facebook: footer.chatBubble.facebookPageId, // Facebook page ID
                    whatsapp: footer.chatBubble.whatsapp, // WhatsApp number
                    company_logo_url: footer.logoUrl, // URL of company logo (png, jpg, gif)
                    greeting_message: footer.chatBubble.greetingMessage, // Text of greeting message
                    call_to_action: footer.chatBubble.callToAction, // Call to action
                    button_color: "#129BF4", // Color of button
                    position: "right", // Position may be 'right' or 'left'
                    order: footer.chatBubble.order // Order of buttons
                };
                var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
                var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
                s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
                var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
            }

            var footer = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/footer").then(function (results) {
                    return results.data.data;
                });
            }

            var setFilter = function(filter){
                var newUrl = "";
                var nextIsFilter = true; 
                var isNewFilter = true;
                var url = $location.url().substring(1);
                if(filter.type=="s"){
                    url = "products";
                }
                url = url.replace("?","/");
                url = url.replace(/=/g,"/");
                url = url.replace(/&/g,"/");
                var filterArray = url.split('/');
                newUrl += "/" + filterArray[0];
                filterArray.shift();

                //Build Array
                for (var i = 0; i < filterArray.length; i++) {
                    if(filterArray[i]==filter.type){
                        filterArray[i+1]=filter.criteria;
                        isNewFilter = false;
                    }
                } 
                if(isNewFilter){
                    filterArray.push(filter.type);
                    filterArray.push(filter.criteria);
                }

                //Build Url
                for (var i = 0; i < filterArray.length; i++) {
                    if(nextIsFilter){
                        if(i==0){newUrl += "?" + filterArray[i];} 
                        else {newUrl += "&" + filterArray[i];}
                        nextIsFilter = false;
                    } else {
                        newUrl += "=" + filterArray[i];
                        nextIsFilter = true;
                    }
                }
                $location.url(newUrl);
            }
            
            var removeFilter = function(filter){
                $location.search(filter.type, null);
            }

            var storeLocations = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/storeLocations").then(function (results) {
                    return results.data.data;
                });
            }

            var warehouseList = function () {
                return $http.get("https://api2.madebyblume.com/v3/storeFront/warehouseList").then(function (results) {
                    return results.data.data;
                });
            }

            //-------------- Custom Pages --------------//
            var getCustomPage = function(name){
                var request = {
                    name: name
                }
                return $http.post('https://api2.madebyblume.com/v3/storeFront/customPage',request).then(function (results) {
                    return results.data.data;
                });
            }

            var createBitrixChat = function(){
                (function(w,d,u){
                        var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
                        var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
                })(window,document,'https://cdn.bitrix24.com/b1772825/crm/site_button/loader_6_2nzuxo.js');
            }

            var broadcastUrlChanged = function(scope, callback) {
                var handler = $rootScope.$on('urlChanged', callback);
                scope.$on('$destroy', handler);
            }

            return {
                mainPage: mainPage,
                getInstagramFeed: getInstagramFeed,
                createChatBubble: createChatBubble,
                footer: footer,
                setFilter: setFilter,
                removeFilter: removeFilter,
                storeLocations: storeLocations,
                warehouseList: warehouseList,
                getCustomPage: getCustomPage,
                createBitrixChat: createBitrixChat,
                broadcastUrlChanged: broadcastUrlChanged
            }
        }
})();
