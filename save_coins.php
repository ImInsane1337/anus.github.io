<?php
include 'config.php';

session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$username = isset($_SESSION['username']) ? $_SESSION['username'] : '';

if ($username) {
    $coins = $_POST['coins'];

    $stmt = $conn->prepare("INSERT INTO users (ip_address, username, coins, last_save) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE coins = VALUES(coins), last_save = VALUES(last_save)");
    $stmt->bind_param('ssi', $ip, $username, $coins);
    $stmt->execute();
    $stmt->close();
}

$conn->close();
?>
