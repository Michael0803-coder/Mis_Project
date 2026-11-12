<?php
// Destroys the PHP session created by api/login.php and clears the session
// cookie. The frontend also clears its stored user and returns to #login.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST, OPTIONS");
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed.",
    ]);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "httponly" => true,
        "samesite" => "Lax",
    ]);
    session_start();
}

// Remove every session value, then expire the browser cookie.
$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();

    setcookie(session_name(), "", [
        "expires" => time() - 42000,
        "path" => $params["path"] ?: "/",
        "domain" => $params["domain"] ?: "",
        "secure" => (bool) ($params["secure"] ?? false),
        "httponly" => (bool) ($params["httponly"] ?? true),
        "samesite" => $params["samesite"] ?: "Lax",
    ]);
}

session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Signed out successfully.",
]);
