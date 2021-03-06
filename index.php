<html lang="en">
  <head>
    <title>HITCH</title>
    <link REL="SHORTCUT ICON" HREF="http://mu-basic-capstone.cloudapp.net/assets/img/hitch_car_logo.png" />
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
	  <link rel="stylesheet" href="assets/css/styles.css">
    <script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
    <meta name="viewport" content="initial-scale=1" />
  </head>
  <body layout="column" ng-app="theApp">
    <div ui-view></div>

    <!--  Receiving info from Paypal  -->
    <script type="text/javascript">
        window.purchasedTripInfo = <?php echo (empty($_GET['trip'])? 'null':$_GET['trip']); ?>;
    </script>

    <!-- Rando dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="http://maps.google.com/maps/api/js?"></script>

    <!-- Angular Material Dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js"></script>
    <script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>

    <!-- The app and its services! -->
    <script src="app/shared/app.js"></script>

    <!-- Project controllers -->
    <script src="app/shared/app.js"></script>
    <script src="app/components/home/HomeCtrl.js"></script>
    <script src="app/components/home/LoginCtrl.js"></script>
    <script src="app/components/dashboard/dashboardCtrl.js"></script>
    <script src="app/components/profile/profileCtrl.js"></script>

    <!-- Directives -->
    <script src="app/components/dashboard/dashboardDirectives.js"></script>


  </body>
</html>
