-- Create analytics table for storing aggregated metrics
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_student_id ON analytics(student_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON analytics(user_id, date);


