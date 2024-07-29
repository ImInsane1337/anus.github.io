<?php
include 'config.php';

session_start();
$username = isset($_SESSION['username']) ? $_SESSION['username'] : '';

if ($username) {
    $stmt = $conn->prepare("SELECT coins FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($coins);
    $stmt->fetch();
    echo $coins;
    $stmt->close();
}

$conn->close();
?>
