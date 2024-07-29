<?php
$servername = "89.23.117.121";
$username = "ImInsane";
$password = "Fade3322";
$dbname = "clicker";

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}
?>
