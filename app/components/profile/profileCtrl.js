theApp.controller('profileCtrl', ['$scope', '$state', 'UserData', 'LoginAuth',
                                  function($scope, $state, UserData, LoginAuth){

    $scope.viewProfile = function() {
        $state.go('profile');
    }

    $scope.getUserData = function(){
      return UserData.getData();
    }

    $scope.logout = function(){
        LoginAuth.logout();
        if($state.is('profile')){
            $state.go('home');
        }

    }


}]);
