(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Delivery', Delivery);
        Delivery.$inject = ['$http', '$state', 'NgMap', 'ngCart', '$rootScope', 'APP_INFO'];
        function Delivery($http, $state, NgMap, ngCart, $rootScope, APP_INFO){

          var clickedMap = false;
          var settings = {};
          var pickup_in_store = false;

          var mapClick = function (e){
              destination_coords.lat = parseFloat(e.latLng.lat());
              destination_coords.lng = parseFloat(e.latLng.lng());
              clickedMap = true;
              getLocation(destination_coords.lat, destination_coords.lng);
              $rootScope.$emit('notifying-service-event');
          }

          var placeLookup = function () {
              var place = this.getPlace();
              destination_coords.lat = place.geometry.location.lat();
              destination_coords.lng = place.geometry.location.lng();
              NgMap.getMap().then(function(map) { 
                var map = map; 
                map.setCenter(place.geometry.location);
              });
              clickedMap = false;
              getLocation(destination_coords.lat, destination_coords.lng);
              $rootScope.$emit('notifying-service-event');
          }

          var dragDestination = function (e){
            destination_coords.lat = parseFloat(e.latLng.lat());
            destination_coords.lng = parseFloat(e.latLng.lng());
            clickedMap = true;
            getLocation(destination_coords.lat, destination_coords.lng);
            $rootScope.$emit('notifying-service-event');
          }

          var getLocation = function (lat, lng){
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({ 'latLng': latlng }, function (data, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  if (data[1]) {
                      //Set address information based on coordinates
                      address.country = data[data.length-1].formatted_address;
                      address.state = data[data.length-2].address_components[0].long_name;
                      address.city = data[data.length-3].address_components[0].long_name;
                      address.address2 = '['+ lat +','+ lng +']';
                      if(clickedMap){
                        address.address = data[0].formatted_address;
                      }
                  }
              }
            });
            calculateShipping();
          }

          var toggleDelivery = function(pickup_in_store){
            if(pickup_in_store || destination_coords.lat == ''){
              ngCart.setShipping(0);
            } else {
              calculateShipping();
            }
          }

          var calculateShipping = function(){
            
            //Get delivery distance
            getDistance();

            //Calculate shipping price based on distance and weight
            if(destination_coords.delivery_type == 'multidomicilio'){
              distanceBasedPricing();
            } else if(destination_coords.delivery_type == 'correosdecostarica'){
              weightBasedPricing();
            }

          }

          var distanceBasedPricing = function(){
            //Initialize variables
            var base_price = 0;
            var base_km = 2.5; 
            var additional_km = 0;
            var additional_km_price = 0;
            var price = 0;

            //Set base price and additional distance price
            if(settings.currency == 'USD'){
              base_price = 5;
              additional_km_price = 0.2;
            } else {
              base_price = 2250;
              additional_km_price = 100;
            }
            //Calculate additional distance
            if(destination_coords.distance > base_km){
              additional_km = Math.ceil(destination_coords.distance - base_km);
            }

            //Calculate price
            price = base_price + (additional_km * additional_km_price);
            //Set cart shipping
            ngCart.setShipping(price);

          }

          var weightBasedPricing = function(){

            //Initialize variables
            var base_price = 0;
            var base_weight = 2; 
            var additional_weight = 0;
            var additional_weight_price = 0;
            var price = 0;

            //Set base price and additional weight price
            if(settings.currency == 'USD'){
              base_price = 5;
              additional_weight_price = 2;
            } else {
              base_price = 2250;
              additional_weight_price = 1100;
            }

            //Get package weight
            var weight = ngCart.getTotalWeight();

            //Calculate additional weight
            if(weight > base_weight){
              additional_weight = Math.ceil(weight - base_weight);
            }

            //Calculate price
            price = base_price + (additional_weight * additional_weight_price);

            //Set cart shipping
            ngCart.setShipping(price);

          }

          var getDistance = function(){
            var origin = new google.maps.LatLng(settings.latitude, settings.longitude);
            var destination = new google.maps.LatLng(destination_coords.lat, destination_coords.lng);
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING',
                avoidHighways: false,
                avoidTolls: false,
              }, callback);

            function callback(response, status) {
              destination_coords.distance = response.rows[0].elements[0].distance.value / 1000;
            }
          }

          var broadcastShippingCost = function(scope, callback) {
              var handler = $rootScope.$on('notifying-service-event', callback);
              scope.$on('$destroy', handler);
          }

          var syncCustomerAddress = function(){
            customer_address.city = address.city;
            customer_address.state = address.state;
            customer_address.country = address.country;
            customer_address.address = address.address;
            customer_address.address2 = address.address2;
            customer_address.zip_code = address.zip_code;
            customer_address.note = address.note;
          }

          var syncBillingAddress = function(){
            billing_information.address = address.address;
            billing_information.city = address.city;
            billing_information.zipCode = address.zip_code;
            billing_information.state = address.state;
            billing_information.country = address.country;
          }

          function currentLocation(){
            var options = {
                              enableHighAccuracy: true
                          };

              navigator.geolocation.getCurrentPosition(function(pos) {
                              var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                              destination_coords.lat = pos.coords.latitude;
                              destination_coords.lng = pos.coords.longitude;
                              NgMap.getMap().then(function(map) { 
                                var map = map; 
                                map.setCenter(position);
                              });
                              clickedMap = true;
                              getLocation(destination_coords.lat, destination_coords.lng);
                              $rootScope.$emit('notifying-service-event');                 
                          }, 
                          function(error) {                    
                              alert('Unable to get location: ' + error.message);
                          }, options);
          }

          var getSettings = function () {
                return $http.get('https://central-api.madebyblume.com/v1/website/settings/delivery?company_id=' + APP_INFO.ID).then(function (results) {
                    
                    settings = results.data;
                    return results.data;
                });
            };

          var calculateExportShipping = function(country){

            var weight = Math.ceil(ngCart.getTotalWeight());
            var price = 0;
            var base_price = 0;
            var base_weight = 0.1;
            var additional_weight = 0;
            var additional_weight_price = 0;

            

            if(country.continent=='Central America'){

              //Set base price and additional weight price
              if(settings.currency == 'USD'){
                base_price = 2;
                additional_weight_price = 1.9;
              } else {
                base_price = 1100;
                additional_weight_price = 1050;
              }

            } else if(country.continent=='North America' || country.continent=='South America' || country.continent=='Antillas'){
              
              //Set base price and additional weight price
              if(settings.currency == 'USD'){
                base_price = 2.5;
                additional_weight_price = 2.2;
              } else {
                base_price = 1400;
                additional_weight_price = 1250;
              }

            } else if(country.continent=='Europe'){
              
              //Set base price and additional weight price
              if(settings.currency == 'USD'){
                base_price = 4;
                additional_weight_price = 3.8;
              } else {
                base_price = 2100;
                additional_weight_price = 1950;
              }

            } else if(country.continent=='Asia' || country.continent=='Africa' || country.continent=='Oceania'){
              
              //Set base price and additional weight price
              if(settings.currency == 'USD'){
                base_price = 5.2;
                additional_weight_price = 4.9;
              } else {
                base_price = 2750;
                additional_weight_price = 2550;
              }

            }

            //Calculate additional weight
            if(weight > base_weight){
              additional_weight = Math.ceil(weight - base_weight);
            }

            //Calculate price
            price = base_price + (additional_weight * additional_weight_price);
              if(settings.currency == 'USD'){
                price += 1.6;
              } else {
                price += 850;
              }

            address.country = country.name;

            //Set cart shipping
            ngCart.setShipping(price);

          }

          var destination_coords = {
            lat: '',
            lng: '',
            distance: 0,
            delivery_type: 'multidomicilio'
          }

          var billing_address = {
            country: '',
            state: '',
            city: '',
            zip_code: '',
            address: ''
          }

          var customer = {
            id: APP_INFO.ID,
            full_name: '',
            email: '',
            phone: '',
            subscribed_newsletter: false
          }

          var address = {
            city: '',
            state: '',
            country: '',
            zip_code: '',
            address: '',
            address2: '',
            note: '',
            status: 'Standby',
            shipmentUpdates: [
              {
                location: 'En tienda',
                status: 'Standby',
                last_update: ''
              }
            ]
          }

          var billing_information = {
            address: '',
            city: '',
            zipCode: '',
            state: '',
            country: '',
            name: '',
            email: '',
            phoneNumber: '',
            total: 0,
            order_id: 0,
            currency: ''
          }

          var customer_address = {
            id: 0,
            city: '',
            state: '',
            country: '',
            address: '',
            address2: '',
            zip_code: '',
            note: ''
          }

            return {
              mapClick: mapClick,
              placeLookup: placeLookup,
              dragDestination: dragDestination,
              toggleDelivery: toggleDelivery,
              calculateShipping: calculateShipping,
              getLocation: getLocation,
              broadcastShippingCost: broadcastShippingCost,
              getSettings: getSettings,
              customer: customer,
              address: address,
              destination_coords: destination_coords,
              billing_address: billing_address,
              billing_information: billing_information,
              customer_address: customer_address,
              syncCustomerAddress: syncCustomerAddress,
              syncBillingAddress: syncBillingAddress,
              distanceBasedPricing: distanceBasedPricing,
              weightBasedPricing: weightBasedPricing,
              currentLocation: currentLocation,
              calculateExportShipping: calculateExportShipping,
              pickup_in_store: pickup_in_store
            }
        }
})();
