<?php
// signup/connect.php
$servername = "localhost";
$username = "root";          // default XAMPP MySQL admin user
$password = "";              // default XAMPP MySQL password is empty
$dbname = "pokedex";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

session_set_cookie_params([
  'lifetime' => 7 * 24 * 60 * 60,
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();
?>
