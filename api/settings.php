<?php
// System settings API for the administration workspace.
//
// GET  /api/settings.php   Read settings, defaults, mail status, system info.
// PUT  /api/settings.php   Save one or more settings.
//
// The mail password is never returned. SMTP credentials stay in
// api/mail_config.local.php on the server.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
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

function textLength(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value) : strlen($value);
}

function settingDefinitions(): array
{
    return [
        "institution_name" => [
            "group" => "institution",
            "default" => "Apex Academy",
            "type" => "string",
            "max" => 150,
        ],
        "institution_short_name" => [
            "group" => "institution",
            "default" => "Campus MIS",
            "type" => "string",
            "max" => 80,
        ],
        "campus_address" => [
            "group" => "institution",
            "default" => "Apex Academy Main Campus, Philippines",
            "type" => "string",
            "max" => 255,
        ],
        "contact_email" => [
            "group" => "institution",
            "default" => "info@apexacademy.edu",
            "type" => "email",
            "max" => 150,
        ],
        "contact_phone" => [
            "group" => "institution",
            "default" => "+63 2 8123 4567",
            "type" => "string",
            "max" => 50,
        ],
        "current_academic_year" => [
            "group" => "academic",
            "default" => "2026-2027",
            "type" => "academic_year",
        ],
        "current_semester" => [
            "group" => "academic",
            "default" => "First Semester",
            "type" => "semester",
        ],
        "timezone" => [
            "group" => "academic",
            "default" => "Asia/Manila",
            "type" => "timezone",
        ],
        "email_notifications" => [
            "group" => "notifications",
            "default" => "1",
            "type" => "bool",
        ],
        "session_timeout_minutes" => [
            "group" => "security",
            "default" => "120",
            "type" => "int",
            "min" => 5,
            "max" => 1440,
        ],
        "password_min_length" => [
            "group" => "security",
            "default" => "12",
            "type" => "int",
            "min" => 8,
            "max" => 64,
        ],
    ];
}

function typedSetting(string $value, array $definition)
{
    $type = $definition["type"] ?? "string";

    if ($type === "bool") {
        return in_array(
            strtolower(trim($value)),
            ["1", "true", "yes", "on"],
            true
        );
    }

    if ($type === "int") {
        return (int) $value;
    }

    return $value;
}

function buildSettingsPayload(PDO $pdo): array
{
    $definitions = settingDefinitions();
    $stored = [];

    try {
        $stmt = $pdo->query(
            "SELECT setting_key, setting_value FROM system_settings"
        );

        foreach ($stmt->fetchAll() as $row) {
            if (isset($definitions[$row["setting_key"]])) {
                $stored[$row["setting_key"]] = (string) $row["setting_value"];
            }
        }
    } catch (Throwable $e) {
        // The migration may not have been run yet. Use defaults.
    }

    $settings = [];
    $defaults = [];

    foreach ($definitions as $key => $definition) {
        $value = $stored[$key] ?? $definition["default"];
        $settings[$key] = typedSetting($value, $definition);
        $defaults[$key] = typedSetting($definition["default"], $definition);
    }

    $mailConfig = require __DIR__ . "/mail_config.php";
    $mailTransport = strtolower(trim((string) ($mailConfig["transport"] ?? "smtp")));
    $mailHost = trim((string) ($mailConfig["host"] ?? ""));
    $mailFrom = trim((string) ($mailConfig["from_email"] ?? ""));
    $usesLocalRelay = $mailTransport !== "mail" && in_array(
        strtolower($mailHost),
        ["127.0.0.1", "localhost", "::1"],
        true
    );
    $mailConfigured = $mailFrom !== ""
        && ($mailTransport === "mail" || $mailHost !== "");

    $database = "mis_project";

    try {
        $database = (string) $pdo->query("SELECT DATABASE()")->fetchColumn();
    } catch (Throwable $e) {
        // Keep the fallback name.
    }

    $timezone = (string) ($settings["timezone"] ?? "Asia/Manila");
    $now = new DateTimeImmutable("now", new DateTimeZone($timezone));

    return [
        "settings" => $settings,
        "defaults" => $defaults,
        "mail" => [
            "transport" => $mailTransport,
            "host" => $mailHost,
            "port" => (int) ($mailConfig["port"] ?? 25),
            "encryption" => (string) ($mailConfig["encryption"] ?? ""),
            "from_email" => $mailFrom,
            "from_name" => (string) ($mailConfig["from_name"] ?? ""),
            "username_set" => trim((string) ($mailConfig["username"] ?? "")) !== "",
            "uses_local_relay" => $usesLocalRelay,
            "configured" => $mailConfigured,
        ],
        "system" => [
            "php_version" => PHP_VERSION,
            "database" => $database,
            "server" => (string) ($_SERVER["SERVER_SOFTWARE"] ?? "PHP"),
            "timezone" => $timezone,
            "now" => $now->format("c"),
        ],
    ];
}

function validateSettingValue(string $key, $raw, array $definition): array
{
    $type = $definition["type"] ?? "string";
    $error = null;

    if ($type === "bool") {
        $value = is_bool($raw)
            ? ($raw ? "1" : "0")
            : (in_array(
                strtolower(trim((string) $raw)),
                ["1", "true", "yes", "on"],
                true
            ) ? "1" : "0");

        return ["value" => $value, "error" => null];
    }

    if ($type === "int") {
        $value = filter_var(
            $raw,
            FILTER_VALIDATE_INT,
            [
                "options" => [
                    "min_range" => (int) ($definition["min"] ?? 0),
                    "max_range" => (int) ($definition["max"] ?? PHP_INT_MAX),
                ],
            ]
        );

        if ($value === false) {
            $error = "Enter a number between "
                . ($definition["min"] ?? 0)
                . " and "
                . ($definition["max"] ?? "the maximum")
                . ".";
        }

        return [
            "value" => $value === false ? null : (string) $value,
            "error" => $error,
        ];
    }

    $value = trim((string) $raw);
    $max = (int) ($definition["max"] ?? 0);

    if ($max > 0 && textLength($value) > $max) {
        $error = "Must be " . $max . " characters or fewer.";
    }

    if ($type === "email" && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        $error = "Enter a valid email address.";
    }

    if ($type === "academic_year") {
        if (!preg_match('/^(\d{4})-(\d{4})$/', $value, $matches)) {
            $error = "Use the format YYYY-YYYY, for example 2026-2027.";
        } elseif ((int) $matches[2] !== (int) $matches[1] + 1) {
            $error = "The ending year must follow the starting year.";
        }
    }

    if ($type === "semester") {
        $allowedSemesters = ["First Semester", "Second Semester", "Summer"];

        if (!in_array($value, $allowedSemesters, true)) {
            $error = "Select a valid semester.";
        }
    }

    if ($type === "timezone") {
        if (!in_array($value, DateTimeZone::listIdentifiers(), true)) {
            $error = "Select a valid IANA timezone, for example Asia/Manila.";
        }
    }

    if (
        $error === null
        && in_array($key, [
            "institution_name",
            "institution_short_name",
            "campus_address",
            "contact_email",
            "contact_phone",
        ], true)
        && $value === ""
    ) {
        $error = "This field is required.";
    }

    return ["value" => $value, "error" => $error];
}

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        respond(200, [
            "success" => true,
            "data" => buildSettingsPayload($pdo),
        ]);
    }

    if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
        header("Allow: GET, PUT, OPTIONS");
        respond(405, [
            "success" => false,
            "message" => "Method not allowed.",
        ]);
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input) || json_last_error() !== JSON_ERROR_NONE) {
        respond(400, [
            "success" => false,
            "message" => "Invalid JSON request.",
        ]);
    }

    $incoming = $input["settings"] ?? $input;

    if (!is_array($incoming)) {
        respond(400, [
            "success" => false,
            "message" => "No settings were provided.",
        ]);
    }

    $definitions = settingDefinitions();
    $updates = [];
    $errors = [];

    foreach ($incoming as $key => $raw) {
        if (!isset($definitions[$key])) {
            continue;
        }

        $result = validateSettingValue($key, $raw, $definitions[$key]);

        if ($result["error"] !== null) {
            $errors[$key] = $result["error"];
        } else {
            $updates[$key] = $result["value"];
        }
    }

    if ($errors) {
        respond(422, [
            "success" => false,
            "message" => "Please correct the highlighted settings.",
            "errors" => $errors,
        ]);
    }

    if (!$updates) {
        respond(422, [
            "success" => false,
            "message" => "No valid settings were provided.",
        ]);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO system_settings (setting_key, setting_value, setting_group)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
            setting_value = VALUES(setting_value),
            setting_group = VALUES(setting_group)"
    );

    foreach ($updates as $key => $value) {
        $stmt->execute([$key, $value, $definitions[$key]["group"]]);
    }

    respond(200, [
        "success" => true,
        "message" => "System settings saved.",
        "data" => buildSettingsPayload($pdo),
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());

    respond(500, [
        "success" => false,
        "message" => "Unable to save system settings right now.",
    ]);
}
