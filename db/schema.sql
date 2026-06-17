-- TechHeroes — Neon (PostgreSQL) schema + seed.
-- Paste this whole file into the Neon SQL Editor and run it once.
-- Roles: tutor, student only.

-- ---------- Types ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('tutor','student');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('active','inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('submitted','late');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE notification_status AS ENUM ('unread','read');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- Tables ----------
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        user_role NOT NULL,
  name        TEXT NOT NULL,
  student_id  TEXT UNIQUE,
  email       TEXT UNIQUE,
  password    TEXT NOT NULL,
  status      account_status NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS materials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  type       TEXT,
  file_url   TEXT,
  group_id   UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  deadline    TIMESTAMPTZ,
  group_id    UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url      TEXT,
  comment       TEXT,
  status        submission_status NOT NULL DEFAULT 'submitted',
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grades (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
  grade         NUMERIC(5,2),
  letter        TEXT,
  feedback      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  group_id    UUID REFERENCES groups(id) ON DELETE CASCADE,
  content     TEXT,
  attachment  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (receiver_id IS NOT NULL OR group_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT,
  status     notification_status NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_pair      ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_group     ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_submissions_asg    ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, status);

-- ---------- Seed (demo data) ----------
-- Password for every demo account is: demo1234
-- (bcrypt hash below). Change these in production.
INSERT INTO users (id, role, name, student_id, email, password) VALUES
  ('00000000-0000-0000-0000-000000000001','tutor','Dr Amina Said', NULL,      'tutor@techheroes.io','$2b$10$S2gkBG0PpGRbRyObnuIvVe5/tSE1b0zK7WaPjJ4pDXa6ZX6BF4ZUm'),
  ('00000000-0000-0000-0000-000000000002','student','Layla Hassan','S-24001','layla@techheroes.io','$2b$10$S2gkBG0PpGRbRyObnuIvVe5/tSE1b0zK7WaPjJ4pDXa6ZX6BF4ZUm'),
  ('00000000-0000-0000-0000-000000000003','student','Omar Khalil', 'S-24002','omar@techheroes.io', '$2b$10$S2gkBG0PpGRbRyObnuIvVe5/tSE1b0zK7WaPjJ4pDXa6ZX6BF4ZUm'),
  ('00000000-0000-0000-0000-000000000004','student','Sara Nasser', 'S-24003','sara@techheroes.io', '$2b$10$S2gkBG0PpGRbRyObnuIvVe5/tSE1b0zK7WaPjJ4pDXa6ZX6BF4ZUm')
ON CONFLICT (id) DO NOTHING;

INSERT INTO groups (id, name, description) VALUES
  ('00000000-0000-0000-0000-000000000101','Frontend Cohort','React, UI systems & accessibility'),
  ('00000000-0000-0000-0000-000000000102','Backend Cohort','APIs, databases & auth')
ON CONFLICT (id) DO NOTHING;

INSERT INTO group_members (group_id, user_id) VALUES
  ('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

INSERT INTO materials (title, type, group_id) VALUES
  ('React Hooks — Deep Dive','PDF','00000000-0000-0000-0000-000000000101')
ON CONFLICT DO NOTHING;

INSERT INTO assignments (id, title, description, deadline, group_id) VALUES
  ('00000000-0000-0000-0000-000000000201','Responsive Landing Page','Build a responsive landing page.','2026-06-22','00000000-0000-0000-0000-000000000101')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (user_id, title, message) VALUES
  ('00000000-0000-0000-0000-000000000002','New assignment','Responsive Landing Page · due Jun 22')
ON CONFLICT DO NOTHING;
