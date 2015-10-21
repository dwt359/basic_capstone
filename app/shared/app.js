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


