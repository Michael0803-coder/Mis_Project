<?php
// Refreshes the administrator session's last-activity timestamp.
//
// The admin dashboard calls this on real user activity (click, key, pointer,
// touch), throttled to once per minute. It does not run on the background
// applicant poll, so an idle session still expires according to the
// "session_timeout_minutes" setting.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/admin_guard.php";

requireAdminSession($pdo);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST, OPTIONS");
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed.",
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Session refreshed.",
]);
