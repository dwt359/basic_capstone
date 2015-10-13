theApp.controller('dashboardCtrl', ['$scope', '$state',  function($scope, $state, $rootScope, $http){
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
}]);
