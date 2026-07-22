-- ============================================================================
-- AGENCY OPERATING SYSTEM (AGENCY OS) - SUPABASE SEED DATA
-- ============================================================================

-- Insert sample inquiries
INSERT INTO public.inquiries (id, type, name, email, phone, organization, raw_payload, ai_summary, priority_score, estimated_hours, suggested_stack, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'student',
    'Rahul Varma',
    'rahul.v@college.edu',
    '+919876543210',
    'JNTU Hyderabad',
    '{"domain": "Blockchain", "year": "4th Year", "branch": "CSE", "idea": "Decentralized Academic Verifier using IPFS"}'::jsonb,
    'IEEE compliant blockchain certificate verifier project using Solidity and IPFS.',
    3,
    45,
    ARRAY['Solidity', 'Ethereum', 'IPFS', 'React.js'],
    'approved'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'business',
    'Anish Sharma',
    'anish@ofc.com',
    '+919988776655',
    'Official Fried Chicken',
    '{"type": "E-Commerce", "timeline": "1 Month", "features": "Online ordering, POS sync, custom dynamic menus"}'::jsonb,
    'High-traffic restaurant ordering web app with POS integration and WhatsApp notification dispatch.',
    5,
    120,
    ARRAY['Next.js', 'FastAPI', 'PostgreSQL', 'TailwindCSS', 'WhatsApp Cloud API'],
    'approved'
  )
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO public.projects (id, project_code, title, client_id, category, stage, assigned_dev_id, internal_priority, target_deadline, github_repo_url)
VALUES
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'STD-84920',
    'Decentralized Academic Verifier',
    '11111111-1111-1111-1111-111111111111',
    'student_major',
    'development',
    'Lead Dev',
    'high',
    CURRENT_DATE + INTERVAL '7 days',
    'https://github.com/studio-website/academic-verifier'
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000002',
    'STD-92140',
    'Official Fried Chicken Website',
    '22222222-2222-2222-2222-222222222222',
    'commercial_saas',
    'ui_ux',
    'Co-Founder',
    'urgent',
    CURRENT_DATE + INTERVAL '12 days',
    'https://github.com/studio-website/ofc-website'
  )
ON CONFLICT DO NOTHING;

-- Insert milestone timeline entries (Source of truth for client updates)
INSERT INTO public.project_milestones (project_id, title, description, is_completed, completed_at, is_client_visible, sort_order)
VALUES
  -- Project 1 Milestones
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Requirements Received', 'Student scoping intake form processed.', TRUE, NOW() - INTERVAL '4 days', TRUE, 1),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Research Phase Completed', 'IEEE paper standards and IPFS node architecture finalized.', TRUE, NOW() - INTERVAL '3 days', TRUE, 2),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'UI/UX Design Approved', 'Dashboard wireframes and verified certificate templates approved.', TRUE, NOW() - INTERVAL '1 day', TRUE, 3),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Smart Contract Development', 'Compiling Solidity contracts on Ethereum Sepolia testnet.', FALSE, NULL, TRUE, 4),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Testing & Verification', 'Executing unit tests and generating IEEE report.', FALSE, NULL, TRUE, 5),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Final Deployment & Code Handoff', 'Deploying live site and packaging zip deliverables.', FALSE, NULL, TRUE, 6),

  -- Project 2 Milestones
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Discovery Meeting Completed', 'Initial scoping call & feature list finalized.', TRUE, NOW() - INTERVAL '2 days', TRUE, 1),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Research Started', 'Analyzing restaurant POS integration protocols.', TRUE, NOW() - INTERVAL '1 day', TRUE, 2),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'UI Design Phase', 'Designing responsive dark-mode ordering interface.', FALSE, NULL, TRUE, 3),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Development Phase', 'Building Next.js frontend and payment gateway endpoints.', FALSE, NULL, TRUE, 4),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Client Review', 'Staging deployment preview for owner feedback.', FALSE, NULL, TRUE, 5),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Production Deployment', 'Domain configuration & SSL certificate issuance.', FALSE, NULL, TRUE, 6)
ON CONFLICT DO NOTHING;

-- Insert Kanban tasks
INSERT INTO public.tasks (project_id, title, description, stage, assigned_to, due_date, is_urgent)
VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Deploy IPFS Gateway', 'Set up Infura IPFS node connection script', 'in_progress', 'Lead Dev', NOW() + INTERVAL '1 day', TRUE),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'IEEE Draft Formatting', 'Format section 3 methodology according to IEEE 2026 template', 'todo', 'Lead Dev', NOW() + INTERVAL '3 days', FALSE),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Menu UI Components', 'Build responsive menu items grid with category filter tabs', 'in_progress', 'Co-Founder', NOW() + INTERVAL '2 days', TRUE),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'WhatsApp Webhook Connector', 'Set up n8n WhatsApp order confirmation trigger', 'backlog', 'Co-Founder', NOW() + INTERVAL '5 days', FALSE)
ON CONFLICT DO NOTHING;
