<?php

// Allow React to access this PHP API
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle browser preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Database connection
$host = "localhost";
$dbname = "mis_project";
$username = "root";
$password = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}

// GET: Retrieve all students or one student
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        if (isset($_GET["student_id"])) {
            $stmt = $pdo->prepare(
                "SELECT * FROM students WHERE student_id = ?"
            );

            $stmt->execute([$_GET["student_id"]]);
            $student = $stmt->fetch();

            if (!$student) {
                http_response_code(404);

                echo json_encode([
                    "success" => false,
                    "message" => "Student not found."
                ]);

                exit;
            }

            echo json_encode([
                "success" => true,
                "data" => $student
            ]);
        } else {
            $stmt = $pdo->query(
                "SELECT * FROM students ORDER BY id DESC"
            );

            echo json_encode([
                "success" => true,
                "data" => $stmt->fetchAll()
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Failed to retrieve student records."
        ]);
    }

    exit;
}

// POST: Add a student
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON request."
        ]);

        exit;
    }

    $required = ["student_id", "name", "email"];

    foreach ($required as $field) {
        if (
            !isset($input[$field]) ||
            !is_string($input[$field]) ||
            trim($input[$field]) === ""
        ) {
            http_response_code(422);

            echo json_encode([
                "success" => false,
                "message" => "Missing required field: $field"
            ]);

            exit;
        }
    }

    try {
        $sql = "INSERT INTO students (
            student_id, name, email, avatar, department, major,
            year_level, status, advisor, phone, enrollment_date,
            cgpa, major_gpa, credits_earned, total_required,
            academic_standing, attendance_rate
        ) VALUES (
            :student_id, :name, :email, :avatar, :department, :major,
            :year_level, :status, :advisor, :phone, :enrollment_date,
            :cgpa, :major_gpa, :credits_earned, :total_required,
            :academic_standing, :attendance_rate
        )";

        $stmt = $pdo->prepare($sql);

        $fields = [
            "student_id", "name", "email", "avatar", "department",
            "major", "year_level", "status", "advisor", "phone",
            "enrollment_date", "cgpa", "major_gpa", "credits_earned",
            "total_required", "academic_standing", "attendance_rate"
        ];

        $data = [];

        foreach ($fields as $field) {
            $data[$field] = $input[$field] ?? null;
        }

        $stmt->execute($data);

        http_response_code(201);

        echo json_encode([
            "success" => true,
            "message" => "Student added successfully.",
            "student_id" => $data["student_id"]
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === "23000") {
            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Student ID or email already exists."
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Failed to save student."
            ]);
        }
    }

    exit;
}

// Unsupported method
http_response_code(405);

echo json_encode([
    "success" => false,
    "message" => "Method not allowed."
]);
