theApp.controller('dashboardCtrl', ['$scope', '$state',  function($scope, $state){

  $scope.seats = [{name: 'New Seat', description:'', price: 0.00}];

  $scope.removeSeat = function(i){
    if($scope.seats.length > 1){
      $scope.seats.splice(i, 1);
    }
  }

  $scope.addSeat = function(i){
    if($scope.seats.length < 10){
      $scope.seats.push({name: 'New Seat', description:'', price: 0.00});
    }
  }

  $scope.logout = function(){

    //More janky routing crap
    if($state.is('dashboard.begin')){
      $state.go('home');
    }

    if($state.is('dashboard.give.info') || $state.is('dashboard.give.pricing')){
      $state.go('^.^.^.home');
    }
  }

  $scope.verifyInfo = function(){
    //Verify ride info stuff here

    $state.go('^.pricing')
  }

  $scope.setSeats = function(){

  }

}]);
