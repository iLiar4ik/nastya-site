-- Create lesson_notes table
CREATE TABLE IF NOT EXISTS lesson_notes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lesson_notes_lesson_id ON lesson_notes(lesson_id);

-- Create updated_at trigger
CREATE TRIGGER update_lesson_notes_updated_at BEFORE UPDATE ON lesson_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


