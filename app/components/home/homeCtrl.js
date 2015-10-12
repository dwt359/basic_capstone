theApp.controller('HomePageCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog){

  $scope.showLogin = function(ev){
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/components/home/views/loginFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    });
  };

  $scope.showSignup = function(ev){
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/components/home/views/signupFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
  };
}]);

function DialogController($scope, $mdDialog){
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer){
    $mdDialog.hide(answer);
  };
};

theApp.controller('LoginCtrl', function($scope, $location, $rootScope, $http){
  $scope.loginData = {};

  $scope.verifyLogin = function(){

    //This is where username and password will be verified
    if($scope.loginData.username == "username" && $scope.loginData.password == "password"){
      console.log("Login successful!");
      $rootScope.loggedInUser = $scope.loginData.username;
      $location.path('/dashboard');
    }

    else{
      console.log("Login failed :/");
    }

  };

});

theApp.controller('SignupCtrl', function($scope, $http){
  $scope.signupData = {};

  $scope.verifySignup = function(){

    //This is where the sign up data will be verified
    if(!$scope.signupForm.$valid){
        console.log("Signup unsuccessful");
    }

    else{
      console.log("Signup successful!");
      console.log("Username: "+$scope.signupData.username);
      console.log("Password: "+$scope.signupData.password);
      console.log("Email: "+$scope.signupData.email);
    }
  };

});
