<?php
include 'config.php';

session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$username = $_POST['username'];

if (!empty($username)) {
    $stmt = $conn->prepare("INSERT INTO users (ip_address, username, coins) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE ip_address = VALUES(ip_address)");
    $stmt->bind_param('ss', $ip, $username);
    $stmt->execute();
    
    $_SESSION['username'] = $username;
    $stmt->close();
}

$conn->close();
?>
