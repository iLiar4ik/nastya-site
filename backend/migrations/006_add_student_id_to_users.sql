-- Add student_id column to users table for linking User (role='student') with Student
-- First add column without foreign key constraint
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id INTEGER;

-- Add foreign key constraint separately (this will only work if all existing student_id values are valid or NULL)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_student_id_fkey' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users 
        ADD CONSTRAINT users_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index on student_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);

