<?php
// Database connection variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pokeshop";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// User input from the form
// $user_name = $_POST['name'];
$user_email = $_POST['email'];
// $user_password = $_POST['password'];
$user_password = "hahha";

// Hash the password
$hashed_password = password_hash($user_password, PASSWORD_DEFAULT);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO signup (id,name,email, password) VALUES (?, ?, ?,?)");
$stmt->bind_param("isss","1", "Gaurav", $user_email, $hashed_password);

// Execute the statement
if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
