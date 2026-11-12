<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function respond($status, $data) {  
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// GET: list all enrollment applications (used by the admin dashboard)
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    require_once __DIR__ . "/db.php";

    try {
        $stmt = $pdo->query(
            "SELECT * FROM student_enrollments ORDER BY enrollment_id DESC"
        );

        respond(200, [
            "success" => true,
            "data" => $stmt->fetchAll()
        ]);
    } catch (PDOException $e) {
        error_log($e->getMessage());

        respond(500, [
            "success" => false,
            "message" => "Unable to load enrollment applications."
        ]);
    }
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: GET, POST, OPTIONS");

    respond(405, [
        "success" => false,
        "message" => "Only GET and POST requests are allowed."
    ]);
}

require_once __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, [
        "success" => false,
        "message" => "Invalid JSON request."
    ]);
}

$requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "sex",
    "email",
    "mobileNumber",
    "currentAddress",
    "program",
    "academicYear",
    "semester",
    "yearLevel",
    "studentType",
    "guardianName",
    "guardianRelationship",
    "guardianContact"
];

foreach ($requiredFields as $field) {
    if (
        !isset($input[$field]) ||
        !is_string($input[$field]) ||
        trim($input[$field]) === ""
    ) {
        respond(422, [
            "success" => false,
            "message" => "Please complete all required fields."
        ]);
    }
}

$data = [];

foreach ($input as $key => $value) {
    if (!is_string($value)) {
        respond(422, [
            "success" => false,
            "message" => "Invalid form field."
        ]);
    }

    $data[$key] = trim($value);
}

if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
    respond(422, [
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);
}

$date = DateTime::createFromFormat(
    "!Y-m-d",
    $data["dateOfBirth"]
);

if (
    !$date ||
    $date->format("Y-m-d") !== $data["dateOfBirth"] ||
    $date > new DateTime("today")
) {
    respond(422, [
        "success" => false,
        "message" => "Please enter a valid date of birth."
    ]);
}

$allowedPrograms = [
    "BSIT", "BSIS", "BSCS", "BSBA", "BSA",
    "BSHM", "BSTM", "BSED", "BEED", "BSN"
];

$allowedSemesters = [
    "First Semester",
    "Second Semester",
    "Summer"
];

$allowedYearLevels = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year"
];

$allowedStudentTypes = [
    "New Student",
    "Continuing Student",
    "Transferee",
    "Returning Student"
];

$allowedSex = [
    "Male",
    "Female",
    "Prefer not to say"
];

$allowedRelationships = [
    "Mother",
    "Father",
    "Guardian",
    "Other"
];

if (!in_array($data["program"], $allowedPrograms, true)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid program selection."
    ]);
}

if (!in_array($data["semester"], $allowedSemesters, true)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid semester selection."
    ]);
}

if (!in_array($data["yearLevel"], $allowedYearLevels, true)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid year level."
    ]);
}

if (!in_array($data["studentType"], $allowedStudentTypes, true)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid student type."
    ]);
}

if (!in_array($data["sex"], $allowedSex, true)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid sex selection."
    ]);
}

if (!in_array(
    $data["guardianRelationship"],
    $allowedRelationships,
    true
)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid guardian relationship."
    ]);
}

if (!preg_match(
    '/^\d{4}-\d{4}$/',
    $data["academicYear"]
)) {
    respond(422, [
        "success" => false,
        "message" => "Invalid academic year."
    ]);
}

try {
    $sql = "INSERT INTO student_enrollments (
        first_name,
        middle_name,
        last_name,
        suffix,
        date_of_birth,
        sex,
        nationality,
        email,
        mobile_number,
        current_address,
        permanent_address,
        program,
        academic_year,
        semester,
        year_level,
        student_type,
        previous_school,
        guardian_name,
        guardian_relationship,
        guardian_contact,
        guardian_address
    ) VALUES (
        :first_name,
        :middle_name,
        :last_name,
        :suffix,
        :date_of_birth,
        :sex,
        :nationality,
        :email,
        :mobile_number,
        :current_address,
        :permanent_address,
        :program,
        :academic_year,
        :semester,
        :year_level,
        :student_type,
        :previous_school,
        :guardian_name,
        :guardian_relationship,
        :guardian_contact,
        :guardian_address
    )";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "first_name" => $data["firstName"],
        "middle_name" => $data["middleName"] ?? null,
        "last_name" => $data["lastName"],
        "suffix" => $data["suffix"] ?? null,
        "date_of_birth" => $data["dateOfBirth"],
        "sex" => $data["sex"],
        "nationality" => $data["nationality"] ?? "Filipino",
        "email" => $data["email"],
        "mobile_number" => $data["mobileNumber"],
        "current_address" => $data["currentAddress"],
        "permanent_address" => $data["permanentAddress"] ?? null,
        "program" => $data["program"],
        "academic_year" => $data["academicYear"],
        "semester" => $data["semester"],
        "year_level" => $data["yearLevel"],
        "student_type" => $data["studentType"],
        "previous_school" => $data["previousSchool"] ?? null,
        "guardian_name" => $data["guardianName"],
        "guardian_relationship" => $data["guardianRelationship"],
        "guardian_contact" => $data["guardianContact"],
        "guardian_address" => $data["guardianAddress"] ?? null
    ]);

    respond(201, [
        "success" => true,
        "message" => "Enrollment application submitted successfully.",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    respond(500, [
        "success" => false,
        "message" => "Unable to save the enrollment. Please try again."
    ]);
}
