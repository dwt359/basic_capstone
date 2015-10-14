<?php
require_once('dbconn.php');

abstract class apiHandler {

    public $db = null;

    public function __construct(){
        $this->db = connect();
    }

    abstract public function get($get);
    abstract public function post($post);
}