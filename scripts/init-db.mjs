import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const defaultPath = process.env.NODE_ENV === 'production'
  ? '/app/data/payload.db'
  : path.join(process.cwd(), 'data', 'payload.db')
const url = process.env.DATABASE_URL ?? `file:${defaultPath}`
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
  access_code TEXT UNIQUE,
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

CREATE TABLE IF NOT EXISTS schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  subject TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS student_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER REFERENCES users(id),
  to_student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
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
// Add access_code to existing students table if missing
try {
  await client.execute('ALTER TABLE students ADD COLUMN access_code TEXT UNIQUE')
} catch (e) {
  if (!e.message?.includes('duplicate column')) throw e
}
// Add student_materials table if missing
try {
  await client.execute('CREATE TABLE IF NOT EXISTS student_materials (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE, created_at TEXT DEFAULT (datetime(\'now\')))')
} catch (e) {
  if (!e.message?.includes('already exists')) throw e
}
// Add messages table if missing
try {
  await client.execute('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, from_user_id INTEGER REFERENCES users(id), to_student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, content TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime(\'now\')))')
} catch (e) {
  if (!e.message?.includes('already exists')) throw e
}

// Auto-create admin user if it doesn't exist
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const adminName = process.env.ADMIN_NAME || 'Администратор'

try {
  const existingAdmin = await client.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [adminEmail.trim().toLowerCase()],
  })
  
  if (existingAdmin.rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 10)
    await client.execute({
      sql: 'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
      args: [adminEmail.trim().toLowerCase(), adminName, hash],
    })
    console.log(`Admin user created: ${adminEmail}`)
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }
} catch (e) {
  console.error('Error creating admin user:', e.message)
  // Don't fail the initialization if admin creation fails
}

console.log('Database initialized')
process.exit(0)
