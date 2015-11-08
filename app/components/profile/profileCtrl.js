theApp.controller('profileCtrl', ['$scope', '$state', 'UserData', 'LoginAuth', '$window', '$mdDialog',
                                  function($scope, $state, UserData, LoginAuth, $window, $mdDialog){
var tabClasses;

    
                                      
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
    
    $scope.openFacebook = function(fid){
        $window.open('http://www.facebook.com/'+fid);
    }

    $scope.logout = function(){
        LoginAuth.logout();
        if($state.is('profile')){
            $state.go('home');
        }

    }

    $scope.showProfile = function(ev){
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/components/profile/views/profileFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    });
  };
                                      
  
  function initTabs() {
    tabClasses = ["","","",""];
  }
  
  $scope.getTabClass = function (tabNum) {
    return tabClasses[tabNum];
  };
  
  $scope.getTabPaneClass = function (tabNum) {
    return "tab-pane " + tabClasses[tabNum];
  }
  
  $scope.setActiveTab = function (tabNum) {
    initTabs();
    tabClasses[tabNum] = "active";
  };
  
  $scope.tab1 = "This is first section";
  $scope.tab2 = "This is SECOND section";
  $scope.tab3 = "This is THIRD section";
  $scope.tab4 = "This is FOUTRH section";
  
  //Initialize 
  initTabs();
  $scope.setActiveTab(1);

    

}]);
