theApp.controller('profileCtrl', ['$scope', '$state',  function($scope, $state){

    
    $scope.viewProfile = function() {
        $state.go('profile');
    } 
  
    $scope.logout = function(){

        if($state.is('profile')){
            $state.go('home');
        }

    }

    
}]);