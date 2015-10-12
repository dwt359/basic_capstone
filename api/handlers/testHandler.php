<?php
class testHandler {

    public function get($get){
        echo json_encode($get);
    }

    public function post($post){
        echo json_encode($post);
    }
}