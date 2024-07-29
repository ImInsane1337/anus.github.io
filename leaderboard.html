<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: #1c1c1c;
            color: #e6e6e6;
            text-align: center;
            margin: 0;
            padding: 20px;
        }
        table {
            margin: 20px auto;
            border-collapse: collapse;
            width: 80%;
            max-width: 800px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #444;
        }
        th {
            background: #333;
            color: #e6e6e6;
        }
        tr:nth-child(even) {
            background: #2c2c2c;
        }
        tr:hover {
            background: #444;
        }
        .back-button {
            margin: 20px;
            padding: 10px 20px;
            font-size: 1.2rem;
            color: #fff;
            background-color: #d9534f; /* Опиумный красный */
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .back-button:hover {
            background-color: #c9302c; /* Темнее на ховер */
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <h1>Таблица лидеров</h1>
    <table>
        <thead>
            <tr>
                <th>Никнейм</th>
                <th>Счёт</th>
            </tr>
        </thead>
        <tbody>
            <?php
            // Подключение к базе данных
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

            // Запрос на получение данных из таблицы
            $sql = "SELECT nickname, score FROM scores ORDER BY score DESC";
            $result = $conn->query($sql);

            // Отображение данных в таблице
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<tr><td>" . htmlspecialchars($row['nickname']) . "</td><td>" . htmlspecialchars($row['score']) . "</td></tr>";
                }
            } else {
                echo "<tr><td colspan='2'>Нет данных</td></tr>";
            }

            // Закрытие подключения
            $conn->close();
            ?>
        </tbody>
    </table>
    <a href="index.html" class="back-button">Назад</a>
</body>
</html>
