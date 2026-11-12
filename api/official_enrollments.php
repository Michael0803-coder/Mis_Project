<?php
// Returns every approved student from official_enrollments.
// admin.jsx uses this list to fill the "Active Students" card and the
// User Directory after an applicant is approved.

// Tell the browser this endpoint always returns JSON.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Answer the browser's CORS preflight request without running any logic.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// This endpoint only accepts GET; reject anything else.
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only GET requests are allowed."]);
    exit;
}

// Reuse the shared PDO connection from db.php.
require_once __DIR__ . "/db.php";

try {
    // Newest official students first. Include the academic fields from the
    // original application so reports can show year level and term for
    // approved students, not just pending applicants.
    $stmt = $pdo->query(
        "SELECT o.*, s.year_level, s.academic_year, s.semester, s.student_type
         FROM official_enrollments o
         LEFT JOIN student_enrollments s ON s.enrollment_id = o.enrollment_id
         ORDER BY o.official_id DESC"
    );

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll(),
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to load official students."]);
}
