<?php
// signup/signup.php
include 'connect.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$email) {
  http_response_code(400);
  echo json_encode(['field' => 'email', 'error' => 'Please enter a valid email.']);
  exit;
}
if (strlen($username) < 3) {
  http_response_code(400);
  echo json_encode(['field' => 'username', 'error' => 'Username must be at least 3 characters.']);
  exit;
}
if (strlen($password) < 6) {
  http_response_code(400);
  echo json_encode(['field' => 'password', 'error' => 'Password must be at least 6 characters.']);
  exit;
}

// Check if email or username exists
$sql = "SELECT id FROM users WHERE email='$email' OR username='$username'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
  http_response_code(409);
  echo json_encode(['error' => 'Email or username already taken.']);
  exit;
}

// Hash password
$hash = password_hash($password, PASSWORD_BCRYPT);

// Insert user
$sql = "INSERT INTO users (email, password, username) VALUES ('$email', '$hash', '$username')";
if ($conn->query($sql) === true) {
  echo json_encode(['message' => 'Signup successful.']);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Database error.']);
}

$conn->close();
?>
