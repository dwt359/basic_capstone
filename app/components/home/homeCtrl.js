theApp.controller('HomeCtrl', ['$scope', '$mdDialog', 'UserData', '$state',
                              function($scope, $mdDialog, UserData, $state){

  if(UserData.isLoggedIn()){
    $state.go('dashboard.begin');
  }

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
