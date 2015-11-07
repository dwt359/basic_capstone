<<<<<<< HEAD
theApp.controller('dashboardCtrl',  ['$scope', '$timeout', '$state', 'LoginAuth', 'UserData', 'GoogleMaps', '$firebaseArray', '$mdDialog',
                                    function($scope, $timeout, $state, LoginAuth, UserData, GoogleMaps, $firebaseArray, $mdDialog){
=======
theApp.controller('dashboardCtrl',  ['$scope', '$timeout', '$state', 'LoginAuth', 'UserData', 'GoogleMaps', '$firebaseArray', '$firebaseObject',
                                    function($scope, $timeout, $state, LoginAuth, UserData, GoogleMaps, $firebaseArray, $firebaseObject){
>>>>>>> origin/master

  //$timeout(GoogleMaps.loadDefault(), 3000);

  $scope.states = ('AL AZ AR CA CO CT DE FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
  $scope.starting = {city: "", state: ""};
  $scope.ending = {city: "", state: ""};

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
  
  $scope.showProfile = function(ev){
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/components/profile/views/profileFormTmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    });
  }

  $scope.getProfileData = function(){
    return UserData.getProfileData();
  }

  $scope.retrievePassengerTripData = function(){
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

    GoogleMaps.initMap(lat1, lat2, long1, long2);

    //the rides that match that query
    var startCity = GoogleMaps.getAdd(gmapurl1).replace(', USA', '').replace('.', '');
    var endCity = GoogleMaps.getAdd(gmapurl2).replace(', USA', '').replace('.', '');
    $scope.rides = $firebaseArray(tripRef.child(startCity).child(endCity));


  }



  $scope.setSeats = function(){

  }

}]);
