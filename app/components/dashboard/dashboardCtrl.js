theApp.controller('dashboardCtrl',  ['$scope', '$state', 'LoginAuth', 'UserData', '$firebaseArray', function($scope, $state, LoginAuth, UserData, $firebaseArray){

  $scope.states = ('AL AZ AR CA CO CT DE FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });

  $scope.starting = {city: "", state: ""};
  $scope.ending = {city: "", state: ""};

  $scope.seats = [{name: 'Seat', description:'', price: 0.00}];
  $scope.seatLimit = 6;

  var ref = new Firebase('https://hitchdatabase.firebaseio.com/trips');
  //This will be queried! (for testing purposes)
  $scope.rides = [];



  $scope.removeSeat = function(i){
    if($scope.seats.length > 1){
      $scope.seats.splice(i, 1);
    }
  }

  $scope.addSeat = function(i){
    if($scope.seats.length < $scope.seatLimit){
      $scope.seats.push({name: 'New Seat', description:'', price: 0.00});
    }
  }


  $scope.viewProfile = function() {
      $state.go('^.^.profile');
  }

  $scope.getUserData = function(){
    return UserData.getData();
  }

  $scope.logout = function(){

    LoginAuth.logout();
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

  $scope.findRides = function(){
    $.ajaxSetup({
      async: false
    });

    var gmapurl1 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.starting.city+"+"+$scope.starting.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";
    var gmapurl2 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.ending.city+"+"+$scope.ending.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";

    var mapCity1 = $scope.getCity(gmapurl1);
    var mapCity2 = $scope.getCity(gmapurl2);

    //Do error checking

    //If there aren't errors:
    var lat1 = $scope.getLat(gmapurl1);
    var long1 = $scope.getLng(gmapurl1);
    var lat2 = $scope.getLat(gmapurl2);
    var long2 = $scope.getLng(gmapurl2);

    $scope.initMap(lat1, lat2, long1, long2);

    //the rides that match that query
    var startCity = $scope.getAdd(gmapurl1).replace(', USA', '');
    $scope.endCity = $scope.getAdd(gmapurl2).replace(', USA', '');
    $scope.rides = $firebaseArray(ref.child(startCity));
  }

  $scope.getLat = function(url){
    var lat;
    $.getJSON(url, function(geocode){
      lat = geocode.results[0].geometry.location.lat;
    });
    return lat;
  }

  $scope.getLng = function(url){
    var lng;
    $.getJSON(url, function(geocode){
      lng = geocode.results[0].geometry.location.lng;
    });
    return lng;
  }

  $scope.getAdd = function(url){
    var address;
    $.getJSON(url, function(geocode){
      address = geocode.results[0].formatted_address;
    });
    return address;
  }

  $scope.getCity = function(url){
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
  }

  $scope.initMap = function(lat1, lat2, lng1, lng2) {
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
  }

  $scope.setSeats = function(){

  }

}]);
