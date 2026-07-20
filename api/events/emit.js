/**
 * THIN EVENT EMITTER ENDPOINT
 * /api/events/emit
 * 
 * Next.js Backend API emits thin, standardized events.
 * The payload contains ONLY the event ID, type, entity IDs, and minimal metadata.
 * n8n fetches fresh entity details directly from Supabase upon receiving the event.
 */

const N8N_EVENT_ROUTER_URL = process.env.N8N_EVENT_ROUTER_URL || 'http://localhost:5678/webhook/event-router';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event, projectId, triggeredBy = 'user_admin', metadata = {} } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Missing required parameter: event' });
    }

    // Standardized Thin Event Envelope
    const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const eventPayload = {
      eventId,
      event,
      projectId: projectId || null,
      triggeredBy,
      timestamp: new Date().toISOString(),
      metadata
    };

    console.log(`[Event Emitter] Dispatched thin event ${eventId} (${event})`);

    // Asynchronously dispatch to n8n 00 Event Router
    try {
      fetch(N8N_EVENT_ROUTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      }).catch(err => console.warn('[n8n Event Router Warning] Router offline or unreachable:', err.message));
    } catch (e) {
      console.warn('[n8n Forwarding Warning]:', e.message);
    }

    return res.status(200).json({
      success: true,
      eventId,
      event,
      message: 'Thin event emitted successfully to n8n Event Router.'
    });
  } catch (err) {
    console.error('Event Emitter Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
