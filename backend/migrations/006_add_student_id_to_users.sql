-- Add student_id column to users table for linking User (role='student') with Student
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES students(id) ON DELETE SET NULL;

-- Create index on student_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);

