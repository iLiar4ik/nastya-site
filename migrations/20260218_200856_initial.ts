import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`students_subjects\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`subject\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`students\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`students_subjects_order_idx\` ON \`students_subjects\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`students_subjects_parent_id_idx\` ON \`students_subjects\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`students\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`class\` text,
  	\`avatar_id\` integer,
  	\`email\` text,
  	\`phone\` text,
  	\`attendance\` numeric DEFAULT 100,
  	\`avg_test_score\` numeric,
  	\`course_progress\` numeric DEFAULT 0,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`students_avatar_idx\` ON \`students\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`students_updated_at_idx\` ON \`students\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`students_created_at_idx\` ON \`students\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`materials_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`materials_tags_order_idx\` ON \`materials_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`materials_tags_parent_id_idx\` ON \`materials_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`materials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`category\` text,
  	\`subject\` text,
  	\`topic\` text,
  	\`file_id\` integer,
  	\`file_url\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`materials_file_idx\` ON \`materials\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`materials_updated_at_idx\` ON \`materials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`materials_created_at_idx\` ON \`materials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`homework\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`student_id\` integer NOT NULL,
  	\`material_id\` integer,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`due_date\` text NOT NULL,
  	\`instructions\` text,
  	\`submitted_date\` text,
  	\`submission_type\` text,
  	\`submission_content\` text,
  	\`submission_file_id\` integer,
  	\`grade\` numeric,
  	\`teacher_comment\` text,
  	\`student_comment\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`material_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`submission_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`homework_student_idx\` ON \`homework\` (\`student_id\`);`)
  await db.run(sql`CREATE INDEX \`homework_material_idx\` ON \`homework\` (\`material_id\`);`)
  await db.run(sql`CREATE INDEX \`homework_submission_file_idx\` ON \`homework\` (\`submission_file_id\`);`)
  await db.run(sql`CREATE INDEX \`homework_updated_at_idx\` ON \`homework\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`homework_created_at_idx\` ON \`homework\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tests_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`option\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tests_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tests_questions_options_order_idx\` ON \`tests_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tests_questions_options_parent_id_idx\` ON \`tests_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tests_questions_correct_answers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tests_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tests_questions_correct_answers_order_idx\` ON \`tests_questions_correct_answers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tests_questions_correct_answers_parent_id_idx\` ON \`tests_questions_correct_answers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tests_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`type\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tests_questions_order_idx\` ON \`tests_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tests_questions_parent_id_idx\` ON \`tests_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`subject\` text NOT NULL,
  	\`topic\` text,
  	\`time_limit_minutes\` numeric DEFAULT 0,
  	\`pass_threshold\` numeric DEFAULT 75,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`tests_updated_at_idx\` ON \`tests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tests_created_at_idx\` ON \`tests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`student_id\` integer NOT NULL,
  	\`tariff\` text NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`due_date\` text,
  	\`paid_date\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`payments_student_idx\` ON \`payments\` (\`student_id\`);`)
  await db.run(sql`CREATE INDEX \`payments_updated_at_idx\` ON \`payments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payments_created_at_idx\` ON \`payments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`students_id\` integer,
  	\`materials_id\` integer,
  	\`homework_id\` integer,
  	\`tests_id\` integer,
  	\`payments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`students_id\`) REFERENCES \`students\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`materials_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`homework_id\`) REFERENCES \`homework\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tests_id\`) REFERENCES \`tests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payments_id\`) REFERENCES \`payments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_students_id_idx\` ON \`payload_locked_documents_rels\` (\`students_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_materials_id_idx\` ON \`payload_locked_documents_rels\` (\`materials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_homework_id_idx\` ON \`payload_locked_documents_rels\` (\`homework_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tests_id_idx\` ON \`payload_locked_documents_rels\` (\`tests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`payments_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`students_subjects\`;`)
  await db.run(sql`DROP TABLE \`students\`;`)
  await db.run(sql`DROP TABLE \`materials_tags\`;`)
  await db.run(sql`DROP TABLE \`materials\`;`)
  await db.run(sql`DROP TABLE \`homework\`;`)
  await db.run(sql`DROP TABLE \`tests_questions_options\`;`)
  await db.run(sql`DROP TABLE \`tests_questions_correct_answers\`;`)
  await db.run(sql`DROP TABLE \`tests_questions\`;`)
  await db.run(sql`DROP TABLE \`tests\`;`)
  await db.run(sql`DROP TABLE \`payments\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
