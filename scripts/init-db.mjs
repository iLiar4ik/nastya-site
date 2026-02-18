import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'

const url = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'data', 'payload.db')}`
const client = createClient({ url })

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  alt TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class TEXT,
  avatar_id INTEGER REFERENCES media(id),
  email TEXT,
  phone TEXT,
  attendance REAL DEFAULT 100,
  avg_test_score REAL,
  course_progress REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS students_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  subject TEXT,
  topic TEXT,
  file_id INTEGER REFERENCES media(id),
  file_url TEXT,
  content TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS materials_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  student_id INTEGER NOT NULL REFERENCES students(id),
  material_id INTEGER REFERENCES materials(id),
  status TEXT NOT NULL DEFAULT 'active',
  due_date TEXT NOT NULL,
  instructions TEXT,
  submitted_date TEXT,
  submission_type TEXT,
  submission_content TEXT,
  submission_file_id INTEGER REFERENCES media(id),
  grade REAL,
  teacher_comment TEXT,
  student_comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  topic TEXT,
  time_limit_minutes INTEGER DEFAULT 0,
  pass_threshold INTEGER DEFAULT 75,
  questions TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  tariff TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TEXT,
  paid_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

`

const dir = path.dirname(url.replace('file:', ''))
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const statements = schema.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)
for (const stmt of statements) {
  await client.execute(stmt + ';')
}
console.log('Database initialized')
process.exit(0)
