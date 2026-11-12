-- Course catalog and administrative settings.
-- Safe to run more than once: tables use IF NOT EXISTS and seed rows use
-- INSERT IGNORE so existing edits are never overwritten.
--
-- Run with:
--   mysql -u root mis_project < database/courses_and_settings.sql

CREATE TABLE IF NOT EXISTS courses (
    course_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    program VARCHAR(30) NOT NULL,
    year_level VARCHAR(30) NOT NULL,
    semester VARCHAR(30) NOT NULL,
    units DECIMAL(4,1) NOT NULL DEFAULT 3.0,
    lecture_hours TINYINT UNSIGNED NOT NULL DEFAULT 3,
    lab_hours TINYINT UNSIGNED NOT NULL DEFAULT 0,
    prerequisite VARCHAR(255) NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id),
    UNIQUE KEY uq_courses_code (course_code),
    KEY idx_courses_program (program),
    KEY idx_courses_year_level (year_level),
    KEY idx_courses_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_group) VALUES
('institution_name', 'Apex Academy', 'institution'),
('institution_short_name', 'Campus MIS', 'institution'),
('campus_address', 'Apex Academy Main Campus, Philippines', 'institution'),
('contact_email', 'info@apexacademy.edu', 'institution'),
('contact_phone', '+63 2 8123 4567', 'institution'),
('current_academic_year', '2026-2027', 'academic'),
('current_semester', 'First Semester', 'academic'),
('timezone', 'Asia/Manila', 'academic'),
('email_notifications', '1', 'notifications'),
('session_timeout_minutes', '120', 'security'),
('password_min_length', '12', 'security');

INSERT IGNORE INTO courses
(course_code, course_title, program, year_level, semester, units, lecture_hours, lab_hours, prerequisite) VALUES
('GE101', 'Purposive Communication', 'GENERAL', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('GE102', 'Mathematics in the Modern World', 'GENERAL', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('GE103', 'Understanding the Self', 'GENERAL', 'First Year', 'Second Semester', 3.0, 3, 0, NULL),
('GE104', 'Readings in Philippine History', 'GENERAL', 'First Year', 'Second Semester', 3.0, 3, 0, NULL),
('GE105', 'Science, Technology, and Society', 'GENERAL', 'Second Year', 'First Semester', 3.0, 3, 0, NULL),

('IT101', 'Introduction to Computing', 'BSIT', 'First Year', 'First Semester', 3.0, 2, 1, NULL),
('IT102', 'Computer Programming 1', 'BSIT', 'First Year', 'First Semester', 3.0, 2, 1, NULL),
('IT103', 'Computer Programming 2', 'BSIT', 'First Year', 'Second Semester', 3.0, 2, 1, 'IT102'),
('IT201', 'Data Structures and Algorithms', 'BSIT', 'Second Year', 'First Semester', 3.0, 2, 1, 'IT103'),
('IT202', 'Database Management Systems', 'BSIT', 'Second Year', 'First Semester', 3.0, 2, 1, NULL),
('IT203', 'Web Systems and Technologies', 'BSIT', 'Second Year', 'Second Semester', 3.0, 2, 1, 'IT102'),
('IT301', 'Networking 1', 'BSIT', 'Third Year', 'First Semester', 3.0, 2, 1, NULL),
('IT302', 'Software Engineering', 'BSIT', 'Third Year', 'First Semester', 3.0, 3, 0, NULL),
('IT401', 'Capstone Project 1', 'BSIT', 'Fourth Year', 'First Semester', 3.0, 1, 2, NULL),
('IT402', 'Capstone Project 2', 'BSIT', 'Fourth Year', 'Second Semester', 3.0, 1, 2, 'IT401'),

('IS101', 'Fundamentals of Information Systems', 'BSIS', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('IS102', 'Business Process Management', 'BSIS', 'Second Year', 'First Semester', 3.0, 3, 0, NULL),
('IS201', 'Systems Analysis and Design', 'BSIS', 'Second Year', 'Second Semester', 3.0, 2, 1, NULL),
('IS301', 'Enterprise Systems', 'BSIS', 'Third Year', 'First Semester', 3.0, 2, 1, NULL),
('IS401', 'IS Project Management', 'BSIS', 'Fourth Year', 'First Semester', 3.0, 3, 0, NULL),

('CS101', 'Introduction to Computer Science', 'BSCS', 'First Year', 'First Semester', 3.0, 2, 1, NULL),
('CS102', 'Discrete Structures', 'BSCS', 'First Year', 'Second Semester', 3.0, 3, 0, NULL),
('CS201', 'Algorithms and Complexity', 'BSCS', 'Second Year', 'First Semester', 3.0, 2, 1, 'CS102'),
('CS301', 'Artificial Intelligence', 'BSCS', 'Third Year', 'First Semester', 3.0, 2, 1, 'CS201'),
('CS401', 'Machine Learning', 'BSCS', 'Fourth Year', 'First Semester', 3.0, 2, 1, 'CS301'),

('BA101', 'Principles of Management', 'BSBA', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('BA102', 'Principles of Marketing', 'BSBA', 'First Year', 'Second Semester', 3.0, 3, 0, NULL),
('BA201', 'Financial Accounting', 'BSBA', 'Second Year', 'First Semester', 3.0, 3, 0, NULL),
('BA301', 'Operations Management', 'BSBA', 'Third Year', 'First Semester', 3.0, 3, 0, NULL),
('BA401', 'Strategic Management', 'BSBA', 'Fourth Year', 'First Semester', 3.0, 3, 0, NULL),

('AC101', 'Fundamentals of Accounting', 'BSA', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('AC201', 'Intermediate Accounting 1', 'BSA', 'Second Year', 'First Semester', 3.0, 3, 0, 'AC101'),
('AC301', 'Auditing Theory', 'BSA', 'Third Year', 'First Semester', 3.0, 3, 0, 'AC201'),
('AC401', 'Accounting Research', 'BSA', 'Fourth Year', 'First Semester', 3.0, 3, 0, NULL),

('HM101', 'Introduction to Hospitality Management', 'BSHM', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('HM201', 'Food and Beverage Operations', 'BSHM', 'Second Year', 'First Semester', 3.0, 2, 1, NULL),
('HM301', 'Hotel Operations Management', 'BSHM', 'Third Year', 'First Semester', 3.0, 2, 1, NULL),
('HM401', 'Hospitality Strategic Management', 'BSHM', 'Fourth Year', 'First Semester', 3.0, 3, 0, NULL),

('TM101', 'Introduction to Tourism', 'BSTM', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('TM201', 'Travel and Tour Operations', 'BSTM', 'Second Year', 'First Semester', 3.0, 2, 1, NULL),
('TM301', 'Destination Management', 'BSTM', 'Third Year', 'First Semester', 3.0, 3, 0, NULL),
('TM401', 'Tourism Policy and Planning', 'BSTM', 'Fourth Year', 'First Semester', 3.0, 3, 0, NULL),

('ED101', 'Foundations of Education', 'BSED', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('ED201', 'Principles of Teaching', 'BSED', 'Second Year', 'First Semester', 3.0, 3, 0, NULL),
('ED301', 'Assessment of Learning', 'BSED', 'Third Year', 'First Semester', 3.0, 3, 0, NULL),
('ED401', 'Student Teaching', 'BSED', 'Fourth Year', 'First Semester', 6.0, 0, 6, NULL),

('EE101', 'Introduction to Elementary Education', 'BEED', 'First Year', 'First Semester', 3.0, 3, 0, NULL),
('EE201', 'Teaching Mathematics in the Elementary Grades', 'BEED', 'Second Year', 'First Semester', 3.0, 3, 0, NULL),
('EE301', 'Classroom Management', 'BEED', 'Third Year', 'First Semester', 3.0, 3, 0, NULL),
('EE401', 'Practice Teaching', 'BEED', 'Fourth Year', 'First Semester', 6.0, 0, 6, NULL),

('NU101', 'Fundamentals of Nursing', 'BSN', 'First Year', 'First Semester', 5.0, 3, 2, NULL),
('NU201', 'Maternal and Child Nursing', 'BSN', 'Second Year', 'First Semester', 5.0, 3, 2, NULL),
('NU301', 'Medical-Surgical Nursing', 'BSN', 'Third Year', 'First Semester', 5.0, 3, 2, NULL),
('NU401', 'Community Health Nursing', 'BSN', 'Fourth Year', 'First Semester', 5.0, 3, 2, NULL);
