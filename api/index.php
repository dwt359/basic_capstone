<?php
//create routes for api here
$routes = array(
    'test' => 'testHandler'
);

$getRaw = explode('/', $_GET['route']);
$handlerRoute = array_shift($getRaw);
$get = array();
for($i = 0; $i < count($get)-1; $i += 2){
    $get[$getRaw[$i]] = $getRaw[$i+1];
}
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
        default:
            http_response_code(400);
            break;
    }
}
