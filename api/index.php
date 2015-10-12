<?php
//create routes for api here
$routes = array(
    'test' => 'testHandler'
);

$destination = explode('/', $_GET['route']);
$handlerRoute = $destination[0];

if(!isset($routes[$handlerRoute])){
    http_response_code(400);
}
else {
    require_once("handlers/".$routes[$handlerRoute].".php");
}