<?php
require_once('apiHandler.php');

class testHandler extends apiHandler{

    public function get($get){
        echo json_encode(array('get'=>$get));
    }

    public function post($post){
        echo json_encode($post);
    }
}