(function(){
  'use strict';
    angular
        .module('angular')
        .factory('Mail', Mail);
        Mail.$inject = ['toaster','$http'];
        function Mail(toaster,$http){

          var sendEmail = function (orderId,paymentStatus) {
            
            var request = {
                orderId: orderId,
                type: ''
            }
            switch(paymentStatus){
              case "pending": 
                request.type="placed";
                break;
              case "complete": 
                request.type="approved";
                break;
              case "declined": 
                request.type="declined";
                break;
              default:
                request.type="placed";
                break;
            }

              return $http.post("https://api2.madebyblume.com/v3/notifications/mail/order/receipt",request).then(function (results) {
                toaster.pop({type: 'success',title: 'Correo enviado',body: '',timeout: 3000});
                  return results.data.data;
              },function(err){ });
          }

          var sendOrderDetails = function(){
              toaster.pop({type: 'success',title: 'Correo enviado',body: 'Si necesita ayuda puede contactarnos por correo o chat',timeout: 3000});
          }

            return {
              sendEmail: sendEmail,
              sendOrderDetails: sendOrderDetails
            }
        }
})();
