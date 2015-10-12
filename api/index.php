<?php
//create routes for api here
$routes = array(
    'test' => 'testHandler'
);

$get = explode('/', $_GET['route']);
$handlerRoute = $get[0];
$get = array_shift($get);
$post = $_POST;

if(!isset($routes[$handlerRoute])){
    http_response_code(400);
}
else {
    require_once("handlers/".$routes[$handlerRoute].".php");
}