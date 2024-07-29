<?php
include 'db.php';

// Получаем данные о пользователях с наивысшими очками
$sql = "SELECT username, score FROM users ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$leaderboard = [];
while($row = $result->fetch_assoc()) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);

$conn->close();
?>
