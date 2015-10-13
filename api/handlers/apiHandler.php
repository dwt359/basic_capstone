<?php
require_once('dbconn.php');

class apiHandler {

    public $db = null;

    public function __construct(){
        $db = connect();
    }
}