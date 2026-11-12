<?php
// Shared student-account provisioning for the approval endpoints.
//
// When an administrator moves an enrollment to Active:
//   1. A row is created in `users` (or an existing row is activated).
//   2. A temporary password is generated only when the account has none.
//   3. The credentials are emailed to the address on the application.
//
// The caller owns the database transaction. This helper only reads/writes the
// users table, so the account and enrollment changes commit together.

require_once __DIR__ . "/mailer.php";
require_once __DIR__ . "/settings_helper.php";

function buildApplicantName(array $applicant): string
{
    $parts = array_filter(
        [
            $applicant["first_name"] ?? "",
            $applicant["middle_name"] ?? "",
            $applicant["last_name"] ?? "",
            $applicant["suffix"] ?? "",
        ],
        fn($value) => trim((string) $value) !== ""
    );

    return trim(implode(" ", $parts));
}

function generateStudentNumber(int $enrollmentId, ?string $academicYear = null): string
{
    $year = trim((string) $academicYear);

    if (preg_match('/^(\d{4})/', $year, $matches)) {
        $year = $matches[1];
    } else {
        $year = date("Y");
    }

    return sprintf("MIS-%s-%04d", $year, $enrollmentId);
}

function generateTemporaryPassword(int $length = 12): string
{
    $upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    $lower = "abcdefghijkmnopqrstuvwxyz";
    $digits = "23456789";
    $symbols = "!@#$%";
    $all = $upper . $lower . $digits . $symbols;

    $password = [
        $upper[random_int(0, strlen($upper) - 1)],
        $lower[random_int(0, strlen($lower) - 1)],
        $digits[random_int(0, strlen($digits) - 1)],
        $symbols[random_int(0, strlen($symbols) - 1)],
    ];

    for ($i = count($password); $i < $length; $i++) {
        $password[] = $all[random_int(0, strlen($all) - 1)];
    }

    // Fisher-Yates shuffle so the guaranteed character types are not always
    // in the first four positions.
    for ($i = count($password) - 1; $i > 0; $i--) {
        $swap = random_int(0, $i);
        [$password[$i], $password[$swap]] = [$password[$swap], $password[$i]];
    }

    return implode("", $password);
}

function createOrActivateStudentAccount(PDO $pdo, array $applicant): array
{
    $enrollmentId = (int) ($applicant["enrollment_id"] ?? 0);
    $email = strtolower(trim((string) ($applicant["email"] ?? "")));
    $firstName = trim((string) ($applicant["first_name"] ?? ""));
    $middleName = trim((string) ($applicant["middle_name"] ?? ""));
    $lastName = trim((string) ($applicant["last_name"] ?? ""));
    $program = trim((string) ($applicant["program"] ?? ""));
    $fullName = buildApplicantName($applicant);

    if ($enrollmentId <= 0 || $email === "" || $firstName === "" || $lastName === "") {
        throw new InvalidArgumentException(
            "The application is missing the name, email, or enrollment ID."
        );
    }

    $studentNumber = generateStudentNumber(
        $enrollmentId,
        $applicant["academic_year"] ?? null
    );

    // Prefer the row tied to this enrollment. If none exists, reuse an account
    // with the same email (for example, a returning applicant).
    $stmt = $pdo->prepare("SELECT * FROM users WHERE enrollment_id = ? LIMIT 1");
    $stmt->execute([$enrollmentId]);
    $existing = $stmt->fetch();

    if (!$existing) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $existing = $stmt->fetch();
    }

    $password = null;
    $passwordGenerated = false;

    // Respect the minimum password length from System Settings, but never
    // generate a temporary password shorter than 12 characters.
    $passwordLength = max(
        12,
        systemSettingInt($pdo, "password_min_length", 12, 8, 64)
    );

    if ($existing) {
        if (trim((string) ($existing["password"] ?? "")) === "") {
            $password = generateTemporaryPassword($passwordLength);
            $passwordGenerated = true;
        }

        $stmt = $pdo->prepare(
            "UPDATE users
             SET enrollment_id = ?,
                 student_number = COALESCE(NULLIF(student_number, ''), ?),
                 first_name = ?,
                 middle_name = ?,
                 last_name = ?,
                 email = ?,
                 program = ?,
                 role = 'STUDENT',
                 account_status = 'ACTIVE',
                 email_verified_at = COALESCE(email_verified_at, NOW()),
                 password = COALESCE(NULLIF(password, ''), ?),
                 updated_at = NOW()
             WHERE id = ?"
        );

        $stmt->execute([
            $enrollmentId,
            $studentNumber,
            $firstName,
            $middleName !== "" ? $middleName : null,
            $lastName,
            $email,
            $program !== "" ? $program : null,
            $password,
            $existing["id"],
        ]);

        $userId = (int) $existing["id"];
        $created = false;
    } else {
        $password = generateTemporaryPassword($passwordLength);
        $passwordGenerated = true;

        $stmt = $pdo->prepare(
            "INSERT INTO users (
                enrollment_id,
                student_number,
                first_name,
                middle_name,
                last_name,
                email,
                password,
                program,
                role,
                account_status,
                email_verified_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'STUDENT', 'ACTIVE', NOW())"
        );

        $stmt->execute([
            $enrollmentId,
            $studentNumber,
            $firstName,
            $middleName !== "" ? $middleName : null,
            $lastName,
            $email,
            password_hash($password, PASSWORD_DEFAULT),
            $program !== "" ? $program : null,
        ]);

        $userId = (int) $pdo->lastInsertId();
        $created = true;
    }

    return [
        "created" => $created,
        "password_generated" => $passwordGenerated,
        "password" => $password,
        "user_id" => $userId,
        "enrollment_id" => $enrollmentId,
        "student_number" => $studentNumber,
        "email" => $email,
        "name" => $fullName,
        "program" => $program,
    ];
}

function sendStudentCredentialsEmail(array $account): array
{
    $config = loadMailConfig();
    $loginUrl = (string) ($config["app_url"] ?? "http://localhost:5173/#login");
    $name = htmlspecialchars($account["name"], ENT_QUOTES, "UTF-8");
    $email = htmlspecialchars($account["email"], ENT_QUOTES, "UTF-8");
    $studentNumber = htmlspecialchars($account["student_number"], ENT_QUOTES, "UTF-8");
    $password = htmlspecialchars((string) $account["password"], ENT_QUOTES, "UTF-8");
    $program = htmlspecialchars((string) ($account["program"] ?? ""), ENT_QUOTES, "UTF-8");

    $subject = "Your Apex Academy student account is active";

    $html = '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:560px;margin:0 auto;">'
        . '<h2 style="color:#4338ca;">Welcome to Apex Academy</h2>'
        . '<p>Hello ' . $name . ',</p>'
        . '<p>Your enrollment has been approved. Your student account is now active.</p>'
        . '<table style="border-collapse:collapse;margin:20px 0;">'
        . '<tr><td style="padding:4px 16px 4px 0;color:#64748b;">Student number</td><td style="font-weight:bold;">' . $studentNumber . '</td></tr>'
        . '<tr><td style="padding:4px 16px 4px 0;color:#64748b;">Email</td><td>' . $email . '</td></tr>'
        . ($program !== "" ? '<tr><td style="padding:4px 16px 4px 0;color:#64748b;">Program</td><td>' . $program . '</td></tr>' : '')
        . '<tr><td style="padding:4px 16px 4px 0;color:#64748b;">Temporary password</td><td style="font-family:monospace;font-weight:bold;background:#eef2ff;padding:4px 8px;border-radius:4px;">' . $password . '</td></tr>'
        . '</table>'
        . '<p><a href="' . htmlspecialchars($loginUrl, ENT_QUOTES, "UTF-8") . '" style="display:inline-block;background:#4f46e5;color:#ffffff;padding:10px 18px;border-radius:8px;text-decoration:none;">Sign in to the student portal</a></p>'
        . '<p>Please change your temporary password after your first sign-in. If you did not apply to Apex Academy, contact the IT Help Desk immediately.</p>'
        . '<p style="color:#64748b;font-size:12px;">This is an automated message from the Apex Academy Campus MIS.</p>'
        . '</div>';

    return sendSystemMail($account["email"], $subject, $html);
}
