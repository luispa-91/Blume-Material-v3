(function(){
  angular
    .module('angular')
    .controller('ContactController',ContactController);
    function ContactController($scope, $http){
	      
	      init();

	   function init(){

		   //Initialize Variables
		   $scope.delivered = false;
		   $scope.loading = false;
		   $scope.contact = {
		   		name: "",
		   		email: "",
		   		message: ""
		   };
		   //Bind functions
		   $scope.sendMessage = sendMessage;
	   }

	   function sendMessage(){
	   		$scope.loading = true;
	   		var company_email = "info@golden-pet.com";
	   		var company_name = "Golden Pet";
	   		var customer_email = $scope.contact.email;
	   		var customer_name = $scope.contact.name;

	   		//build message
	   		var message = "Correo: " + $scope.contact.email + "\n\n"
   						+ "Nombre: " + $scope.contact.name + "\n\n"
						+ "Mensaje: " + $scope.contact.message + "\n\n";

	   		$http({
                  method: "POST",
                  url: "https://central-api.madebyblume.com/v1/mail/contact",
                  params: {
                      company_email: company_email,
                      company_name: company_name,
                      customer_email: customer_email,
                      customer_name: customer_name,
                      message: message
                  },
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              }).then(function (response) {
              		$scope.loading = false;
              		$scope.delivered = true;
                  })
	   }

    }
})();
