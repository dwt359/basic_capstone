var theApp = angular.module('theApp', ['ui.router','ngMaterial']);

//Routing stuff
theApp.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home',{
      url: '/home',
      templateUrl: 'app/components/home/views/homeView.html'
    })

  .state('profile', {
      url: '/profile',
      templateUrl:
      'app/components/profile/views/profile.html'
  })

    .state('dashboard', {
      url: '/dashboard',
      abstract: true,
      templateUrl: 'app/components/dashboard/views/dashboard.html'
    })

      .state('dashboard.begin', {
        url: '',
        templateUrl: 'app/components/dashboard/views/begin.html'
      })

      .state('dashboard.find', {
        url: '/find',
        templateUrl: 'app/components/dashboard/views/searchRide.html'
      })

      .state('dashboard.give', {
        url: '/give',
        abstract: true,
        templateUrl: 'app/components/dashboard/views/createRide.html'
      })

        .state('dashboard.give.info', {
          url: '',
          templateUrl: 'app/components/dashboard/views/createRideInfo.html'
        })

        .state('dashboard.give.pricing',{
          url:'/pricing',
          templateUrl: 'app/components/dashboard/views/createRidePricing.html'
        })



});

theApp.config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
    .primaryPalette('grey',
      {
        'default': '800',
        'hue-1': '500'
      })
    .accentPalette('orange',
      {
        'default': '400',
      });
});

theApp.factory('UserData', function(){
  var data;
  var savedData = localStorage.getItem('user');
  var loggedIn = false;

  if(savedData != null){
    data = JSON.parse(savedData);
    loggedIn = true;
  }

  return{
    getData: function(){
      return data;
    },

    isLoggedIn: function(){
      return loggedIn;
    },

    setData: function(newData){
      data = newData;

      if(localStorage.getItem('user') != null){
        localStorage.clear();
      }

      localStorage.setItem('user', JSON.stringify(data));
      loggedIn = true;
    },

    clearData: function(){
      if(localStorage.getItem('user') != null){
        loggedIn = false;
        localStorage.clear();
      }
    }

  }

});

//This is for the facebook login stuff
theApp.factory('LoginAuth', ['$state', '$mdDialog', 'UserData', function($state, $mdDialog, UserData){
    var ref = new Firebase("https://hitchdatabase.firebaseio.com");
    var currentUser;

    return{
      login: function(){
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            //console.log("Login Failed!", error);
          }
          if (!error) {
            //console.log("Authenticated successfully with payload:", authData);
            UserData.setData(authData);
            $state.go('dashboard.begin');
            $mdDialog.cancel();
          }
        });
      },

      logout: function(){
        UserData.clearData();
      }
    };

  }]);
