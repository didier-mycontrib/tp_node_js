var myAjsApp = angular.module('myAjsApp', []);
 
myAjsApp.controller('DeviseCtrl', function ($scope,$http) {
	
  $scope.onJsonpFct = function (){

  $http.jsonp("http://localhost:8282/devises/"+$scope.numDevise+"?callback=JSON_CALLBACK")
       .success(function(data) {
		    $scope.msg = "http://localhost:8282/devises/4?callback=JSON_CALLBACK with success";
			$scope.data = data;
		  })
	  .error(function (data) {
		$scope.msg = "Request failed";
	  });
	  
  };

});