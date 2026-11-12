<?php
// Course catalog and curriculum API.
//
// GET    /api/courses.php                 List courses (optional filters)
// POST   /api/courses.php                 Create a course
// PUT    /api/courses.php                 Update a course (course_id in body)
// DELETE /api/courses.php?id=123          Remove a course
//
// Every request requires an authenticated ADMIN or STAFF session.

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

$allowedPrograms = [
    "GENERAL", "BSIT", "BSIS", "BSCS", "BSBA", "BSA",
    "BSHM", "BSTM", "BSED", "BEED", "BSN",
];

$allowedYearLevels = [
    "First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year",
];

$allowedSemesters = [
    "First Semester", "Second Semester", "Summer",
];

$allowedStatuses = ["Active", "Inactive"];

function textLength(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value) : strlen($value);
}

function validateCourse(array $input): array
{
    global $allowedPrograms, $allowedYearLevels, $allowedSemesters, $allowedStatuses;

    $errors = [];

    $code = strtoupper(trim((string) ($input["course_code"] ?? "")));
    $title = trim((string) ($input["course_title"] ?? ""));
    $description = trim((string) ($input["description"] ?? ""));
    $program = strtoupper(trim((string) ($input["program"] ?? "")));
    $yearLevel = trim((string) ($input["year_level"] ?? ""));
    $semester = trim((string) ($input["semester"] ?? ""));
    $prerequisite = strtoupper(trim((string) ($input["prerequisite"] ?? "")));
    $status = trim((string) ($input["status"] ?? "Active"));

    $units = filter_var($input["units"] ?? null, FILTER_VALIDATE_FLOAT);
    $lectureHours = filter_var(
        $input["lecture_hours"] ?? 3,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 0, "max_range" => 40]]
    );
    $labHours = filter_var(
        $input["lab_hours"] ?? 0,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 0, "max_range" => 40]]
    );

    if ($code === "") {
        $errors["course_code"] = "Course code is required.";
    } elseif (textLength($code) > 20) {
        $errors["course_code"] = "Course code must be 20 characters or fewer.";
    }

    if ($title === "") {
        $errors["course_title"] = "Course title is required.";
    } elseif (textLength($title) > 150) {
        $errors["course_title"] = "Course title must be 150 characters or fewer.";
    }

    if (textLength($description) > 2000) {
        $errors["description"] = "Description must be 2,000 characters or fewer.";
    }

    if (!in_array($program, $allowedPrograms, true)) {
        $errors["program"] = "Select a valid program.";
    }

    if (!in_array($yearLevel, $allowedYearLevels, true)) {
        $errors["year_level"] = "Select a valid year level.";
    }

    if (!in_array($semester, $allowedSemesters, true)) {
        $errors["semester"] = "Select a valid semester.";
    }

    if ($units === false || $units < 0.5 || $units > 12) {
        $errors["units"] = "Units must be between 0.5 and 12.";
    }

    if ($lectureHours === false) {
        $errors["lecture_hours"] = "Lecture hours must be between 0 and 40.";
    }

    if ($labHours === false) {
        $errors["lab_hours"] = "Lab hours must be between 0 and 40.";
    }

    if (textLength($prerequisite) > 255) {
        $errors["prerequisite"] = "Prerequisite must be 255 characters or fewer.";
    }

    if ($prerequisite !== "" && $prerequisite === $code) {
        $errors["prerequisite"] = "A course cannot be its own prerequisite.";
    }

    if (!in_array($status, $allowedStatuses, true)) {
        $errors["status"] = "Status must be Active or Inactive.";
    }

    return [
        "errors" => $errors,
        "data" => [
            "course_code" => $code,
            "course_title" => $title,
            "description" => $description !== "" ? $description : null,
            "program" => $program,
            "year_level" => $yearLevel,
            "semester" => $semester,
            "units" => (float) $units,
            "lecture_hours" => (int) $lectureHours,
            "lab_hours" => (int) $labHours,
            "prerequisite" => $prerequisite !== "" ? $prerequisite : null,
            "status" => $status,
        ],
    ];
}

function fetchCourse(PDO $pdo, int $courseId): ?array
{
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE course_id = ? LIMIT 1");
    $stmt->execute([$courseId]);
    $course = $stmt->fetch();

    return $course ?: null;
}

$method = $_SERVER["REQUEST_METHOD"];

try {
    if ($method === "GET") {
        $sql = "SELECT * FROM courses";
        $conditions = [];
        $params = [];

        if (!empty($_GET["program"])) {
            $conditions[] = "program = ?";
            $params[] = strtoupper(trim((string) $_GET["program"]));
        }

        if (!empty($_GET["year_level"])) {
            $conditions[] = "year_level = ?";
            $params[] = trim((string) $_GET["year_level"]);
        }

        if (!empty($_GET["status"])) {
            $conditions[] = "status = ?";
            $params[] = trim((string) $_GET["status"]);
        }

        if (!empty($_GET["search"])) {
            $conditions[] = "(course_code LIKE ? OR course_title LIKE ?)";
            $term = "%" . trim((string) $_GET["search"]) . "%";
            $params[] = $term;
            $params[] = $term;
        }

        if ($conditions) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " ORDER BY
            FIELD(program, 'GENERAL', 'BSIT', 'BSIS', 'BSCS', 'BSBA', 'BSA',
                  'BSHM', 'BSTM', 'BSED', 'BEED', 'BSN'),
            FIELD(year_level, 'First Year', 'Second Year', 'Third Year',
                  'Fourth Year', 'Fifth Year'),
            FIELD(semester, 'First Semester', 'Second Semester', 'Summer'),
            course_code";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(200, [
            "success" => true,
            "data" => $stmt->fetchAll(),
        ]);
    }

    if ($method === "DELETE") {
        $courseId = (int) ($_GET["id"] ?? 0);

        if ($courseId <= 0) {
            respond(422, [
                "success" => false,
                "message" => "A valid course ID is required.",
            ]);
        }

        $stmt = $pdo->prepare("DELETE FROM courses WHERE course_id = ?");
        $stmt->execute([$courseId]);

        if ($stmt->rowCount() === 0) {
            respond(404, [
                "success" => false,
                "message" => "Course not found.",
            ]);
        }

        respond(200, [
            "success" => true,
            "message" => "Course removed from the catalog.",
        ]);
    }

    if ($method !== "POST" && $method !== "PUT") {
        header("Allow: GET, POST, PUT, DELETE, OPTIONS");
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

    $validation = validateCourse($input);

    if ($validation["errors"]) {
        respond(422, [
            "success" => false,
            "message" => "Please correct the highlighted fields.",
            "errors" => $validation["errors"],
        ]);
    }

    $data = $validation["data"];

    if ($method === "POST") {
        $stmt = $pdo->prepare("SELECT course_id FROM courses WHERE course_code = ? LIMIT 1");
        $stmt->execute([$data["course_code"]]);

        if ($stmt->fetch()) {
            respond(409, [
                "success" => false,
                "message" => "A course with that code already exists.",
            ]);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO courses (
                course_code, course_title, description, program, year_level,
                semester, units, lecture_hours, lab_hours, prerequisite, status
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $data["course_code"],
            $data["course_title"],
            $data["description"],
            $data["program"],
            $data["year_level"],
            $data["semester"],
            $data["units"],
            $data["lecture_hours"],
            $data["lab_hours"],
            $data["prerequisite"],
            $data["status"],
        ]);

        respond(201, [
            "success" => true,
            "message" => "Course added to the catalog.",
            "data" => fetchCourse($pdo, (int) $pdo->lastInsertId()),
        ]);
    }

    $courseId = (int) ($input["course_id"] ?? $_GET["id"] ?? 0);

    if ($courseId <= 0) {
        respond(422, [
            "success" => false,
            "message" => "A valid course ID is required.",
        ]);
    }

    if (!fetchCourse($pdo, $courseId)) {
        respond(404, [
            "success" => false,
            "message" => "Course not found.",
        ]);
    }

    $stmt = $pdo->prepare(
        "SELECT course_id FROM courses
         WHERE course_code = ? AND course_id <> ? LIMIT 1"
    );
    $stmt->execute([$data["course_code"], $courseId]);

    if ($stmt->fetch()) {
        respond(409, [
            "success" => false,
            "message" => "A course with that code already exists.",
        ]);
    }

    $stmt = $pdo->prepare(
        "UPDATE courses SET
            course_code = ?,
            course_title = ?,
            description = ?,
            program = ?,
            year_level = ?,
            semester = ?,
            units = ?,
            lecture_hours = ?,
            lab_hours = ?,
            prerequisite = ?,
            status = ?
         WHERE course_id = ?"
    );

    $stmt->execute([
        $data["course_code"],
        $data["course_title"],
        $data["description"],
        $data["program"],
        $data["year_level"],
        $data["semester"],
        $data["units"],
        $data["lecture_hours"],
        $data["lab_hours"],
        $data["prerequisite"],
        $data["status"],
        $courseId,
    ]);

    respond(200, [
        "success" => true,
        "message" => "Course updated.",
        "data" => fetchCourse($pdo, $courseId),
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());

    respond(500, [
        "success" => false,
        "message" => "Unable to save the course catalog right now.",
    ]);
}
