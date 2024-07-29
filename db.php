<?php
$servername = "89.23.117.121";
$username = "ImInsane";
$password = "Fade3322"; // Укажите свой пароль
$dbname = "leaderboard";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
