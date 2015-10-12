angular.module('theApp').directive('searchRide', function(){
  return{
    restrict: 'E',
    templateUrl: 'app/components/dashboard/views/searchRide.html'
  };
});

angular.module('theApp').directive('createRide', function(){
  return{
    restrict: 'E',
    templateUrl: 'app/components/dashboard/views/createRide.html'
  };
});
