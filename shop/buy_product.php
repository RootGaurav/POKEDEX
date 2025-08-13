<?php
// shop/buy_product.php
include '../signup/connect.php';

header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Not authenticated']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$product_id = intval($data['product_id'] ?? 0);
$user_id = intval($_SESSION['user_id']);

if ($product_id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid product ID']);
  exit;
}

// Check product exists
$stmt = $conn->prepare("SELECT id FROM products WHERE id=?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
  http_response_code(404);
  echo json_encode(['error' => 'Product not found']);
  $stmt->close();
  $conn->close();
  exit;
}
$stmt->close();

// Insert order
$stmt = $conn->prepare("INSERT INTO orders (user_id, product_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $product_id);
if ($stmt->execute()) {
  echo json_encode(['message' => 'Purchase successful']);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to process purchase']);
}

$stmt->close();
$conn->close();
?>
