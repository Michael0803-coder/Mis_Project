<?php
// Authenticates a user against the `users` table.
// Expected JSON body: { "email": "...", "password": "...", "role": "student|admin", "remember": true }
// On success the response contains the safe user record and the database role.
// The password column stores a password_hash() value; legacy plain-text values
// are accepted once and upgraded to a hash automatically.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function respond($status, $data)
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

require_once __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, [
        "success" => false,
        "message" => "Invalid JSON request.",
    ]);
}

$email = strtolower(trim((string) ($input["email"] ?? "")));
$password = (string) ($input["password"] ?? "");
$requestedRole = strtoupper(trim((string) ($input["role"] ?? "")));
$remember = !empty($input["remember"]);

if ($email === "" || $password === "") {
    respond(422, [
        "success" => false,
        "message" => "Please enter your email address and password.",
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, [
        "success" => false,
        "message" => "Please enter a valid email address.",
    ]);
}

// "admin" is the UI tab; the database also uses STAFF for administrative users.
if ($requestedRole === "ADMIN" || $requestedRole === "STAFF") {
    $allowedRoles = ["ADMIN", "STAFF"];
} elseif ($requestedRole === "STUDENT") {
    $allowedRoles = ["STUDENT"];
} else {
    respond(422, [
        "success" => false,
        "message" => "Please select a valid account type.",
    ]);
}

try {
    $stmt = $pdo->prepare(
        "SELECT id, enrollment_id, student_number, first_name, middle_name,
                last_name, email, password, program, role, account_status
         FROM users
         WHERE email = ?
         LIMIT 1"
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Use the same generic message for unknown email and wrong password so the
    // endpoint does not reveal which accounts exist.
    if (!$user) {
        respond(401, [
            "success" => false,
            "message" => "Incorrect email or password.",
        ]);
    }

    $storedPassword = (string) ($user["password"] ?? "");

    if ($storedPassword === "") {
        respond(403, [
            "success" => false,
            "message" => "This account has not been activated yet. Please contact the IT Help Desk.",
        ]);
    }

    $passwordMatches = password_verify($password, $storedPassword);

    // Support older rows that were saved before password hashing was used.
    // Only compare plain text when the stored value is not already a hash, so
    // a leaked hash can never be used as the password.
    $storedIsHash = password_get_info($storedPassword)["algo"] !== null;

    if (!$passwordMatches && !$storedIsHash && hash_equals($storedPassword, $password)) {
        $passwordMatches = true;
        $pdo->prepare("UPDATE users SET password = ? WHERE id = ?")
            ->execute([password_hash($password, PASSWORD_DEFAULT), $user["id"]]);
    }

    if (!$passwordMatches) {
        respond(401, [
            "success" => false,
            "message" => "Incorrect email or password.",
        ]);
    }

    $accountStatus = strtoupper((string) $user["account_status"]);

    if ($accountStatus === "PENDING") {
        respond(403, [
            "success" => false,
            "message" => "Your account is still pending approval. Please contact the Admissions Office.",
        ]);
    }

    if ($accountStatus !== "ACTIVE") {
        respond(403, [
            "success" => false,
            "message" => "This account is inactive. Please contact the IT Help Desk.",
        ]);
    }

    if (!in_array($user["role"], $allowedRoles, true)) {
        respond(403, [
            "success" => false,
            "message" => $allowedRoles === ["STUDENT"]
                ? "This account is not registered as a student account."
                : "This account does not have administrator access.",
        ]);
    }

    // Build the display name without leaving double spaces when middle name or
    // other optional parts are empty.
    $nameParts = array_filter(
        [$user["first_name"], $user["middle_name"], $user["last_name"]],
        fn($value) => trim((string) $value) !== ""
    );
    $fullName = trim(implode(" ", $nameParts));

    // Persist the signed-in user in the PHP session. "Remember me" extends the
    // session cookie to 30 days; otherwise it lasts until the browser closes.
    $lifetime = $remember ? 60 * 60 * 24 * 30 : 0;

    if (session_status() === PHP_SESSION_NONE) {
        ini_set("session.gc_maxlifetime", (string) max($lifetime, 1440));
        session_set_cookie_params([
            "lifetime" => $lifetime,
            "path" => "/",
            "httponly" => true,
            "samesite" => "Lax",
        ]);
        session_start();
    }

    session_regenerate_id(true);

    $_SESSION["user_id"] = (int) $user["id"];
    $_SESSION["user_role"] = $user["role"];
    $_SESSION["user_name"] = $fullName;
    $_SESSION["user_email"] = $user["email"];

    respond(200, [
        "success" => true,
        "message" => "Signed in successfully.",
        "role" => $user["role"],
        "user" => [
            "id" => (int) $user["id"],
            "enrollment_id" => (int) $user["enrollment_id"],
            "student_number" => $user["student_number"],
            "name" => $fullName,
            "first_name" => $user["first_name"],
            "middle_name" => $user["middle_name"],
            "last_name" => $user["last_name"],
            "email" => $user["email"],
            "program" => $user["program"],
            "role" => $user["role"],
            "account_status" => $accountStatus,
        ],
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());

    respond(500, [
        "success" => false,
        "message" => "Unable to sign in right now. Please try again.",
    ]);
}
