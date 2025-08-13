<?php
// signup/profile.php
include 'connect.php';

header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Not authenticated.']);
  exit;
}

$user_id = intval($_SESSION['user_id']);
$sql = "SELECT id, email, username FROM users WHERE id=$user_id";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
  echo json_encode(['profile' => $row]);
} else {
  http_response_code(404);
  echo json_encode(['error' => 'User not found.']);
}

$conn->close();
?>
