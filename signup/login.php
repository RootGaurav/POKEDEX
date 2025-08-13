<?php
// signup/login.php
include 'connect.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (!$email || strlen($password) < 6) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email or password.']);
  exit;
}

$sql = "SELECT id, password FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
  if (password_verify($password, $row['password'])) {
    $_SESSION['user_id'] = $row['id'];
    echo json_encode(['message' => 'Logged in.']);
  } else {
    http_response_code(401);
    echo json_encode(['error' => 'Password incorrect.']);
  }
} else {
  http_response_code(401);
  echo json_encode(['error' => 'User not found.']);
}

$conn->close();
?>
