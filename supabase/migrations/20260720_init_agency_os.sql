-- ============================================================================
-- AGENCY OPERATING SYSTEM (AGENCY OS) - REFINED POSTGRESQL MIGRATION
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. INQUIRIES TABLE (Raw Form Submissions & AI Scoring)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('student', 'business')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  organization VARCHAR(255),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_summary TEXT,
  priority_score INT DEFAULT 1 CHECK (priority_score BETWEEN 1 AND 5),
  estimated_hours INT,
  suggested_stack TEXT[],
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'converted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. PROJECTS TABLE (14-Stage Lifecycle Master Entities)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL,
  stage VARCHAR(50) DEFAULT 'lead' CHECK (stage IN (
    'lead', 'discovery', 'research', 'planning', 'ui', 'ux',
    'development', 'internal_qa', 'human_qa', 'client_review',
    'deployment', 'maintenance', 'completed', 'cancelled'
  )),
  assigned_dev_id VARCHAR(100),
  internal_priority VARCHAR(20) DEFAULT 'medium' CHECK (internal_priority IN ('low', 'medium', 'high', 'urgent')),
  target_deadline DATE,
  github_repo_url TEXT,
  drive_folder_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PROJECT MILESTONES TABLE (Timeline Source of Truth)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stage VARCHAR(50),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  is_client_visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. TASKS TABLE (Agency Kanban Board Items)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stage VARCHAR(50) DEFAULT 'backlog' CHECK (stage IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
  assigned_to VARCHAR(100),
  due_date TIMESTAMPTZ,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SYSTEM EVENTS TABLE (n8n 00 Event Router Source)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL, -- e.g., 'PROJECT_CREATED', 'STAGE_STARTED', 'TASK_ASSIGNED'
  entity_type VARCHAR(50) NOT NULL,  -- 'project', 'task', 'inquiry', 'meeting'
  entity_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. NOTIFICATION QUEUE TABLE (Notification Service Abstraction)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient VARCHAR(255) NOT NULL,
  channel VARCHAR(50) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'telegram', 'slack')),
  message_type VARCHAR(50) NOT NULL, -- 'internal_dev', 'client_update', 'reminder'
  body TEXT NOT NULL,
  provider VARCHAR(50) DEFAULT 'whatsapp_cloud_api',
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'retrying')),
  retry_count INT DEFAULT 0,
  error_log TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_inquiries_type_status ON public.inquiries(type, status);
CREATE INDEX IF NOT EXISTS idx_projects_code ON public.projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON public.projects(stage);
CREATE INDEX IF NOT EXISTS idx_events_unprocessed ON public.system_events(is_processed, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notification_queue(status);

-- ----------------------------------------------------------------------------
-- AUTOMATIC TIMESTAMP UPDATER TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inquiries_modtime BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_milestones_modtime BEFORE UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Anonymous public inserts for form submissions
CREATE POLICY "Allow public intake form inserts" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Public read access for client milestone timelines
CREATE POLICY "Allow public read on client milestones" ON public.project_milestones FOR SELECT USING (is_client_visible = true);

-- Service role full access
CREATE POLICY "Service role full access on inquiries" ON public.inquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on projects" ON public.projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on milestones" ON public.project_milestones FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on tasks" ON public.tasks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on system_events" ON public.system_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on notification_queue" ON public.notification_queue FOR ALL USING (auth.role() = 'service_role');
