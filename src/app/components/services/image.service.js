(function(){
  'use strict';
  angular
    .module('angular')
    .service('ImageService', ImageService);
    function ImageService(){
      //Configuracion del repositorio de la imagen
      var cloudObj = {
        url: 'https://api.cloudinary.com/v1_1/maraicah/upload',
        data : {
          upload_preset : 'roschisp',
          tags : 'Any',
          context : 'photo=test'
        }
      }
      //Metodo q devuelve la configuracion del repositorio de la imagen
      var getConfiguration = function(){
        return cloudObj;
      }
      //Metodo encargado de recortar la imagen
      var splitImage = function(url){
        var arrUrl = url.split('/');
        url = '';
        for(var i=0; i<arrUrl.length; i++){
          if(i == 6){
            url += 'w_225,h_200/'
          }
          if(i == 7) {
            url += arrUrl[i];
          } else {
            url += arrUrl[i] + '/';
          }
        }
        return url;
      }
      //API publico
      var public_api = {
        getConfiguration : getConfiguration,
        splitImage : splitImage
      };
      return public_api;
    }
})();
