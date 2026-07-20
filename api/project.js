/**
 * API HANDLER: /api/project
 * Manages project stage updates, milestone progress, and notifies team/client via n8n.
 */

const N8N_STAGE_WEBHOOK_URL = process.env.N8N_STAGE_WEBHOOK_URL || 'http://localhost:5678/webhook/stage-update';

export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const { project_code, stage, updated_by, milestone_title } = req.body;

      if (!project_code || !stage) {
        return res.status(400).json({ error: 'Missing required parameters: project_code, stage' });
      }

      const stageUpdatePayload = {
        event: 'PROJECT_STAGE_UPDATED',
        project_code,
        new_stage: stage,
        milestone_title: milestone_title || `Stage changed to ${stage}`,
        updated_by: updated_by || 'PM Agent',
        timestamp: new Date().toISOString()
      };

      // Trigger n8n Stage Update Workflow (Triggers Dual WhatsApp Dispatch)
      try {
        fetch(N8N_STAGE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stageUpdatePayload)
        }).catch(err => console.warn('[n8n Stage Update Warning] n8n engine unreachable:', err.message));
      } catch (e) {
        console.warn('[n8n Stage Update Warning]:', e.message);
      }

      return res.status(200).json({
        success: true,
        project_code,
        current_stage: stage,
        message: 'Project stage updated. n8n dual-channel notification triggered.'
      });
    } catch (err) {
      console.error('Project API Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
