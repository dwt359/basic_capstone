theApp.controller('LoginCtrl', ['$scope','LoginAuth', function($scope, LoginAuth){

  $scope.loginWithFacebook = function(){
    LoginAuth.login();
  }

}]);
