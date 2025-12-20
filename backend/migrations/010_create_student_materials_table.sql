-- Create student_materials table for many-to-many relationship
CREATE TABLE IF NOT EXISTS student_materials (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, material_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_materials_student_id ON student_materials(student_id);
CREATE INDEX IF NOT EXISTS idx_student_materials_material_id ON student_materials(material_id);

