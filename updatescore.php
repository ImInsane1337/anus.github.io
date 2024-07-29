<?php
// Подключение к базе данных
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

// Получение данных из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$score = intval($data['score']);
$nickname = $data['nickname'] ?? 'Anonymous';

// Обновление счёта в базе данных
$stmt = $conn->prepare("INSERT INTO scores (nickname, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = ?");
$stmt->bind_param("sis", $nickname, $score, $score);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
