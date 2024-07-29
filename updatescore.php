<?php
$servername = "89.23.117.121";
$username = "ImInsane";
$password = "Fade3322"; // Укажите свой пароль
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
$ip = $_SERVER['REMOTE_ADDR']; // IP-адрес клиента

// Получение имени пользователя
$nickname = $data['nickname'] ?? 'Anonymous';

// Обновление счёта в базе данных
$stmt = $conn->prepare("INSERT INTO scores (ip, score, nickname) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = ?");
$stmt->bind_param("sisi", $ip, $score, $nickname, $score);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
