/**
 * AI MASTER PROMPT GENERATOR API
 * /api/prompt/generate
 * 
 * Compiles a detailed, domain-specific master prompt for an autonomous developer agent
 * based on client inquiry requirements, target tech stack, and budget/timeline scope.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, type, name, organization, domain, tech_stack = [], budget, timeline, details } = req.body;

    if (!domain || !details) {
      return res.status(400).json({ error: 'Missing required parameters: domain, details' });
    }

    const cleanStack = Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack;

    // Define Domain-Specific Agent Strategies
    let domainStrategy = '';
    let domainQAProtocol = '';

    if (domain.toLowerCase().includes('ecommerce') || domain.toLowerCase().includes('parts') || domain.toLowerCase().includes('shop')) {
      domainStrategy = `
### DOMAIN ARCHITECTURE: HIGH-VOLUME E-COMMERCE & CATALOG
1. Setup a relational database model in Supabase supporting 'products', 'inventory_categories', 'orders', and 'payment_transactions'.
2. Implement robust catalog sorting, dynamic price-tier multipliers (bulk discounting rules), and elastic search filtering.
3. Configure webhook receivers to sync order statuses with external ERP/POS services.
4. Establish order validation guards to verify pricing integrity before initiating stripe payment intents.`;

      domainQAProtocol = `
### QA & INTEGRATION TESTING FOR E-COMMERCE:
- Verify catalog filter rendering under network latency.
- Run concurrent stress tests on order creation triggers to check for database race conditions in stock allocation.
- Mock Stripe webhook events and verify successful order fulfillment logs.`;
    } else if (domain.toLowerCase().includes('portfolio') || domain.toLowerCase().includes('editor') || domain.toLowerCase().includes('workspace')) {
      domainStrategy = `
### DOMAIN ARCHITECTURE: HIGH-INTERACTIVE CANVAS & DEVELOPER WORKSPACE
1. Deploy a glassmorphic user interface using CSS custom variables supporting smooth theme transitions.
2. Build modular workspace nodes, markdown parser, and interactive drag-and-drop widget layout coordinates.
3. Optimize scroll-driven animations and parallax timelines for high-performance mobile viewport display.
4. Avoid heavy layout calculations; leverage CSS grid, flex-wrap, and requestAnimationFrame where appropriate.`;

      domainQAProtocol = `
### QA & INTEGRATION TESTING FOR CANVAS/PORTFOLIO:
- Perform accessibility audits using Axe-core (verify color contrast ratios, focus targets, keyboard navigation traps).
- Profile frame rendering rates on mobile screens (ensure > 58 FPS during timeline scroll reveals).
- Verify markdown parser sanitize guards against XSS injection payloads in editor inputs.`;
    } else if (domain.toLowerCase().includes('blockchain') || domain.toLowerCase().includes('verifier') || domain.toLowerCase().includes('academic')) {
      domainStrategy = `
### DOMAIN ARCHITECTURE: CRYPTOGRAPHIC DECENTRALIZED DATA VERIFIER
1. Compile Solidity smart contracts validating certificate hashes on Sepolia testnet.
2. Deploy IPFS file pinning handlers using custom storage adapters.
3. Build Next.js/FastAPI REST controller checking transaction receipts on-chain before updating state values.
4. Set up role-based OAuth permissions (e.g. Registrar, Student, Verifier).`;

      domainQAProtocol = `
### QA & INTEGRATION TESTING FOR BLOCKCHAIN:
- Run Solidity security audits (check for reentrancy, timestamp dependency, arithmetic overflow limits).
- Verify IPFS pinning fallback mechanisms if primary API gateway reports timeout.
- Mock on-chain transaction delays and ensure frontend UI renders descriptive pending status cards cleanly.`;
    } else {
      // Generic Application Strategy
      domainStrategy = `
### DOMAIN ARCHITECTURE: CUSTOM SAAS SERVICE PORTAL
1. Build relational database tables in Supabase with optimized index keys.
2. Configure JWT auth middleware layers, session storage cookies, and user permissions tables.
3. Create Next.js API endpoints serving structured data queries to the dashboard.
4. Implement automatic database auditing triggers logging administrative mutations.`;

      domainQAProtocol = `
### QA & INTEGRATION TESTING FOR CUSTOM SAAS:
- Write unit tests for API authentication middleware.
- Verify RLS policies are active on all new database tables.
- Run load testing audits on database select actions.`;
    }

    // Master Prompt Blueprint Compiler
    const masterPrompt = `
================================================================================
AGENT SPECIFICATION: AUTONOMOUS DEVELOPMENT & TESTING PROTOCOL
PROJECT CODE REFERENCE: STD-${id || 'NEW'}
ORGANIZATION: ${organization || 'Individual Student / Lead'}
PRIMARY CONTEXT: ${name} | TARGET TIMELINE: ${timeline || '6 Weeks'}
================================================================================

You are an expert autonomous software engineer. Your task is to develop, test, and package the following project from scratch:
"Project Title: ${domain} Application. Details: ${details}"

### TARGET TECH STACK:
${cleanStack || 'React, Next.js, Supabase, TailwindCSS, n8n'}

### FINANCIAL BUDGET SCOPE:
${budget || 'Custom Scoped'}

--------------------------------------------------------------------------------
1. ARCHITECTURAL PROTOCOL
--------------------------------------------------------------------------------
${domainStrategy}

--------------------------------------------------------------------------------
2. KANBAN DELIVERABLES & MODULE BREAKDOWN
--------------------------------------------------------------------------------
- Module 1 (Discovery & Schema): Map out the system requirements. Write Supabase SQL migration files defining tables, indices, and RLS guidelines.
- Module 2 (Core logic & APIs): Build backend API handlers and connect webhooks. Setup n8n workflow routers for third-party alerts.
- Module 3 (Frontend Interface): Implement a premium, responsive glassmorphic UI matching high-end design variables. Avoid browser default fonts and layouts.
- Module 4 (Deployment): Configure production builds, enable SSL certificates, and prepare handover deployment logs.

--------------------------------------------------------------------------------
3. QUALITY ASSURANCE & TESTING INSTRUCTIONS
--------------------------------------------------------------------------------
${domainQAProtocol}
- Run full client-side form validations.
- Verify page responsiveness across desktop, tablet, and mobile breakpoints.

================================================================================
PROCEED WITH SPRINT INITIATION: INITIALIZE CODEBASE STACK NOW.
================================================================================
`.trim();

    return res.status(200).json({
      success: true,
      master_prompt: masterPrompt
    });
  } catch (err) {
    console.error('Prompt Compiler Error:', err);
    return res.status(500).json({ error: 'Failed to compile prompt template' });
  }
}
