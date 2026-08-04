-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Add userId columns
ALTER TABLE "events" ADD COLUMN "userId" TEXT;
ALTER TABLE "goals" ADD COLUMN "userId" TEXT;
ALTER TABLE "habits" ADD COLUMN "userId" TEXT;
ALTER TABLE "habit_completions" ADD COLUMN "userId" TEXT;
ALTER TABLE "timetable_slots" ADD COLUMN "userId" TEXT;
ALTER TABLE "weekly_tasks" ADD COLUMN "userId" TEXT;
ALTER TABLE "todo_items" ADD COLUMN "userId" TEXT;
ALTER TABLE "resources" ADD COLUMN "userId" TEXT;
ALTER TABLE "focus_sessions" ADD COLUMN "userId" TEXT;

-- Create a default placeholder user for existing data
INSERT INTO "users" ("id", "email", "passwordHash") VALUES
('clj_default_user', 'default@example.com', '$2b$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

-- Assign all existing records to the default user
UPDATE "events" SET "userId" = 'clj_default_user';
UPDATE "goals" SET "userId" = 'clj_default_user';
UPDATE "habits" SET "userId" = 'clj_default_user';
UPDATE "habit_completions" SET "userId" = 'clj_default_user';
UPDATE "timetable_slots" SET "userId" = 'clj_default_user';
UPDATE "weekly_tasks" SET "userId" = 'clj_default_user';
UPDATE "todo_items" SET "userId" = 'clj_default_user';
UPDATE "resources" SET "userId" = 'clj_default_user';
UPDATE "focus_sessions" SET "userId" = 'clj_default_user';

-- Make userId NOT NULL
ALTER TABLE "events" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "goals" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "habits" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "habit_completions" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "timetable_slots" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "weekly_tasks" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "todo_items" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "resources" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "focus_sessions" ALTER COLUMN "userId" SET NOT NULL;

-- Drop old unique/indexes that don't include userId
DROP INDEX "events_date_idx";
DROP INDEX "goals_month_position_key";
DROP INDEX "habit_completions_habitId_date_idx";
DROP INDEX "habit_completions_habitId_date_key";
DROP INDEX "weekly_tasks_date_idx";
DROP INDEX "weekly_tasks_date_index_key";
DROP INDEX "todo_items_date_idx";
DROP INDEX "todo_items_date_index_key";
DROP INDEX "focus_sessions_date_idx";

-- Create new indexes and unique indexes including userId
CREATE INDEX "events_userId_date_idx" ON "events"("userId", "date");
CREATE UNIQUE INDEX "goals_userId_month_position_key" ON "goals"("userId", "month", "position");
CREATE INDEX "habit_completions_userId_habitId_date_idx" ON "habit_completions"("userId", "habitId", "date");
CREATE UNIQUE INDEX "habit_completions_userId_habitId_date_key" ON "habit_completions"("userId", "habitId", "date");
CREATE INDEX "weekly_tasks_userId_date_idx" ON "weekly_tasks"("userId", "date");
CREATE UNIQUE INDEX "weekly_tasks_userId_date_index_key" ON "weekly_tasks"("userId", "date", "index");
CREATE INDEX "todo_items_userId_date_idx" ON "todo_items"("userId", "date");
CREATE UNIQUE INDEX "todo_items_userId_date_index_key" ON "todo_items"("userId", "date", "index");
CREATE INDEX "focus_sessions_userId_date_idx" ON "focus_sessions"("userId", "date");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "timetable_slots" ADD CONSTRAINT "timetable_slots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "weekly_tasks" ADD CONSTRAINT "weekly_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "todo_items" ADD CONSTRAINT "todo_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resources" ADD CONSTRAINT "resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
