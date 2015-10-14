<html lang="en">
  <head>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
	  <link rel="stylesheet" href="assets/css/styles.css">
    <script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
    <meta name="viewport" content="initial-scale=1" />
  </head>
  <body layout="column" ng-app="theApp">
    <div ui-view></div>

    <!-- Rando dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js"></script>

    <!-- Angular Material Dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js"></script>

    <!-- Project controllers -->
    <script src="app/shared/app.js"></script>
    <script src="app/components/home/homeCtrl.js"></script>
    <script src="app/components/dashboard/dashboardCtrl.js"></script>
    <script src="app/shared/facebookLogin.js"></script>
      <script src="app/components/facebook/fbCtrl.js"></script>

    <!-- Directives -->
    <script src="app/components/dashboard/dashboardDirectives.js"></script>

  </body>
</html>
