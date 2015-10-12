<?php
//create routes for api here
$routes = array(
    'test' => 'testHandler'
);

$get = explode('/', $_GET['route']);
$handlerRoute = array_shift($get);
$get = array_filter($get, 'checkEmpty');
$post = $_POST;

if(!isset($routes[$handlerRoute])){
    http_response_code(400);
}
else {
    require_once("handlers/".$routes[$handlerRoute].".php");
    $handler = new $routes[$handlerRoute];
    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            $handler->get($get);
            break;
        case 'POST':
            $handler->post($post);
            break;
    }
}

function checkEmpty($var){
    return (!empty($var));
}