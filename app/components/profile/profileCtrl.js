theApp.controller('profileCtrl', ['$scope', '$state', 'UserData', 'LoginAuth', '$window',
                                  function($scope, $state, UserData, LoginAuth, $window){

    $scope.viewProfile = function() {
        $state.go('profile');
    }
    
    $scope.viewDashboard = function() {
        $state.go('home');    
        
    }



    $scope.getUserData = function(){
    console.log(UserData.getData());
      return UserData.getData();
    }
    
    $scope.openFacebook = function(){
        $window.open($scope.getUserData().facebook.cachedUserProfile.link);        
    }

    $scope.logout = function(){
        LoginAuth.logout();
        if($state.is('profile')){
            $state.go('home');
        }

    }


}]);
