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
  $scope.saveReview = function(){
    if($scope.review.comfort && $scope.review.driver_ability && $scope.review.price_fairness && $scope.review.overall) {
      $scope.review.$save();
      $scope.reviewedRide.$loaded().then(function(){
        $scope.reviewedRide.is_reviewed = true;
        $scope.reviewedRide.$save();
        $scope.retrievePassengerTripData();
      });
      $scope.hide();
    }
    else{
      alert('All fields are required except for the comment.');
    }
  };
  $scope.saveVehicle = function(){

    if($scope.newVehicle.year < 0){
      alert('Please enter valid year.');
    }
    else if($scope.newVehicle.mpg < 1){
      alert('Please enter valid MPG.');
    }
    else if($scope.newVehicle.seats < 1){
      alert('Please enter valid number of seats.');
    }
    else{
      if($scope.newVehicle.make && $scope.newVehicle.model && $scope.newVehicle.year && $scope.newVehicle.mpg && $scope.newVehicle.color && $scope.newVehicle.seats){
        $scope.newVehicle.$save();
        $scope.hide();
      }
      else{
        alert('All fields are required.');
      }
    }

  }
};
