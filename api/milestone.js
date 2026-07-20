/**
 * API HANDLER: /api/milestone
 * Public milestone timeline provider for live client portal rendering.
 */

const SAMPLE_PROJECT_MILESTONES = {
  'STD-84920': [
    { title: 'Requirements Received', description: 'Student scoping intake form processed.', is_completed: true, timestamp: '2026-07-16 09:12 AM' },
    { title: 'Research Phase Completed', description: 'IEEE paper standards and IPFS node architecture finalized.', is_completed: true, timestamp: '2026-07-17 11:30 AM' },
    { title: 'UI/UX Design Approved', description: 'Dashboard wireframes and verified certificate templates approved.', is_completed: true, timestamp: '2026-07-18 04:05 PM' },
    { title: 'Smart Contract Development', description: 'Compiling Solidity contracts on Ethereum Sepolia testnet.', is_completed: false, timestamp: 'Next Day' },
    { title: 'Testing & Verification', description: 'Executing unit tests and generating IEEE report.', is_completed: false, timestamp: 'Pending' },
    { title: 'Final Deployment & Code Handoff', description: 'Deploying live site and packaging zip deliverables.', is_completed: false, timestamp: 'Pending' }
  ],
  'STD-92140': [
    { title: 'Discovery Meeting Completed', description: 'Initial scoping call & feature list finalized.', is_completed: true, timestamp: '2026-07-18 10:00 AM' },
    { title: 'Research Started', description: 'Analyzing restaurant POS integration protocols.', is_completed: true, timestamp: '2026-07-19 02:15 PM' },
    { title: 'UI Design Phase', description: 'Designing responsive dark-mode ordering interface.', is_completed: false, timestamp: 'In Progress' },
    { title: 'Development Phase', description: 'Building Next.js frontend and payment gateway endpoints.', is_completed: false, timestamp: 'Pending' },
    { title: 'Client Review', description: 'Staging deployment preview for owner feedback.', is_completed: false, timestamp: 'Pending' },
    { title: 'Production Deployment', description: 'Domain configuration & SSL certificate issuance.', is_completed: false, timestamp: 'Pending' }
  ]
};

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Project code parameter missing (e.g., ?code=STD-84920)' });
  }

  const milestones = SAMPLE_PROJECT_MILESTONES[code];

  if (!milestones) {
    return res.status(404).json({
      success: false,
      error: `No project found matching tracking ID "${code}".`,
      next_steps: [
        'Verify your Project Code (e.g., STD-84920 or STD-92140).',
        'If you recently submitted an intake form, allow up to 15 minutes for system provisioning.',
        'Contact our team via WhatsApp or Email for instant tracking assistance.'
      ]
    });
  }

  return res.status(200).json({
    success: true,
    project_code: code,
    milestones
  });
}
