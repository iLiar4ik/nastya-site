-- Create homework table
CREATE TABLE IF NOT EXISTS homework (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_homework_lesson_id ON homework(lesson_id);
CREATE INDEX IF NOT EXISTS idx_homework_student_id ON homework(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_status ON homework(status);
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON homework(due_date);

-- Create updated_at trigger
CREATE TRIGGER update_homework_updated_at BEFORE UPDATE ON homework
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

