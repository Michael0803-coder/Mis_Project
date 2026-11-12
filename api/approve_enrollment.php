<?php
// Approves a pending enrollment application.
// - Sets student_enrollments.enrollment_status to "Active"
// - Copies the applicant into official_enrollments
// Both writes happen in one transaction so they cannot get out of sync.

// Tell the browser this endpoint always returns JSON.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Answer the browser's CORS preflight request without running any logic.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// This endpoint only accepts POST; reject anything else.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit;
}

// Reuse the shared PDO connection from db.php.
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/settings_helper.php";
// Creates/activates the student's login account and emails the credentials.
require_once __DIR__ . "/student_accounts.php";

// Read the JSON body sent by admin.jsx, e.g. { "enrollment_id": 8 }.
$input = json_decode(file_get_contents("php://input"), true);
$enrollmentId = isset($input["enrollment_id"]) ? (int) $input["enrollment_id"] : 0;

// The ID must be a positive number before touching the database.
if ($enrollmentId <= 0) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Invalid enrollment_id."]);
    exit;
}

try {
    // Start a transaction so the status update and official insert succeed together.
    $pdo->beginTransaction();

    // Lock the applicant row while we read it, preventing two admins from
    // approving the same application at the same moment.
    $stmt = $pdo->prepare(
        "SELECT * FROM student_enrollments WHERE enrollment_id = ? FOR UPDATE"
    );
    $stmt->execute([$enrollmentId]);
    $applicant = $stmt->fetch();

    // Stop if the application does not exist.
    if (!$applicant) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Applicant not found."]);
        exit;
    }

    // Build "First Middle Last Suffix", skipping empty parts.
    $nameParts = array_filter(
        [
            $applicant["first_name"],
            $applicant["middle_name"],
            $applicant["last_name"],
            $applicant["suffix"],
        ],
        fn($value) => trim((string) $value) !== ""
    );
    // official_enrollments.student_name is varchar(100), so trim to 100 chars.
    $studentName = mb_substr(trim(implode(" ", $nameParts)), 0, 100);

    // Mark the original application as accepted. admin.jsx maps this value to
    // the "Active" status shown on the dashboard.
    $pdo->prepare(
        "UPDATE student_enrollments SET enrollment_status = 'Active' WHERE enrollment_id = ?"
    )->execute([$enrollmentId]);

    // Copy the applicant into official_enrollments.
    // status = 'Active' is what admin.jsx counts as an "Active Student".
    // enrollment_id is UNIQUE, so approving twice updates the same row instead
    // of creating a duplicate.
    $pdo->prepare(
        "INSERT INTO official_enrollments (enrollment_id, student_name, email, program, status)
         VALUES (?, ?, ?, ?, 'Active')
         ON DUPLICATE KEY UPDATE
            student_name = VALUES(student_name),
            email = VALUES(email),
            program = VALUES(program),
            status = 'Active'"
    )->execute([
        $enrollmentId,
        $studentName,
        $applicant["email"],
        $applicant["program"],
    ]);

    // Create or reactivate the student's login account in the same transaction.
    // A temporary password is generated only when the account has none.
    $account = createOrActivateStudentAccount($pdo, $applicant);

    // Save the enrollment, official row, and account together.
    $pdo->commit();

    // Email delivery happens after the commit because it cannot be rolled back.
    // A mail failure must not turn a successful approval into a 500 response.
    $emailResult = ["success" => false, "error" => ""];

    if ($account["password_generated"]) {
        if (!systemSettingBool($pdo, "email_notifications", true)) {
            $emailResult = [
                "success" => false,
                "error" => "Email notifications are disabled in System Settings.",
            ];
        } else {
            try {
                $emailResult = sendStudentCredentialsEmail($account);
            } catch (Throwable $mailError) {
                error_log($mailError->getMessage());
                $emailResult = ["success" => false, "error" => $mailError->getMessage()];
            }
        }
    }

    $response = [
        "success" => true,
        "message" => $account["password_generated"]
            ? "Applicant approved. Login credentials were prepared for the student."
            : "Applicant approved. The student already has an active login account.",
        "enrollment_id" => $enrollmentId,
        "account" => [
            "created" => $account["created"],
            "student_number" => $account["student_number"],
            "email" => $account["email"],
            "password_generated" => $account["password_generated"],
        ],
        "email_sent" => $emailResult["success"],
    ];

    // If the mail server is unavailable, give the administrator the temporary
    // password so the student can still sign in. It is never returned when the
    // email was delivered successfully.
    if ($account["password_generated"] && !$emailResult["success"]) {
        $response["temporary_password"] = $account["password"];
        $response["email_error"] = $emailResult["error"];
    }

    echo json_encode($response);
} catch (Throwable $e) {
    // Undo any partial write if something failed.
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Approval failed."]);
}
