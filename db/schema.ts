import {
  sqliteTable,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  mimeType: text('mime_type'),
  alt: text('alt'),
  createdAt: text('created_at').default("(datetime('now'))"),
})

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // для совместимости: firstName + ' ' + lastName
  firstName: text('first_name'),
  lastName: text('last_name'),
  class: text('class'),
  avatarId: integer('avatar_id').references(() => media.id),
  attendance: real('attendance').default(100),
  avgTestScore: real('avg_test_score'),
  courseProgress: real('course_progress').default(0),
  notes: text('notes'), // доп. информация
  accessCode: text('access_code').unique(),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const studentsSubjects = sqliteTable('students_subjects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
})

export const materialFolders = sqliteTable('material_folders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  parentId: integer('parent_id'), // self-ref: parent folder (FK in DB via init-db)
  name: text('name').notNull(),
  createdAt: text('created_at').default("(datetime('now'))"),
})

export const materials = sqliteTable('materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  folderId: integer('folder_id').references(() => materialFolders.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  type: text('type').notNull(), // pdf, doc, image, video, link, note, file
  category: text('category'),
  subject: text('subject'),
  topic: text('topic'),
  fileId: integer('file_id').references(() => media.id),
  fileUrl: text('file_url'),
  content: text('content'),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const materialsTags = sqliteTable('materials_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
})

export const homework = sqliteTable('homework', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  studentId: integer('student_id').notNull().references(() => students.id),
  materialId: integer('material_id').references(() => materials.id),
  attachmentFileId: integer('attachment_file_id').references(() => media.id), // файл от учителя
  status: text('status').notNull().default('active'), // active, review, checked, overdue
  dueDate: text('due_date').notNull(),
  instructions: text('instructions'),
  submittedDate: text('submitted_date'),
  submissionType: text('submission_type'),
  submissionContent: text('submission_content'),
  submissionFileId: integer('submission_file_id').references(() => media.id), // файл от ученика
  grade: real('grade'),
  teacherComment: text('teacher_comment'),
  studentComment: text('student_comment'),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const tests = sqliteTable('tests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  subject: text('subject').notNull(),
  topic: text('topic'),
  timeLimitMinutes: integer('time_limit_minutes').default(0),
  passThreshold: integer('pass_threshold').default(75),
  questions: text('questions').notNull(), // JSON
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => students.id),
  tariff: text('tariff').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('pending'), // pending, paid, overdue
  dueDate: text('due_date'),
  paidDate: text('paid_date'),
  notes: text('notes'),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
})

export const schedule = sqliteTable('schedule', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').references(() => students.id), // null = свободное окно
  subject: text('subject').notNull(),
  scheduledAt: text('scheduled_at').notNull(), // ISO datetime
  durationMinutes: integer('duration_minutes').default(60),
  notes: text('notes'),
  createdAt: text('created_at').default("(datetime('now'))"),
})

export const studentMaterials = sqliteTable('student_materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default("(datetime('now'))"),
})

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fromUserId: integer('from_user_id').references(() => users.id), // null = от ученика
  toStudentId: integer('to_student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: integer('is_read').default(0), // 0 = false, 1 = true
  createdAt: text('created_at').default("(datetime('now'))"),
})

export type User = typeof users.$inferSelect
export type Media = typeof media.$inferSelect
export type Student = typeof students.$inferSelect
export type MaterialFolder = typeof materialFolders.$inferSelect
export type Material = typeof materials.$inferSelect
export type Homework = typeof homework.$inferSelect
export type Test = typeof tests.$inferSelect
export type Payment = typeof payments.$inferSelect
export type Schedule = typeof schedule.$inferSelect
export type StudentMaterial = typeof studentMaterials.$inferSelect
export type Message = typeof messages.$inferSelect
