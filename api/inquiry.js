/**
 * API HANDLER: /api/inquiry
 * Receives form submissions, validates payloads, & forwards to n8n automation engine.
 */

const N8N_WEBHOOK_URL = process.env.N8N_INQUIRY_WEBHOOK_URL || 'http://localhost:5678/webhook/inquiry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, name, email, phone, organization, payload } = req.body;

    if (!type || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields: type, name, email' });
    }

    // Standardized Inquiry Event Payload
    const inquiryRecord = {
      id: `inq_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      name,
      email,
      phone: phone || '',
      organization: organization || '',
      raw_payload: payload || {},
      created_at: new Date().toISOString()
    };

    // Forward asynchronously to n8n Orchestration Engine
    try {
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryRecord)
      }).catch(err => console.warn('[n8n Webhook Warning] n8n engine offline or unreachable:', err.message));
    } catch (e) {
      console.warn('[n8n Forwarding Warning]:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry registered successfully. Automation engine alerted.',
      inquiry_id: inquiryRecord.id
    });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
