<?php
// Updates one enrollment's status from the admin Edit dialog.
// - "Active"  -> student_enrollments = Active and upserts official_enrollments
// - "Inactive"-> student_enrollments = Inactive and marks official row Inactive
// - others    -> student_enrollments = Pending/Rejected and removes the
//                official_enrollments row, because the student is no longer official.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit;
}

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/settings_helper.php";
// Used when the new status is Active so the student gets a login account.
require_once __DIR__ . "/student_accounts.php";

// Expected body: { "enrollment_id": 8, "status": "Active" }
$input = json_decode(file_get_contents("php://input"), true);
$enrollmentId = isset($input["enrollment_id"]) ? (int) $input["enrollment_id"] : 0;
$status = isset($input["status"]) ? trim((string) $input["status"]) : "";

// Only these values are allowed so the dashboard counts stay predictable.
$allowedStatuses = ["Pending", "Active", "Inactive", "Rejected"];

if ($enrollmentId <= 0 || !in_array($status, $allowedStatuses, true)) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Invalid enrollment_id or status."]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Lock the application row before changing anything.
    $stmt = $pdo->prepare(
        "SELECT * FROM student_enrollments WHERE enrollment_id = ? FOR UPDATE"
    );
    $stmt->execute([$enrollmentId]);
    $applicant = $stmt->fetch();

    if (!$applicant) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Applicant not found."]);
        exit;
    }

    // 1. Always update the source application row.
    $pdo->prepare(
        "UPDATE student_enrollments SET enrollment_status = ? WHERE enrollment_id = ?"
    )->execute([$status, $enrollmentId]);

    // Filled in only when the student is activated; the email is sent after
    // the transaction commits.
    $account = null;

    if ($status === "Active") {
        // 2a. Active means the student belongs in official_enrollments.
        $nameParts = array_filter(
            [
                $applicant["first_name"],
                $applicant["middle_name"],
                $applicant["last_name"],
                $applicant["suffix"],
            ],
            fn($value) => trim((string) $value) !== ""
        );
        $studentName = mb_substr(trim(implode(" ", $nameParts)), 0, 100);

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

        // Create the login account on first activation, or reactivate an
        // existing account. A temporary password is generated only when the
        // account has never had one.
        $account = createOrActivateStudentAccount($pdo, $applicant);
    } elseif ($status === "Inactive") {
        // 2b. Keep the official row but mark it Inactive so the dashboard
        // stops counting it under "Active Students".
        $pdo->prepare(
            "UPDATE official_enrollments SET status = 'Inactive' WHERE enrollment_id = ?"
        )->execute([$enrollmentId]);

        // Block the matching login account as well.
        $pdo->prepare(
            "UPDATE users SET account_status = 'INACTIVE', updated_at = NOW()
             WHERE enrollment_id = ?"
        )->execute([$enrollmentId]);
    } else {
        // 2c. Pending/Rejected are not official students.
        $pdo->prepare(
            "DELETE FROM official_enrollments WHERE enrollment_id = ?"
        )->execute([$enrollmentId]);

        // Pending accounts are blocked until approved again; rejected accounts
        // stay inactive.
        $userStatus = $status === "Pending" ? "PENDING" : "INACTIVE";
        $pdo->prepare(
            "UPDATE users SET account_status = ?, updated_at = NOW()
             WHERE enrollment_id = ?"
        )->execute([$userStatus, $enrollmentId]);
    }

    $pdo->commit();

    // Email delivery happens after the commit because it cannot be rolled back.
    // A mail failure must not turn a successful status change into a 500.
    $emailResult = ["success" => false, "error" => ""];

    if ($account && $account["password_generated"]) {
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
        "message" => "Enrollment status updated.",
        "enrollment_id" => $enrollmentId,
        "status" => $status,
    ];

    if ($account) {
        $response["account"] = [
            "created" => $account["created"],
            "student_number" => $account["student_number"],
            "email" => $account["email"],
            "password_generated" => $account["password_generated"],
        ];
        $response["email_sent"] = $emailResult["success"];

        // If the mail server is unavailable, return the temporary password so
        // the administrator can give it to the student directly.
        if ($account["password_generated"] && !$emailResult["success"]) {
            $response["temporary_password"] = $account["password"];
            $response["email_error"] = $emailResult["error"];
        }
    }

    echo json_encode($response);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to update enrollment status."]);
}
