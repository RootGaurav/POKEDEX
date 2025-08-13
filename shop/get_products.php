<?php
// shop/get_products.php
include '../signup/connect.php';

header('Content-Type: application/json');

$sql = "SELECT id, name, description, price, image_url FROM products";
$result = $conn->query($sql);

$products = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $products[] = $row;
  }
}

echo json_encode($products);
$conn->close();
?>
