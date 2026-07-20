/**
 * CENTRALIZED NOTIFICATION ABSTRACTION SERVICE
 * /api/notifications/send
 * 
 * Standardized endpoint for dispatching alerts across providers (WhatsApp Cloud API / Twilio / Slack)
 * decoupled from n8n business logic workflows.
 */

const WHATSAPP_CLOUD_API_URL = process.env.WHATSAPP_CLOUD_API_URL || 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipient, channel = 'whatsapp', message_type = 'client_update', body, provider = 'whatsapp_cloud_api' } = req.body;

    if (!recipient || !body) {
      return res.status(400).json({ error: 'Missing required parameters: recipient, body' });
    }

    const notificationId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    console.log(`[Notification Service] Queued notification ${notificationId} for ${recipient} via ${channel} (${provider})`);

    // Simulated Provider Adapter Logic
    let isSent = false;
    let errorDetails = null;

    if (provider === 'whatsapp_cloud_api' && WHATSAPP_ACCESS_TOKEN) {
      try {
        const response = await fetch(`${WHATSAPP_CLOUD_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'text',
            text: { body }
          })
        });

        if (response.ok) {
          isSent = true;
        } else {
          errorDetails = await response.text();
        }
      } catch (err) {
        errorDetails = err.message;
      }
    } else {
      // Development mode / local fallback mock dispatch
      console.log(`[Notification Service Mock Dispatch] Sent message to ${recipient}:\n${body}`);
      isSent = true;
    }

    return res.status(200).json({
      success: true,
      notification_id: notificationId,
      status: isSent ? 'sent' : 'failed',
      provider,
      recipient,
      error: errorDetails
    });
  } catch (err) {
    console.error('Notification Service Error:', err);
    return res.status(500).json({ error: 'Internal notification service error' });
  }
}
