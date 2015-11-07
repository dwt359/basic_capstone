var theApp = angular.module('theApp', ['ui.router','ngMaterial', 'firebase']);

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
    .accentPalette('light-blue',
      {
        'default': '900',
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

theApp.factory('GoogleMaps', function(){

  return{
    getLat: function(url){
      var lat;
      $.getJSON(url, function(geocode){
        lat = geocode.results[0].geometry.location.lat;
      });
      return lat;
    },

    getLng: function(url){
      var lng;
      $.getJSON(url, function(geocode){
        lng = geocode.results[0].geometry.location.lng;
      });
      return lng;
    },

    getAdd: function(url){
      var address;
      $.getJSON(url, function(geocode){
        address = geocode.results[0].formatted_address;
      });
      return address;
    },

    getCity: function(url){
      var type;
      var city;
      $.getJSON(url, function(geocode){
        type = geocode.results[0].address_components[0].types[0];
        city = geocode.results[0].address_components[0].short_name;
          if (type == "locality"){
            return city;
          }
          else{
            city = 0;
            return city;
          }
      });
    },

    initMap: function(lat1, lat2, lng1, lng2) {
      var LocationStart = {lat: lat1, lng: lng1};
      var LocationEnd = {lat: lat2, lng: lng2};

      var map = new google.maps.Map(document.getElementById('map'), {
        center: LocationStart,
        scrollwheel: false,
        zoom: 7
      });

      var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      });

      // Set destination, origin and travel mode.
      var request = {
        destination: LocationEnd,
        origin: LocationStart,
        travelMode: google.maps.TravelMode.DRIVING
      };

      // Pass the directions request to the directions service.
      var directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          // Display the route on the map.
          directionsDisplay.setDirections(response);
          //distance

          //var distance = response.routes[0].legs[0].distance.value;
          //displayInfo(distance);

        }
      });
    },

    loadDefault: function(){
      var map = new google.maps.Map(document.getElementById("map"), {
        scrollwheel: false,
      });
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({'address': 'US'}, function (results, status) {
         var ne = results[0].geometry.viewport.getNorthEast();
         var sw = results[0].geometry.viewport.getSouthWest();

         map.fitBounds(results[0].geometry.viewport);
      });
    }

  };
});
