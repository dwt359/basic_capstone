
theApp.controller('dashboardCtrl',  ['$scope', '$timeout', '$state', 'LoginAuth', 'UserData', 'GoogleMaps', '$firebaseArray', '$firebaseObject', '$mdDialog',                                    function($scope, $timeout, $state, LoginAuth, UserData, GoogleMaps, $firebaseArray, $firebaseObject, $mdDialog){

  //$timeout(GoogleMaps.loadDefault(), 3000);

  $scope.states = ('AL AZ AR CA CO CT DE FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });


  $scope.rating = [1, 2, 3, 4, 5];

  $scope.starting = {city: "", state: ""};
  $scope.ending = {city: "", state: ""};
  $scope.car = {mpg: "", seats: ""};
  $scope.departure = {date: "", time: ""}
  $scope.search = {date: ""}
  $scope.post = {description: ""}

  $scope.seats = [{name: 'Seat', description:'', price: 0.00}];
  $scope.seatLimit = 6;

  var ref = new Firebase('https://hitchdatabase.firebaseio.com');
  var tripRef = ref.child('trips');
  var userRef = ref.child('users');
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

  $scope.viewDashboard = function() {
        $state.go('home');

  }

  $scope.showProfile = function(ev, fid){
    $scope.viewedProfileInfo = $firebaseObject(userRef.child(fid));
    $scope.profileReviews = [];
    var profileReviews = $firebaseArray(userRef.child(fid).child('reviews'));
    var reviewerProfiles = [];
    profileReviews.$loaded().then(function(){
      angular.forEach(profileReviews, function(review, id){
        reviewerProfiles.push($firebaseObject(userRef.child(review.$id)));
        reviewerProfiles[id].$loaded().then(function(){
          $scope.profileReviews.push({
            name: reviewerProfiles[id].name,
            img_url: reviewerProfiles[id].img_url,
            driver_ability: review.driver_ability,
            comfort: review.comfort,
            price_fairness: review.price_fairness,
            overall: review.overall,
            comment: review.comment
          });
        });
      });
    });
    $mdDialog.show({
      controller: DialogController,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'app/components/profile/views/profileFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }
  
 

  $scope.showPayment = function(ev, ride, i){
    $mdDialog.show({
      controller: PaymentDialogController,
      templateUrl: 'app/components/dashboard/views/find/payment.php',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        ride: ride
      }
    });
  }

  $scope.getProfileData = function(){
    return UserData.getProfileData();
  }

  $scope.retrievePassengerTripData = function(){
    var profileData = $scope.getProfileData();
    profileData.$loaded().then(function() {
      $scope.tripData = [];
      var trips = profileData.passenger_trips;
      var item = [];
      var person = [];
      if (!!trips.length){
        angular.forEach(trips, function (trip, id) {
          item.push($firebaseObject(tripRef.child(trip.from).child(trip.to).child(trip.num)));
          item[id].$loaded().then(function () {
            var startTime = new Date(item[id].start_time);
            var pad = '00';
            item[id].start_time = (startTime.getMonth() + 1) + '/' + startTime.getDate() + '/' + startTime.getFullYear() + ' at ' + startTime.getHours() + ':' + pad.substring(0, pad.length - startTime.getMinutes().toString().length) + startTime.getMinutes().toString();
            item[id].from = trip.from;
            item[id].to = trip.to;
            person.push($firebaseObject(userRef.child(item[id].user)));
            person[id].$loaded().then(function () {
              item[id].img_url = person[id].img_url;
              $scope.tripData.push(item[id]);
            });
          });
        });
      }
    });
  }

  $scope.getProfileData = function(){
    return UserData.getProfileData();
  }

  $scope.retrievePassengerTripData = function(){
    $scope.now = (new Date()).getTime();
    var profileData = $scope.getProfileData();
    profileData.$loaded().then(function(){
      $scope.tripData = [];
      var trips = profileData.passenger_trips;
      var item = [];
      var person = [];
      angular.forEach(trips, function(trip, id){
        item.push($firebaseObject(tripRef.child(trip.from).child(trip.to).child(trip.num)));
        item[id].$loaded().then(function(){
          var startTime = new Date(item[id].start_time);
          var pad = '00';
          item[id].start_time = (startTime.getMonth()+1) + '/' + startTime.getDate() + '/' + startTime.getFullYear() + ' at ' + startTime.getHours() + ':' + pad.substring(0, pad.length - startTime.getMinutes().toString().length) + startTime.getMinutes().toString();
          item[id].from = trip.from;
          item[id].to = trip.to;
          item[id].is_reviewed = trip.is_reviewed;
          item[id].passenger_trip_id = id;
          item[id].time_num = startTime.getTime();
          person.push($firebaseObject(userRef.child(item[id].user)));
          person[id].$loaded().then(function(){
            item[id].img_url = person[id].img_url;
            $scope.tripData.push(item[id]);
          });
        });
      });
    });
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

    if($state.is('dashboard.post.info') || $state.is('dashboard.post.pricing')){
      $state.go('^.^.^.home');
    }
  }

  $scope.verifyInfo = function(){
    //Verify ride info stuff here

    $state.go('^.pricing')
  }

  $scope.printUSA = function(){

    var map = new google.maps.Map(document.getElementById("map"), {
      scrollwheel: false
      //styles: styles,
      //mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': 'US'}, function (results, status) {
       var ne = results[0].geometry.viewport.getNorthEast();
       var sw = results[0].geometry.viewport.getSouthWest();

       map.fitBounds(results[0].geometry.viewport);
    });

}

$scope.initGasMap =function(lat1, lat2, lng1, lng2, mpg, seats, averagePrice) {
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

      var distance = response.routes[0].legs[0].distance.value;
      $scope.distanceInfo(distance, mpg, seats, averagePrice);

    }
  });
}


  $scope.findRides = function(){
    $.ajaxSetup({
      async: false
    });

    var gmapurl1 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.starting.city+"+"+$scope.starting.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";
    var gmapurl2 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.ending.city+"+"+$scope.ending.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";

    var mapCity1 = GoogleMaps.getCity(gmapurl1);
    var mapCity2 = GoogleMaps.getCity(gmapurl2);
    //Do error checking

    //If there aren't errors:
    var lat1 = GoogleMaps.getLat(gmapurl1);
    var long1 = GoogleMaps.getLng(gmapurl1);
    var lat2 = GoogleMaps.getLat(gmapurl2);
    var long2 = GoogleMaps.getLng(gmapurl2);
    var error = 1;
    var today = new Date();

    if (mapCity1 == 0){
      document.getElementById("error1").innerHTML = "Starting city is not valid.";
      $scope.rides = [];
      error = 0;
    }
    else {
      document.getElementById("error1").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }
    if (mapCity2 == 0) {
      document.getElementById("error2").innerHTML = "Ending city is not valid.";
      $scope.rides = [];
      error = 0;
    }
    else {
      document.getElementById("error2").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }
    if ($scope.starting.state == ""){
      document.getElementById("error3").innerHTML = "Please select a starting state.";
      $scope.rides = [];
      error = 0;
    }
    else{
      document.getElementById("error3").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }
    if ($scope.ending.state == ""){
      document.getElementById("error4").innerHTML = "Please select an ending state.";
      $scope.rides = [];
      error = 0;
    }
    else{
      document.getElementById("error4").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }
    if ($scope.search.date < today){
      if ($scope.search.date == ""){
        document.getElementById("error5").innerHTML = "Please enter a date.";
        $scope.rides = [];
      }
      else{
        document.getElementById("error5").innerHTML = "The date entered has already passed.";
        $scope.rides = [];
      }
      error = 0;
    }
    else {
      document.getElementById("error5").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }


    if (error != 0) {
      GoogleMaps.initMap(lat1, lat2, long1, long2);

      //the rides that match that query
      var startCity = GoogleMaps.getAdd(gmapurl1).replace(', USA', '').replace('.', '').trim();
      var endCity = GoogleMaps.getAdd(gmapurl2).replace(', USA', '').replace('.', '').trim();
      $scope.rides = $firebaseArray(tripRef.child(startCity).child(endCity));
      if ($scope.rides.length == 0){
        document.getElementById("search").innerHTML = "There are no rides between those specified cities.";
      }
      else{
        document.getElementById("search").innerHTML = "";
      }
    }

  }

  $scope.setPrice = function(){
    $.ajaxSetup({
      async: false
    });


    var gmapurl1 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.starting.city+"+"+$scope.starting.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";
    var gmapurl2 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.ending.city+"+"+$scope.ending.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";

    var mapCity1 = GoogleMaps.getCity(gmapurl1);
    var mapCity2 = GoogleMaps.getCity(gmapurl2);
    //Do error checking

    //If there aren't errors:
    var lat1 = GoogleMaps.getLat(gmapurl1);
    var long1 = GoogleMaps.getLng(gmapurl1);
    var lat2 = GoogleMaps.getLat(gmapurl2);
    var long2 = GoogleMaps.getLng(gmapurl2);
    var error = 1;
    var today = new Date();

    if (mapCity1 == 0){
      document.getElementById("error1").innerHTML = "Starting city is not valid.";
      error = 0;
    }
    else {
      document.getElementById("error1").innerHTML = "";
    }
    if (mapCity2 == 0) {
      document.getElementById("error2").innerHTML = "Ending city is not valid.";
      error = 0;
    }
    else {
      document.getElementById("error2").innerHTML = "";
    }
    if ($scope.starting.state == ""){
      document.getElementById("error3").innerHTML = "Please select a starting state.";
      error = 0;
    }
    else{
      document.getElementById("error3").innerHTML = "";
    }
    if ($scope.ending.state == ""){
      document.getElementById("error4").innerHTML = "Please select an ending state.";
      error = 0;
    }
    else{
      document.getElementById("error4").innerHTML = "";
    }
    if ($scope.car.mpg == "" || isNaN($scope.car.mpg) || $scope.car.mpg < 0.01){
      document.getElementById("error5").innerHTML = "MPG is not valid.";
      error = 0;
    }
    else{
      document.getElementById("error5").innerHTML = "";
    }
    if ($scope.car.seats == ""){
      document.getElementById("error6").innerHTML = "Please select the number of seats in your car.";
      error = 0;
    }
    else{
      document.getElementById("error6").innerHTML = "";
    }
    if ($scope.departure.date < today){
      if ($scope.departure.date == ""){
        document.getElementById("error7").innerHTML = "Please enter a date.";
      }
      else{
        document.getElementById("error7").innerHTML = "The date entered has already passed.";
      }
      error = 0;
    }
    else {
      document.getElementById("error7").innerHTML = "";
    }
    if ($scope.post.description == ""){
      document.getElementById("error8").innerHTML = "Please enter a description.";
      error = 0;
    }
    else{
      document.getElementById("error8").innerHTML = "";
    }


    if (error != 0) {
      var gasUrl1 = "http://api.mygasfeed.com/stations/radius/"+lat1+"/"+long1+"/1/reg/Distance/1u129mrydk.json?";
      var gasUrl2 = "http://api.mygasfeed.com/stations/radius/"+lat2+"/"+long2+"/1/reg/Distance/1u129mrydk.json?";
      var price1 = 2.72;//parseFloat(GoogleMaps.getPrice(gasUrl1), 10);
      var price2 = 2.40;//parseFloat(GoogleMaps.getPrice(gasUrl2), 10);
      var averagePrice = (price1+price2)/2;
      var mpg = $scope.car.mpg;
      var seats = $scope.car.seats;
      $scope.initGasMap(lat1, lat2, long1, long2, mpg, seats, averagePrice);
    }

  }

  $scope.distanceInfo = function(distance, mpg, seats, averagePrice){
    distance = distance/1609.34;
    var cost = distance/mpg*averagePrice;
    var seatCost = cost/seats;
    document.getElementById("distance").innerHTML = "Trip distance: "+distance.toFixed(2)+" miles";
    document.getElementById("totalCost").innerHTML = "Total trip cost: $"+cost.toFixed(2);
    document.getElementById("seatCost").innerHTML ="Suggested price per seat: $"+seatCost.toFixed(2);
  }

  $scope.setSeats = function(){

  }

  $scope.showReviewForm = function(ev, fid, tid){
    $scope.initReview = $firebaseObject(userRef.child(fid));
    $scope.reviewOptions = [1,2,3,4,5];
    var userId = $scope.getUserData().facebook.id;
    $scope.review = $firebaseObject(userRef.child(fid).child('reviews').child(userId));
    $scope.reviewedRide = $firebaseObject(userRef.child(userId).child('passenger_trips').child(tid));
    $mdDialog.show({
      controller: DialogController,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'app/components/dashboard/views/reviewFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };


}]);

function PaymentDialogController($scope, $mdDialog, ride){
  $scope.ride = ride;
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer){
    $mdDialog.hide(answer);
  };
};
