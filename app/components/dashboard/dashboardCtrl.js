
theApp.controller('dashboardCtrl',  ['$scope', '$timeout', '$state', 'LoginAuth', 'UserData', 'GoogleMaps', '$firebaseArray', '$firebaseObject', '$mdDialog',                                    function($scope, $timeout, $state, LoginAuth, UserData, GoogleMaps, $firebaseArray, $firebaseObject, $mdDialog){

  //$timeout(GoogleMaps.loadDefault(), 3000);

  $scope.states = ('AL AZ AR CA CO CT DE FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });


  $scope.rating = [5, 4, 3, 2, 1];

  $scope.starting = {city: "", state: ""};
  $scope.ending = {city: "", state: ""};
  $scope.car = {mpg: "", seats: "", vehicle: ""};
  $scope.departure = {date: "", time: ""};
  $scope.search = {dateS: "", dateE: ""};
  $scope.post = {description: ""};
  $scope.selectedVehicle = 0;

  $scope.seats = [{name: 'Seat', description:'', price: 0.00}];
  $scope.seatLimit = 6;

  $scope.postRidePricing = {distance: 0, totalCost: 0, price: 0, showForm: false};

  var ref = new Firebase('https://hitchdatabase.firebaseio.com');
  var tripRef = ref.child('trips');
  var userRef = ref.child('users');

  //purchased trip stuff
  if(!!window.purchasedTripInfo){
    var purchasedTripInfo = window.purchasedTripInfo;
    window.purchasedTripInfo = null;
    //add yourself to passengers on the trip
    var trip = $firebaseObject(tripRef.child(purchasedTripInfo.from).child(purchasedTripInfo.to).child(purchasedTripInfo.num));
    trip.$loaded().then(function(){
      trip.seats_left -= 1;
      if(!trip.passengers){trip.passengers = [];}
      trip.passengers[trip.passengers.length] = UserData.getData().facebook.id;
      trip.$save();
      //add to passenger trip queue
      var self = $firebaseObject(userRef.child(UserData.getData().facebook.id));
      self.$loaded().then(function(){
        if(!self.passenger_trips){self.passenger_trips = [];}
        self.passenger_trips[self.passenger_trips.length] = {
          to: purchasedTripInfo.to,
          from: purchasedTripInfo.from,
          num: purchasedTripInfo.num,
          is_reviewed: false
        };
        self.$save();
        alert('Successfully purchased ride! Click on your driver\'s profile picture to contact them on Facebook.');
        window.location.assign(window.location.href.substr(0,window.location.href.indexOf('?')));
      });
    });
  }


  $scope.rides = [];






  $scope.removeSeat = function(i){
    if($scope.seats.length > 1){
      $scope.seats.splice(i, 1);
    }
  };

  $scope.addSeat = function(i){
    if($scope.seats.length < $scope.seatLimit){
      $scope.seats.push({name: 'New Seat', description:'', price: 0.00});
    }
  };


  $scope.viewProfile = function() {
      $state.go('^.^.profile');
  };

  $scope.viewDashboard = function() {
        $state.go('home');

  };

  $scope.showProfile = function(ev, fid){
    //main profile info
    $scope.viewedProfileInfo = $firebaseObject(userRef.child(fid));
    //profile reviews
    $scope.profileReviews = [];
    $scope.avg = {
      driver_ability: 0,
      comfort: 0,
      price_fairness: 0,
      overall: 0
    };
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
          //compute averages
          $scope.avg.driver_ability += parseInt(review.driver_ability) / profileReviews.length;
          $scope.avg.comfort += parseInt(review.comfort) / profileReviews.length;
          $scope.avg.price_fairness += parseInt(review.price_fairness) / profileReviews.length;
          $scope.avg.overall += parseInt(review.overall) / profileReviews.length;

        });
      });
    });
    //profile trips
    $scope.profileTrips = [];
    var profileTrips = $firebaseArray(userRef.child(fid).child('trips'));
    var trips = [];
    profileTrips.$loaded().then(function(){
      angular.forEach(profileTrips, function(profileTrip, id){
        trips.push($firebaseObject(tripRef.child(profileTrip.from).child(profileTrip.to).child(profileTrip.num)));
        trips[id].$loaded().then(function() {
          $scope.profileTrips.push({
            comment: trips[id].comment,
            start_time: $scope.formatDate(trips[id].start_time),
            from: profileTrip.from,
            to: profileTrip.to
          });
        });
      });
    });

    //vehicle information
    $scope.profileVehicles = $firebaseArray(userRef.child(fid).child('vehicles'));
    //viewing your own profile
    $scope.isPersonalProfile = (fid == UserData.getData().facebook.id);

    //kick off dialog
    $mdDialog.show({
      controller: DialogController,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'app/components/profile/views/profileFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };

  $scope.deleteVehicle = function(vid){
    //get user's trips as an array
    var allTrips = [];
    var trips = $firebaseArray(userRef.child(UserData.getData().facebook.id).child('trips'));
    var vehicles = $firebaseArray(userRef.child(UserData.getData().facebook.id).child('vehicles'));
    trips.$loaded().then(function(){
      angular.forEach(trips, function (trip, id) {
        allTrips.push($firebaseObject(tripRef.child(trip.from).child(trip.to).child(trip.num)));
        allTrips[id].$loaded().then(function () {
          if (allTrips[id].vehicle == vid) {
            //can't delete
            alert('You can\'t delete a vehicle you are using in a trip.');
          }
          else if (allTrips.length >= trips.length) {
            //delete
            var user = $firebaseObject(userRef.child(UserData.getData().facebook.id));
            user.$loaded().then(function () {
              user.vehicles[vid] = null;
              user.$save();
              alert('Successfully deleted vehicle.');
            });
          }
        });
      });
    });
  };



  $scope.showPayment = function(ev, ride, i){
    $scope.route.num = ride.id;
    $mdDialog.show({
      controller: PaymentDialogController,
      templateUrl: 'app/components/dashboard/views/find/payment.php?price='+ride.seat_price+'&returl='+encodeURIComponent(window.location.href)+'&trip='+encodeURIComponent(JSON.stringify($scope.route)),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        ride: ride
      }
    });
  };

  $scope.getProfileData = function(){
    return UserData.getProfileData();
  };

  $scope.formatDate = function(dateString){
    var startTime = new Date(dateString);
    var pad = '00';
    return (startTime.getMonth() + 1) + '/' + startTime.getDate() + '/' + startTime.getFullYear() + ' at ' + startTime.getHours() + ':' + pad.substring(0, pad.length - startTime.getMinutes().toString().length) + startTime.getMinutes().toString();
  };

  $scope.getProfileData = function(){
    return UserData.getProfileData();
  };

  $scope.retrievePassengerTripData = function(){
    $scope.now = (new Date()).getTime();
    var twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
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
          var newTrip = {
            start_time: $scope.formatDate(item[id].start_time),
            user: item[id].user,
            from: trip.from,
            to: trip.to,
            is_reviewed: trip.is_reviewed,
            passenger_trip_id: id,
            time_num: startTime.getTime()
          };
          person.push($firebaseObject(userRef.child(item[id].user)));
          person[id].$loaded().then(function(){
            newTrip.img_url = person[id].img_url;
            newTrip.name = person[id].name;
            if(startTime >= twoWeeksAgo) {
              $scope.tripData.push(newTrip);
            }
          });
        });
      });
      //driver trips
      var driverTripRefs = profileData.trips;
      var driverTripInfo = [];
      $scope.driverTripData = [];
      var now = new Date();
      angular.forEach(driverTripRefs, function(driverTripRef, did){
        driverTripInfo[did] = ($firebaseObject(tripRef.child(driverTripRef.from).child(driverTripRef.to).child(driverTripRef.num)));
        driverTripInfo[did].$loaded().then(function(){
          var startDate = new Date(driverTripInfo[did].start_time);
          if(startDate >= now) {
            $scope.driverTripData[did] = {
              to: driverTripRef.to,
              from: driverTripRef.from,
              passengers: [],
              comment: driverTripInfo[did].comment,
              seats: driverTripInfo[did].seats_left,
              start_time: $scope.formatDate(driverTripInfo[did].start_time),
              time_num: startDate.getTime()
            };
            angular.forEach(driverTripInfo[did].passengers, function (passenger, pid) {
              $scope.driverTripData[did].passengers[pid] = $firebaseObject(userRef.child(passenger));
            });
          }
        });
      });
    });
  };

  $scope.getUserData = function(){
    return UserData.getData();
  };

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
  };

  $scope.verifyInfo = function(){
    //Verify ride info stuff here

    $state.go('^.pricing')
  };

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

};

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
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

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
    if ($scope.search.date1 < yesterday || $scope.search.date2 < yesterday){
      if ($scope.search.date1 == "" || $scope.search.date2 == ""){
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
    if ($scope.search.date2 < today){
      if ($scope.search.date2 == ""){
        document.getElementById("error6").innerHTML = "Please enter a date.";
        $scope.rides = [];
      }
      else{
        document.getElementById("error6").innerHTML = "The date entered has already passed.";
        $scope.rides = [];
      }
      error = 0;
    }
    else {
      document.getElementById("error6").innerHTML = "";
      document.getElementById("search").innerHTML = "";
    }


    if (error != 0) {
      GoogleMaps.initMap(lat1, lat2, long1, long2);

      //the rides that match that query
      var startCity = GoogleMaps.getAdd(gmapurl1).replace(', USA', '').replace('.', '').trim();
      var endCity = GoogleMaps.getAdd(gmapurl2).replace(', USA', '').replace('.', '').trim();
      $scope.route = {
        from: startCity,
        to: endCity
      };
      var rides = $firebaseArray(tripRef.child(startCity).child(endCity));
      var drivers = [];
      $scope.rides = [];
      rides.$loaded().then(function(){
        angular.forEach(rides, function(ride, id){
          drivers.push($firebaseObject(userRef.child(ride.user)));
          drivers[id].$loaded().then(function(){
            var newRide = {
              id: ride.$id,
              name: drivers[id].name,
              user: ride.user,
              vehicle: drivers[id].vehicles[ride.vehicle],
              img_url: drivers[id].img_url,
              comment: ride.comment,
              seats_left: ride.seats_left,
              seat_price: ride.seat_price,
              start_time: $scope.formatDate(ride.start_time)
            };

            document.getElementById("search").innerHTML = "";
            var rideDate = new Date(ride.start_time);
            var isOnRide = false;
            angular.forEach(ride.passengers, function(passenger, pid){
              if(passenger == UserData.getData().facebook.id){
                isOnRide = true;
              }
            });
            if(rideDate >= $scope.search.date1 && rideDate <= $scope.search.date2 && newRide.seats_left != 0 && newRide.user != UserData.getData().facebook.id && !isOnRide) {
              $scope.rides.push(newRide);
            }
          });
        });
      });

      if ($scope.rides.length == 0){
        document.getElementById("search").innerHTML = "There are no rides between those specified cities.";
      }
      else{
        document.getElementById("search").innerHTML = "";
      }

    }
  };

  $scope.saveRide = function(){
    if(isNaN(parseFloat($scope.postRidePricing.price))){
      alert("Please enter a valid price");
    }
    else{
      var departureTime = new Date();
      departureTime.setTime($scope.departure.date.getTime() + $scope.departure.time.getTime() - departureTime.getTimezoneOffset()*60000);

      //get current rides with these locations
      var currentRides = $firebaseArray(tripRef.child($scope.startCity).child($scope.endCity));
      var rideRefs = $firebaseArray(userRef.child(UserData.getData().facebook.id).child('trips'));
      currentRides.$loaded().then(function() {
        rideRefs.$loaded().then(function () {
          var newRide = $firebaseObject(tripRef.child($scope.startCity).child($scope.endCity).child(currentRides.length));
          newRide.comment = $scope.post.description;
          newRide.seat_price = $scope.postRidePricing.price;
          newRide.seats = $scope.car.seats;
          newRide.seats_left = $scope.car.seats;
          newRide.start_time = departureTime.getFullYear() + '-' + (departureTime.getMonth() + 1) + '-' + departureTime.getDate() + ' ' + departureTime.getHours() + ':' + departureTime.getMinutes() + ':' + departureTime.getSeconds();
          newRide.user = UserData.getData().facebook.id;
          newRide.vehicle = $scope.car.vehicle;
          var newRef = $firebaseObject(userRef.child(UserData.getData().facebook.id).child('trips').child(rideRefs.length));
          newRef.to = $scope.endCity;
          newRef.from = $scope.startCity;
          newRef.num = currentRides.length;
          newRide.$save();
          newRef.$save();
          $scope.hide();
      });
    });
  }
  };

  $scope.setPrice = function(){
    $.ajaxSetup({
      async: false
    });

    var gmapurl1 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.starting.city+"+"+$scope.starting.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";
    var gmapurl2 = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.ending.city+"+"+$scope.ending.state+"&components=country:US&key=AIzaSyA6xJtLioC6VlWo0JIeq5BBwcqzljpt4Lg";

    var mapCity1 = GoogleMaps.getCity(gmapurl1);
    var mapCity2 = GoogleMaps.getCity(gmapurl2);
    $scope.startCity = GoogleMaps.getAdd(gmapurl1).replace(', USA', '').replace('.', '').trim();
    $scope.endCity = GoogleMaps.getAdd(gmapurl2).replace(', USA', '').replace('.', '').trim();

    //Do error checking

    //If there aren't errors:
    var lat1 = GoogleMaps.getLat(gmapurl1);
    var long1 = GoogleMaps.getLng(gmapurl1);
    var lat2 = GoogleMaps.getLat(gmapurl2);
    var long2 = GoogleMaps.getLng(gmapurl2);
    var error = 1;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);

    if (mapCity1 == 0){

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
    if ($scope.car.vehicle == ""){
      document.getElementById("error5").innerHTML = "Please select a vehicle. Please add a vehicle from the home page if you have not already.";
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
    if ($scope.departure.date < yesterday){
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


      var gasUrl1 = "http://api.mygasfeed.com/stations/radius/"+lat1+"/"+long1+"/25/reg/Distance/1u129mrydk.json?";
      var gasUrl2 = "http://api.mygasfeed.com/stations/radius/"+lat2+"/"+long2+"/25/reg/Distance/1u129mrydk.json?";
      var price1 = parseFloat(GoogleMaps.getPrice(gasUrl1), 10);
      var price2 = parseFloat(GoogleMaps.getPrice(gasUrl2), 10);
      if (isNaN(price1)|| isNaN(price2)) {
        price1 = 2;
        price2 = 2;
      }
      var averagePrice = (price1+price2)/2;
      var mpg = $scope.selectedVehicle.mpg;
      var seats = $scope.car.seats;
      $scope.initGasMap(lat1, lat2, long1, long2, mpg, seats, averagePrice);
      $scope.postRidePricing.showForm = true;
      $scope.showPostForm();
    }

  };

  $scope.getPrice = function (url){
     var price;
     $.getJSON(url, function(station){
       var stations = station.stations;
       for (i = 0; i<stations.length; i++) {
         price = station.stations[i].reg_price;
         if (price != "N/A"){
           break;
         }
       }

     });
     return price;
   };

  $scope.distanceInfo = function(distance, mpg, seats, averagePrice){
    distance = distance/1609.34;
    var cost = distance/mpg*averagePrice;
    var seatCost = cost/seats;

    $scope.postRidePricing.distance = distance.toFixed(2);
    $scope.postRidePricing.totalCost = cost.toFixed(2);
    $scope.postRidePricing.price = seatCost.toFixed(2);




    //document.getElementById("distance").innerHTML = "Trip distance: "+distance.toFixed(2)+" miles";
    //document.getElementById("totalCost").innerHTML = "Total trip cost: $"+cost.toFixed(2);
    //document.getElementById("seatCost").innerHTML ="Suggested price per seat: $"+seatCost.toFixed(2);
  };

  $scope.showPostForm = function(ev){
    $mdDialog.show({
      controller: DialogController,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'app/components/dashboard/views/post/postRideTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
};



  $scope.setSeats = function(){

  };

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

  $scope.postRide = function(){
    console.log($scope.postRidePricing)
  };


  $scope.initPostRide = function(){
    $scope.vehicles = $firebaseArray(userRef.child(UserData.getData().facebook.id).child('vehicles'));
  };

  $scope.selectPostVehicle = function(){
    $scope.selectedVehicle = $scope.vehicles[$scope.car.vehicle];
    if($scope.car.seats > $scope.selectedVehicle.seats){
        $scope.car.seats = $scope.selectedVehicle.seats;
    }
  };


$scope.showVehicleForm = function(ev){
  $scope.currentVehicles = $firebaseArray(userRef.child(UserData.getData().facebook.id).child('vehicles'));
  $scope.currentVehicles.$loaded().then(function(){
    $scope.newVehicle = $firebaseObject(userRef.child(UserData.getData().facebook.id).child('vehicles').child($scope.currentVehicles.length));
  });
  $scope.makeOptions = ['Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'FIAT', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Porsche', 'Rolls-Royce', 'Saab', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'];
  $mdDialog.show({
    controller: DialogController,
    scope: $scope,
    preserveScope: true,
    templateUrl: 'app/components/dashboard/views/addVehicle/addVehicleTmpl.html',
    targetEvent: ev,
    clickOutsideToClose: true
  });
};

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

}]);
