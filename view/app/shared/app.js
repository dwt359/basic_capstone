var theApp = angular.module('theApp', ['ngRoute','ngMaterial']);

//Routing stuff
theApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/',{
      templateUrl: 'app/components/home/views/homeView.html',
      controller: function($scope){

      }
    })

    .otherwise({redirectTo: '/'});
}]);
