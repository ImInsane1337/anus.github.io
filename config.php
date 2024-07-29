<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "your_database_name";

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}
?>
