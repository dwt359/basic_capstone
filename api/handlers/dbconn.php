<?php
function connect()
{
    $servername = "localhost";
    $username = "root";
    $password = "Ojnad1992";
    $schema = "rideshare";

    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $schema);
    return $conn;
}