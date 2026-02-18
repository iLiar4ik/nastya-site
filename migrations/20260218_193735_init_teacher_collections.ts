import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_materials_tags_tag" AS ENUM('homework', 'test', 'summary', 'video', 'formulas', 'oge', 'ege');
  CREATE TYPE "public"."enum_materials_type" AS ENUM('pdf', 'doc', 'image', 'video', 'link', 'note');
  CREATE TYPE "public"."enum_materials_category" AS ENUM('5', '6', '7', '8', '9', '10', '11');
  CREATE TYPE "public"."enum_materials_subject" AS ENUM('algebra', 'geometry', 'math');
  CREATE TYPE "public"."enum_homework_status" AS ENUM('active', 'review', 'checked', 'overdue');
  CREATE TYPE "public"."enum_homework_submission_type" AS ENUM('text', 'image', 'file');
  CREATE TYPE "public"."enum_tests_questions_type" AS ENUM('single-choice', 'multiple-choice', 'text-input');
  CREATE TYPE "public"."enum_tests_subject" AS ENUM('algebra', 'geometry', 'math');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'paid', 'overdue');
  CREATE TABLE "students_subjects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subject" varchar NOT NULL
  );
  
  CREATE TABLE "students" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"class" varchar,
  	"avatar_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"attendance" numeric DEFAULT 100,
  	"avg_test_score" numeric,
  	"course_progress" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "materials_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_materials_tags_tag"
  );
  
  CREATE TABLE "materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_materials_type" NOT NULL,
  	"category" "enum_materials_category",
  	"subject" "enum_materials_subject",
  	"topic" varchar,
  	"file_id" integer,
  	"file_url" varchar,
  	"content" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homework" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"student_id" integer NOT NULL,
  	"material_id" integer,
  	"status" "enum_homework_status" DEFAULT 'active' NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"instructions" varchar,
  	"submitted_date" timestamp(3) with time zone,
  	"submission_type" "enum_homework_submission_type",
  	"submission_content" varchar,
  	"submission_file_id" integer,
  	"grade" numeric,
  	"teacher_comment" varchar,
  	"student_comment" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tests_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar
  );
  
  CREATE TABLE "tests_questions_correct_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "tests_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"type" "enum_tests_questions_type" NOT NULL
  );
  
  CREATE TABLE "tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"subject" "enum_tests_subject" NOT NULL,
  	"topic" varchar,
  	"time_limit_minutes" numeric DEFAULT 0,
  	"pass_threshold" numeric DEFAULT 75,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"student_id" integer NOT NULL,
  	"tariff" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"due_date" timestamp(3) with time zone,
  	"paid_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "students_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "materials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "homework_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payments_id" integer;
  ALTER TABLE "students_subjects" ADD CONSTRAINT "students_subjects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials_tags" ADD CONSTRAINT "materials_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homework" ADD CONSTRAINT "homework_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homework" ADD CONSTRAINT "homework_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homework" ADD CONSTRAINT "homework_submission_file_id_media_id_fk" FOREIGN KEY ("submission_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tests_questions_options" ADD CONSTRAINT "tests_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tests_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tests_questions_correct_answers" ADD CONSTRAINT "tests_questions_correct_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tests_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tests_questions" ADD CONSTRAINT "tests_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "students_subjects_order_idx" ON "students_subjects" USING btree ("_order");
  CREATE INDEX "students_subjects_parent_id_idx" ON "students_subjects" USING btree ("_parent_id");
  CREATE INDEX "students_avatar_idx" ON "students" USING btree ("avatar_id");
  CREATE INDEX "students_updated_at_idx" ON "students" USING btree ("updated_at");
  CREATE INDEX "students_created_at_idx" ON "students" USING btree ("created_at");
  CREATE INDEX "materials_tags_order_idx" ON "materials_tags" USING btree ("_order");
  CREATE INDEX "materials_tags_parent_id_idx" ON "materials_tags" USING btree ("_parent_id");
  CREATE INDEX "materials_file_idx" ON "materials" USING btree ("file_id");
  CREATE INDEX "materials_updated_at_idx" ON "materials" USING btree ("updated_at");
  CREATE INDEX "materials_created_at_idx" ON "materials" USING btree ("created_at");
  CREATE INDEX "homework_student_idx" ON "homework" USING btree ("student_id");
  CREATE INDEX "homework_material_idx" ON "homework" USING btree ("material_id");
  CREATE INDEX "homework_submission_file_idx" ON "homework" USING btree ("submission_file_id");
  CREATE INDEX "homework_updated_at_idx" ON "homework" USING btree ("updated_at");
  CREATE INDEX "homework_created_at_idx" ON "homework" USING btree ("created_at");
  CREATE INDEX "tests_questions_options_order_idx" ON "tests_questions_options" USING btree ("_order");
  CREATE INDEX "tests_questions_options_parent_id_idx" ON "tests_questions_options" USING btree ("_parent_id");
  CREATE INDEX "tests_questions_correct_answers_order_idx" ON "tests_questions_correct_answers" USING btree ("_order");
  CREATE INDEX "tests_questions_correct_answers_parent_id_idx" ON "tests_questions_correct_answers" USING btree ("_parent_id");
  CREATE INDEX "tests_questions_order_idx" ON "tests_questions" USING btree ("_order");
  CREATE INDEX "tests_questions_parent_id_idx" ON "tests_questions" USING btree ("_parent_id");
  CREATE INDEX "tests_updated_at_idx" ON "tests" USING btree ("updated_at");
  CREATE INDEX "tests_created_at_idx" ON "tests" USING btree ("created_at");
  CREATE INDEX "payments_student_idx" ON "payments" USING btree ("student_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_homework_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homework"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tests_fk" FOREIGN KEY ("tests_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_students_id_idx" ON "payload_locked_documents_rels" USING btree ("students_id");
  CREATE INDEX "payload_locked_documents_rels_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("materials_id");
  CREATE INDEX "payload_locked_documents_rels_homework_id_idx" ON "payload_locked_documents_rels" USING btree ("homework_id");
  CREATE INDEX "payload_locked_documents_rels_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("tests_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "students_subjects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "materials_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "materials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homework" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tests_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tests_questions_correct_answers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tests_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "students_subjects" CASCADE;
  DROP TABLE "students" CASCADE;
  DROP TABLE "materials_tags" CASCADE;
  DROP TABLE "materials" CASCADE;
  DROP TABLE "homework" CASCADE;
  DROP TABLE "tests_questions_options" CASCADE;
  DROP TABLE "tests_questions_correct_answers" CASCADE;
  DROP TABLE "tests_questions" CASCADE;
  DROP TABLE "tests" CASCADE;
  DROP TABLE "payments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_students_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_materials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_homework_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payments_fk";
  
  DROP INDEX "payload_locked_documents_rels_students_id_idx";
  DROP INDEX "payload_locked_documents_rels_materials_id_idx";
  DROP INDEX "payload_locked_documents_rels_homework_id_idx";
  DROP INDEX "payload_locked_documents_rels_tests_id_idx";
  DROP INDEX "payload_locked_documents_rels_payments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "students_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "materials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "homework_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payments_id";
  DROP TYPE "public"."enum_materials_tags_tag";
  DROP TYPE "public"."enum_materials_type";
  DROP TYPE "public"."enum_materials_category";
  DROP TYPE "public"."enum_materials_subject";
  DROP TYPE "public"."enum_homework_status";
  DROP TYPE "public"."enum_homework_submission_type";
  DROP TYPE "public"."enum_tests_questions_type";
  DROP TYPE "public"."enum_tests_subject";
  DROP TYPE "public"."enum_payments_status";`)
}
