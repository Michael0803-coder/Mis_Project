<?php
// Sends a test message using the configured mail transport.
// Used by the "Mail delivery" card in System Settings.
//
// POST /api/test_email.php  { "to": "name@example.com" }
// Requires an authenticated ADMIN or STAFF session.

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

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST, OPTIONS");
    respond(405, [
        "success" => false,
        "message" => "Only POST requests are allowed.",
    ]);
}

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, [
        "success" => false,
        "message" => "Invalid JSON request.",
    ]);
}

$to = strtolower(trim((string) ($input["to"] ?? "")));

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    respond(422, [
        "success" => false,
        "message" => "Enter a valid email address for the test message.",
    ]);
}

require_once __DIR__ . "/mailer.php";

$config = loadMailConfig();
$fromName = htmlspecialchars(
    (string) ($config["from_name"] ?? "Apex Academy MIS"),
    ENT_QUOTES,
    "UTF-8"
);
$fromEmail = htmlspecialchars(
    (string) ($config["from_email"] ?? ""),
    ENT_QUOTES,
    "UTF-8"
);

$html = '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:560px;margin:0 auto;">'
    . '<h2 style="color:#4338ca;">Mail delivery is working</h2>'
    . '<p>This test message was sent from the Apex Academy Campus MIS.</p>'
    . '<p style="color:#64748b;font-size:12px;">Sent by ' . $fromName
    . ' &lt;' . $fromEmail . '&gt; on ' . date("Y-m-d H:i:s") . '.</p>'
    . '</div>';

$result = sendSystemMail($to, "Campus MIS test email", $html);

if (!$result["success"]) {
    respond(502, [
        "success" => false,
        "message" => "The test email could not be sent. Check the SMTP configuration.",
        "error" => $result["error"],
    ]);
}

respond(200, [
    "success" => true,
    "message" => "Test email sent to " . $to . ".",
]);
