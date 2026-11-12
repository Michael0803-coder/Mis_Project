<?php
// Database connection test for the MIS project.
// Open http://localhost/Mis_Project/api/test_connection.php in a browser.

header("Content-Type: text/plain; charset=UTF-8");

$host = "127.0.0.1";
$port = 3306;
$dbname = "mis_project";
$username = "root";
$password = "";

echo "PHP version: " . PHP_VERSION . "\n";
echo "Testing MySQL connection to {$host}:{$port} (database: {$dbname})...\n\n";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    echo "SUCCESS: Connected to the XAMPP MySQL database.\n";
    echo "Server version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    if (!$tables) {
        echo "No tables found in '{$dbname}'.\n";
        exit;
    }

    echo "Tables in '{$dbname}':\n";

    foreach ($tables as $table) {
        $count = $pdo->query(
            "SELECT COUNT(*) FROM `" . str_replace("`", "``", $table) . "`"
        )->fetchColumn();

        echo "  - {$table}: {$count} row(s)\n";
    }
} catch (PDOException $e) {
    http_response_code(500);

    echo "FAILED: Could not connect to the database.\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "Checklist:\n";
    echo "  1. Start MySQL in the XAMPP Control Panel.\n";
    echo "  2. Make sure the database '{$dbname}' exists in phpMyAdmin.\n";
    echo "  3. Confirm the MySQL user '{$username}' and password match api/db.php.\n";
    echo "  4. Make sure MySQL is listening on port {$port}.\n";
}
