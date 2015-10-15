theApp.controller('dashboardCtrl', ['$scope', '$state',  function($scope, $state){

  $scope.seats = [{name: 'Seat', description:'', price: 0.00}];

  //This will be queried!
  $scope.rides = [{driver: 'Jacob', seats: [{name: 'Passenger seat', description: 'Cool!', price: '10.00'},
{name: 'Bitch seat', description: 'Have fun!', price: '5.00'}], description: 'Awesomest ride ever!', startCity: 'Columbia',
startState: 'MO', endCity: 'Chicago', endState: 'IL'}, {driver: 'Dan', seats: [{name: 'Cool seat!', description: 'Cool!', price: '9.00'},
{name: 'Middle seat', description: ':P', price: '6.00'}], description: 'Daddy Dans Sedan!', startCity: 'St Louis',
startState: 'MO', endCity: 'Seattle', endState: 'WA'}];

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

    if($state.is('dashboard.find')){
        $state.go('^.^.home');
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
