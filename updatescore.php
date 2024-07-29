<?php
// updateScore.php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leaderboard";

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$score = intval($data['score']);
$ip = $_SERVER['REMOTE_ADDR']; // Можно использовать IP для идентификации пользователя

// Вставка или обновление данных в базе данных
$sql = "INSERT INTO scores (ip, score) VALUES ('$ip', $score)
        ON DUPLICATE KEY UPDATE score = $score";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
