<?php

date_default_timezone_set('Asia/Manila');
// Database connection parameters
$host = 'localhost';
$db   = 'ember_db';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn -> connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
} else {
    echo "<script> console.log(\" Successfully Connected to $db\") </script>";

    $conn->set_charset("utf8mb4");
}
