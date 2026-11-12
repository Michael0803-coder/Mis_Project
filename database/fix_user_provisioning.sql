-- Student accounts are now created by api/student_accounts.php when an
-- administrator activates an enrollment. The old trigger referenced columns
-- that no longer exist on the redesigned `users` table (official_id,
-- student_name) and only ran for the lowercase status "approved", so it never
-- matched the "Active" status written by the approval endpoints.
--
-- Drop it so account provisioning has one implementation.

DROP TRIGGER IF EXISTS after_official_enrollments_insert;
