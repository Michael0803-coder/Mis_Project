<?php
// Reusable administrator-session guard for the newer admin APIs.
//
// The existing dashboard endpoints are public for now, but every new
// administrative endpoint (course catalog, settings, test email) requires the
// PHP session created by api/login.php.
//
// It also enforces the "session_timeout_minutes" system setting. The timeout
// is refreshed on every guarded request.

require_once __DIR__ . "/settings_helper.php";

function requireAdminSession(PDO $pdo): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $role = strtoupper((string) ($_SESSION["user_role"] ?? ""));

    if (!in_array($role, ["ADMIN", "STAFF"], true)) {
        http_response_code(401);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode([
            "success" => false,
            "message" => "Administrator sign-in required.",
        ]);
        exit;
    }

    $timeoutMinutes = systemSettingInt(
        $pdo,
        "session_timeout_minutes",
        120,
        5,
        1440
    );

    $now = time();
    $lastActivity = (int) ($_SESSION["last_activity"] ?? 0);

    if ($lastActivity > 0 && ($now - $lastActivity) > $timeoutMinutes * 60) {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                "",
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();

        http_response_code(401);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode([
            "success" => false,
            "message" => "Your session has expired. Please sign in again.",
        ]);
        exit;
    }

    $_SESSION["last_activity"] = $now;
}
