(function(){
    'use strict';
      angular
          .module('angular')
          .factory('BlumeStorage', BlumeStorage);
          BlumeStorage.$inject = ['$rootScope','FileUploader','toaster'];
          function BlumeStorage($rootScope,FileUploader,toaster){
  
            var moneyTransferReceipt = {
                url: '/'
            }

            var createImageUploader = function () {
                var uploader = new FileUploader({
                    url: 'https://api2.madebyblume.com/v3/storeFront/moneyTransferReceipt/upload',
                    removeAfterUpload: true
                });

                // FILTERS
                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type) !== -1;
                    }
                });

                // CALLBACKS
                uploader.onBeforeUploadItem = function(item) {
                    item.file.name = moneyTransferReceipt.url + item.file.name; 
                    item.alias = item.file.name.substring(item.file.name.indexOf('/') + 1);
                };
                uploader.onCompleteAll = function() {
                    $rootScope.$emit('uploadComplete');
                    toaster.pop({type: 'success',title: 'Tu comprobante se envió correctamente',body: '',timeout: 3000});
                };

                return uploader;
            }

            var selectedFolder = {value: 'products'};

            var broadcastUploadComplete = function(scope, callback) {
                var handler = $rootScope.$on('uploadComplete', callback);
                scope.$on('$destroy', handler);
            }
  
            return {
                createImageUploader:createImageUploader,
                selectedFolder: selectedFolder,
                broadcastUploadComplete: broadcastUploadComplete,
                moneyTransferReceipt: moneyTransferReceipt
            }
          }
  })();
  