<?php
require_once 'encryption.php'; // Подключаем файл с функциями шифрования

$servername = "89.23.117.121";
$username = "ImInsane";
$password = "Fade3322"; // Укажите свой пароль
$dbname = "leaderboard";

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$score = intval($data['score']);
$encrypted_ip = $_SERVER['REMOTE_ADDR']; // Используйте зашифрованный IP, если необходимо

$sql = "INSERT INTO scores (ip, score) VALUES ('$encrypted_ip', $score)
        ON DUPLICATE KEY UPDATE score = $score";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
