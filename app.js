/* ==========================================================================
   STUDIO WEBSITE - DYNAMIC ENGINE (app.js)
   Fully Functional Interactive Front-end Subsystems
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ---------------------------------------------------------
  // 1. SYSTEM MODE CONTROLLER (Theme toggling & FOUC check)
  // ---------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
  const setTheme = (theme) => {
    document.documentElement.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    if (colorSchemeMeta) {
      colorSchemeMeta.content = theme === 'dark' ? 'dark' : 'light';
    }
    localStorage.setItem('color-scheme', theme);
  };

  // Init theme
  const savedTheme = localStorage.getItem('color-scheme') || getSystemTheme();
  setTheme(savedTheme);

  // Toggle Theme
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Watch for OS level system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---------------------------------------------------------
  // 2. HERO ANIMATED PARTICLES (Canvas Engine)
  // ---------------------------------------------------------
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        const isDark = document.documentElement.classList.contains('theme-dark');
        const color = isDark ? `rgba(255, 255, 255, ${this.alpha * 0.25})` : `rgba(0, 0, 0, ${this.alpha * 0.15})`;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < Math.min(particleCount, 120); i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ---------------------------------------------------------
  // 3. ANIMATED COUNTERS (Intersection Observer)
  // ---------------------------------------------------------
  const counters = document.querySelectorAll('.stat-num');
  const countSpeed = 200; // lower number = faster

  const startCounting = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let count = 0;
    const increment = Math.ceil(target / countSpeed);

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = count;
        setTimeout(updateCount, 12);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));

  // ---------------------------------------------------------
  // 4. INTERACTIVE TECHNOLOGY TAB SWITCHER
  // ---------------------------------------------------------
  const capTabs = document.querySelectorAll('.cap-tab-btn');
  const capPanels = document.querySelectorAll('.cap-panel');

  capTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      capTabs.forEach(t => t.classList.remove('active'));
      capPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetCategory = tab.getAttribute('data-category');
      const targetPanel = document.getElementById(`cap-${targetCategory}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        
        // Trigger bar animations
        const progressBars = targetPanel.querySelectorAll('.tech-progress');
        progressBars.forEach(bar => {
          // Reset width to trigger transition
          const targetWidth = bar.parentElement.previousElementSibling.querySelector('.tech-level').textContent.match(/\d+/)[0] + '%';
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 50);
        });
      }
    });
  });

  // Initial trigger for active tab progress bars
  const activePanel = document.querySelector('.cap-panel.active');
  if (activePanel) {
    activePanel.querySelectorAll('.tech-progress').forEach(bar => {
      const targetWidth = bar.parentElement.previousElementSibling.querySelector('.tech-level').textContent.match(/\d+/)[0] + '%';
      bar.style.width = targetWidth;
    });
  }

  // ---------------------------------------------------------
  // 5. LIVE PROJECT MONITOR (Pipeline Logger & Bar SVG Adjuster)
  // ---------------------------------------------------------
  const consoleLogs = document.getElementById('console-logs');
  const mockLogPool = [
    { type: 'OK', text: 'Subsystems stable. Integrity check 100%.' },
    { type: 'COMPILE', text: 'Compiling IEEE Smart Contract verifier...' },
    { type: 'SUCCESS', text: 'Smart contract test suite completed. Deployed to Sepolia.' },
    { type: 'COMPILE', text: 'Linting PyTorch image segmentation model modules...' },
    { type: 'SUCCESS', text: 'Segmentation accuracy: 94.8% on validation block.' },
    { type: 'COMPILE', text: 'Parsing requirements document for new intake node...' },
    { type: 'OK', text: 'Hosting check: Vercel CDN nodes healthy.' },
    { type: 'OK', text: 'Backing up SQLite nodes and local templates metadata...' },
    { type: 'COMPILE', text: 'Minifying CSS bundles and pre-compiling images...' }
  ];

  const getLogClass = (type) => {
    if (type === 'OK') return 'text-muted';
    if (type === 'COMPILE') return 'text-blue';
    if (type === 'SUCCESS') return 'text-green';
    return '';
  };

  const startPipelineLogging = () => {
    if (!consoleLogs) return;
    setInterval(() => {
      const randomLog = mockLogPool[Math.floor(Math.random() * mockLogPool.length)];
      const timestamp = new Date().toISOString().slice(11, 19);
      
      const logLine = document.createElement('div');
      logLine.className = `log-line ${getLogClass(randomLog.type)}`;
      logLine.innerHTML = `<span class="text-muted">[${timestamp}]</span> [${randomLog.type}] ${randomLog.text}`;
      
      consoleLogs.appendChild(logLine);
      consoleLogs.scrollTop = consoleLogs.scrollHeight;

      // Clean old logs if container gets too full
      if (consoleLogs.children.length > 25) {
        consoleLogs.removeChild(consoleLogs.children[0]);
      }

      // Slightly wiggle chart bars to simulate activity
      const chartBars = document.querySelectorAll('.chart-bar');
      chartBars.forEach(bar => {
        const currentHeight = parseFloat(bar.getAttribute('height'));
        const adjustment = (Math.random() - 0.5) * 8;
        const newHeight = Math.max(10, Math.min(140, currentHeight + adjustment));
        const currentY = parseFloat(bar.getAttribute('y'));
        const newY = currentY - (newHeight - currentHeight);
        
        bar.setAttribute('height', newHeight);
        bar.setAttribute('y', newY);
      });
    }, 4500);
  };
  startPipelineLogging();

  // ---------------------------------------------------------
  // 6. PORTFOLIO FILTER SYSTEM
  // ---------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolio-grid');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const cards = portfolioGrid.querySelectorAll('.portfolio-card');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---------------------------------------------------------
  // 7. READY-MADE TEMPLATES ACTIVE PREVIEW DIALOG
  // ---------------------------------------------------------
  const templatePreviewModal = document.getElementById('template-preview-modal');
  const previewModalTitle = document.getElementById('preview-modal-title');
  const previewBrowserAddress = document.getElementById('preview-browser-address');
  const previewFrameContent = document.getElementById('preview-frame-content');
  const openPreviewButtons = document.querySelectorAll('.open-preview-btn');

  const templatePreviews = {
    gym: {
      title: 'Velocity Fit Live Preview',
      url: 'https://velocityfit.template.studiowebsite.in',
      html: `
        <div class="mock-preview-body" style="background:#0b0c10; color:#fff; height:100%;">
          <div class="mock-navbar">
            <span class="mock-nav-logo">VELOCITY FIT</span>
            <div class="mock-nav-links"><span>Classes</span><span>Trainers</span><span>Book</span></div>
          </div>
          <div class="mock-hero" style="background: radial-gradient(circle, #1a1c23 0%, #0b0c10 100%);">
            <h1 class="gradient-text">ELEVATE YOUR POTENTIAL</h1>
            <p>Glassmorphic class schedules and seamless trainer allocations.</p>
            <button class="btn btn-primary btn-small" style="margin-top:10px;">Book Fit Trial</button>
          </div>
          <div class="mock-grid-cards">
            <div class="mock-grid-card"><h4>Strength Training</h4><p>Neon metrics & maps</p></div>
            <div class="mock-grid-card"><h4>Cardio Engine</h4><p>High speed testing</p></div>
            <div class="mock-grid-card"><h4>Yoga Pipeline</h4><p>Flexible schedules</p></div>
          </div>
        </div>
      `
    },
    restaurant: {
      title: 'Luna & Laurel Live Preview',
      url: 'https://lunalaurel.template.studiowebsite.in',
      html: `
        <div class="mock-preview-body" style="background:#fdfbf7; color:#2e2c29; height:100%;">
          <div class="mock-navbar">
            <span class="mock-nav-logo" style="color:#8a7968;">LUNA & LAUREL</span>
            <div class="mock-nav-links"><span style="color:#555;">Menu</span><span style="color:#555;">Reservations</span></div>
          </div>
          <div class="mock-hero" style="background:#f4ebd9; border-radius:8px;">
            <h1 style="color:#8a7968;">Elegance In Every Bite</h1>
            <p style="color:#666;">Indulge in seasonal tasting menus curated by master chefs.</p>
            <button class="btn btn-primary btn-small" style="background:#8a7968; margin-top:10px;">Secure A Table</button>
          </div>
          <div class="mock-grid-cards" style="margin-top:15px;">
            <div class="mock-grid-card" style="background:#fff;"><h4>Lunch Tasting</h4><p>4 Courses</p></div>
            <div class="mock-grid-card" style="background:#fff;"><h4>Grand Soiree</h4><p>8 Courses</p></div>
            <div class="mock-grid-card" style="background:#fff;"><h4>Wine Pairing</h4><p>Exquisite imports</p></div>
          </div>
        </div>
      `
    }
  };

  openPreviewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const templateKey = btn.getAttribute('data-template');
      const data = templatePreviews[templateKey];
      if (data) {
        previewModalTitle.innerText = data.title;
        previewBrowserAddress.innerText = data.url;
        previewFrameContent.innerHTML = data.html;
        templatePreviewModal.showModal();
      }
    });
  });

  // Handle template request CTA autofill
  const requestTemplateBtns = document.querySelectorAll('.request-temp-btn');
  const commercialForm = document.getElementById('commercial-form');
  const bizFeaturesText = document.getElementById('biz-features');
  const bizWebsiteTypeSelect = document.getElementById('biz-type');

  requestTemplateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const templateName = btn.getAttribute('data-template-name');
      if (commercialForm && bizFeaturesText) {
        bizWebsiteTypeSelect.value = "Sleek Landing Page";
        bizFeaturesText.value = `I am interested in customizing the "${templateName}". I would like to adjust the colors, logos, and connect custom contact forms.`;
        // Smooth scroll to commercial form
        document.getElementById('commercial-inquiry').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle student project request CTA autofill
  const configureSimilarBtns = document.querySelectorAll('.configure-similar-btn');
  const studentFormSelect = document.getElementById('stu-domain');
  const studentIdeaTextArea = document.getElementById('stu-idea');

  configureSimilarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectTitle = btn.getAttribute('data-project-title');
      const projectDomain = btn.getAttribute('data-project-domain');
      if (studentFormSelect && studentIdeaTextArea) {
        studentFormSelect.value = projectDomain;
        studentIdeaTextArea.value = `I would like to configure an academic project similar to "${projectTitle}". Please suggest timeline options and key architectural details.`;
      }
    });
  });

  // ---------------------------------------------------------
  // 8. INTERACTIVE ESTIMATOR ENGINE
  // ---------------------------------------------------------
  const estProjectType = document.getElementById('project-type-est');
  const estTimelineSlider = document.getElementById('est-timeline-slider');
  const estTimelineVal = document.getElementById('est-timeline-val');
  const estReqAuth = document.getElementById('est-req-auth');
  const estReqDb = document.getElementById('est-req-db');
  const estReqAi = document.getElementById('est-req-ai');
  const estReqPayments = document.getElementById('est-req-payments');
  const estComplexity = document.getElementById('est-complexity');
  const estSuggestedStack = document.getElementById('est-suggested-stack');
  const estPhases = document.getElementById('est-phases');
  const estEngineers = document.getElementById('est-engineers');
  const estCta = document.getElementById('est-cta');

  const calculateEstimate = () => {
    const type = estProjectType.value;
    const weeks = parseInt(estTimelineSlider.value, 10);
    estTimelineVal.innerText = `${weeks} Weeks`;

    // Compute checkbox features
    let extraFeaturesCount = 0;
    if (estReqAuth.checked) extraFeaturesCount++;
    if (estReqDb.checked) extraFeaturesCount++;
    if (estReqAi.checked) extraFeaturesCount++;
    if (estReqPayments.checked) extraFeaturesCount++;

    let baseComplexity = 1; // 1 to 5
    let stack = 'React, Vanilla CSS';
    let phases = 3;
    let devCount = 1;
    let qaCount = 1;

    switch (type) {
      case 'web-simple':
        baseComplexity = 1 + (extraFeaturesCount * 0.5);
        stack = 'Vite, Vanilla CSS, JS';
        phases = 2;
        devCount = 1;
        break;
      case 'web-saas':
        baseComplexity = 3 + (extraFeaturesCount * 0.5);
        stack = 'Next.js, Node.js, PostgreSQL';
        phases = 5;
        devCount = 2;
        qaCount = 1;
        break;
      case 'student-ieee':
        baseComplexity = 2 + (extraFeaturesCount * 0.6);
        stack = 'React, FastAPI, SQLite / PyTorch';
        phases = 4;
        devCount = 1;
        qaCount = 1;
        break;
      case 'ai-agent':
        baseComplexity = 4 + (extraFeaturesCount * 0.4);
        stack = 'LangChain, Python, Gemini API';
        phases = 5;
        devCount = 2;
        qaCount = 1;
        break;
      case 'blockchain-dapp':
        baseComplexity = 4 + (extraFeaturesCount * 0.5);
        stack = 'Solidity, Ethereum, Ethers.js';
        phases = 6;
        devCount = 2;
        qaCount = 2;
        break;
    }

    // Complexity mapping
    const finalComplexityVal = Math.min(5, baseComplexity + (8 / weeks) * 0.5);
    let rating = 'Low';
    if (finalComplexityVal > 2.2) rating = 'Medium';
    if (finalComplexityVal > 3.8) rating = 'High';

    estComplexity.innerText = rating;
    estSuggestedStack.innerText = stack;
    estPhases.innerText = `${phases} Core Cycles`;
    estEngineers.innerText = `${devCount} Devs + ${qaCount} QA Partner`;

    // Estimate CTA string adjustment
    if (estCta) {
      estCta.href = `#contact`;
      estCta.innerText = `Book Consultation For ${rating} Complexity Outline`;
    }
  };

  if (estProjectType) {
    estProjectType.addEventListener('change', calculateEstimate);
    estTimelineSlider.addEventListener('input', calculateEstimate);
    estReqAuth.addEventListener('change', calculateEstimate);
    estReqDb.addEventListener('change', calculateEstimate);
    estReqAi.addEventListener('change', calculateEstimate);
    estReqPayments.addEventListener('change', calculateEstimate);
    calculateEstimate(); // Initial
  }

  // ---------------------------------------------------------
  // 9. CLIENT REACH MAP INTERACTIVE DATA BUBBLE
  // ---------------------------------------------------------
  const mapNodes = document.querySelectorAll('.map-node');
  const mapHoverBubble = document.getElementById('map-hover-bubble');

  mapNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const location = node.getAttribute('data-location');
      const projects = node.getAttribute('data-projects');
      if (mapHoverBubble) {
        mapHoverBubble.style.opacity = '1';
        mapHoverBubble.innerHTML = `<strong>${location}:</strong> ${projects}`;
      }
    });

    node.addEventListener('mouseleave', () => {
      if (mapHoverBubble) {
        mapHoverBubble.innerHTML = 'Hover over a connection point';
      }
    });
  });

  // ---------------------------------------------------------
  // 10. STUDENT INTAKE PORTAL & AUTO-RESPONDER SIMULATION
  // ---------------------------------------------------------
  const studentForm = document.getElementById('student-portal-form');
  const studentAiModal = document.getElementById('student-ai-modal');
  const terminalScreen = document.getElementById('terminal-screen-output');
  const blueprintActions = document.getElementById('modal-blueprint-actions');
  const whatsappBlueprintLink = document.getElementById('btn-whatsapp-blueprint');
  const downloadBlueprintBtn = document.getElementById('btn-download-blueprint');

  let generatedProposalMarkdown = '';

  if (studentForm && studentAiModal) {
    studentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get Form details
      const name = document.getElementById('stu-name').value;
      const college = document.getElementById('stu-college').value;
      const branch = document.getElementById('stu-branch').value;
      const year = document.getElementById('stu-year').value;
      const type = document.getElementById('stu-type').value;
      const domain = document.getElementById('stu-domain').value;
      const deadline = document.getElementById('stu-deadline').value;
      const idea = document.getElementById('stu-idea').value;
      const budget = document.getElementById('stu-budget').value;
      const whatsapp = document.getElementById('stu-whatsapp').value;

      // Reset Modal styling & actions
      blueprintActions.classList.add('hidden');
      terminalScreen.innerHTML = '';
      studentAiModal.showModal();

      // Simulated auto-response text typing
      const steps = [
        { msg: `[INITIATING] Intake Agent v2.8...`, delay: 500, color: 'text-muted' },
        { msg: `[CONNECT] Connection secured. Evaluating details for student "${name}"...`, delay: 800, color: '' },
        { msg: `[CHECK] Accessing IEEE Academic Registry for domain: ${domain}...`, delay: 1000, color: 'text-blue' },
        { msg: `[ANALYZE] Requirement analysis for final report validation parameters...`, delay: 1200, color: '' },
        { msg: `[ROADMAP] Branch context match: ${branch} / Year: ${year}. IEEE schema formatting validated.`, delay: 900, color: 'text-purple' },
        { msg: `[COMPILE] Compiling modules...`, delay: 1100, color: 'text-blue' },
        { msg: `[SUCCESS] Technical Roadmap compiled successfully! Outputting specifications below:`, delay: 800, color: 'text-green' }
      ];

      let stepIdx = 0;
      
      const runTerminalSequence = () => {
        if (stepIdx < steps.length) {
          const step = steps[stepIdx];
          const div = document.createElement('div');
          div.className = `log-line ${step.color}`;
          div.innerText = step.msg;
          terminalScreen.appendChild(div);
          terminalScreen.scrollTop = terminalScreen.scrollHeight;
          
          stepIdx++;
          setTimeout(runTerminalSequence, step.delay);
        } else {
          // Generate customized proposal
          setTimeout(showGeneratedBlueprint, 600);
        }
      };
      runTerminalSequence();

      const showGeneratedBlueprint = () => {
        // Formulate project title proposal based on keywords
        let proposedTitle = `${domain} Integrated Framework`;
        if (domain.includes('Machine')) {
          proposedTitle = `Deep Residual U-Net Pipeline for Smart Diagnostics`;
        } else if (domain.includes('Web')) {
          proposedTitle = `Distributed Microservices E-Commerce Portal with Local Sync`;
        } else if (domain.includes('Blockchain')) {
          proposedTitle = `Decentralized Academic Credential Verifier using IPFS & Smart Contracts`;
        } else if (domain.includes('Cyber')) {
          proposedTitle = `Hybrid RSA-AES Symmetric Cryptographic File Custodian`;
        }

        generatedProposalMarkdown = `
================ STUDIO SPEC SHEET ================
PROJECT ID: STD-${Math.floor(Math.random() * 90000 + 10000)}
PROPOSED TITLE: ${proposedTitle}
STUDENT: ${name} | COLLEGE: ${college}
DOMAIN: ${domain} | BRANCH: ${branch} (Year ${year})
=====================================================

1. TECHNICAL ARCHITECTURE RECOMMENDATION
-----------------------------------------------------
- Frontend Layer: React.js with CSS custom properties
- Backend Integration: Python FastAPI REST endpoints
- Storage Engine: SQLite (Mini) or PostgreSQL (Major)
- Deep Learning (If AI): PyTorch CNN validation nodes

2. CORE DEVELOPMENT MODULES
-----------------------------------------------------
* Module A (Week 1-2): Requirement analysis, database schema, & clean UI wireframes.
* Module B (Week 3-4): Core algorithm setup (FastAPI routes / Smart Contracts).
* Module C (Week 5): Full layout synchronization & dashboard testing.
* Module D (Week 6): Formatting standard IEEE report & viva slides assembly.

3. FINANCIAL CONFIGURATION (STUDENT DISCOUNT APPLIED)
-----------------------------------------------------
- Scope Type: Academic ${type} Project (fully configured)
- Stated Budget: INR ${budget}
- Core Deliverables: Code + Documentation + Viva Video guides

=====================================================
Status: Intake Scoping Node Active.
Select "Start Project on WhatsApp" to verify schedule!
        `;

        const proposalPre = document.createElement('pre');
        proposalPre.style.color = '#fff';
        proposalPre.style.whiteSpace = 'pre-wrap';
        proposalPre.style.fontFamily = 'var(--font-mono)';
        proposalPre.style.marginTop = '15px';
        proposalPre.innerText = generatedProposalMarkdown;
        
        terminalScreen.appendChild(proposalPre);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;

        // Configure buttons
        blueprintActions.classList.remove('hidden');

        // Formulate WhatsApp message URL
        const encodedMsg = encodeURIComponent(
          `Hi Studio Website, I submitted an academic request.\n\n` +
          `*Name:* ${name}\n` +
          `*College:* ${college}\n` +
          `*Domain:* ${domain}\n` +
          `*Title Idea:* ${proposedTitle}\n` +
          `*Proposed Budget:* ${budget}\n\n` +
          `Please confirm timeline & initial scoping draft!`
        );
        whatsappBlueprintLink.href = `https://wa.me/919999999999?text=${encodedMsg}`;
      };
    });
  }

  // Save blueprint proposal as local txt download
  if (downloadBlueprintBtn) {
    downloadBlueprintBtn.addEventListener('click', () => {
      if (!generatedProposalMarkdown) return;
      const blob = new Blob([generatedProposalMarkdown], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'project_blueprint.txt';
      link.click();
    });
  }

  // ---------------------------------------------------------
  // 11. COMMERCIAL INQUIRY FORM SUBMISSION SIMULATION
  // ---------------------------------------------------------
  if (commercialForm) {
    commercialForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const bizName = document.getElementById('biz-name').value;
      const contact = document.getElementById('biz-contact-name').value;
      const email = document.getElementById('biz-email').value;
      const systemType = document.getElementById('biz-type').value;

      const successModal = document.getElementById('success-notification-modal');
      const modalMessage = document.getElementById('notification-modal-message');

      if (successModal && modalMessage) {
        modalMessage.innerText = `Thank you for reaching out, ${contact}! We have registered your in-depth project requirements for "${bizName}" (${systemType}). An engineering partner from Studio Website will contact you at ${email} within 2 hours with an initial architectural proposal and a scheduling link.`;
        successModal.showModal();
      }
      commercialForm.reset();
    });
  }

  // ---------------------------------------------------------
  // 12. FAQ ACCORDION TRIGGER
  // ---------------------------------------------------------
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const isOpen = parent.classList.contains('open');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // ---------------------------------------------------------
  // 13. MOBILE MENU TOGGLE
  // ---------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mainNav = document.getElementById('main-nav');

  if (menuToggleBtn && mainNav) {
    menuToggleBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking links
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // ---------------------------------------------------------
  // 14. AGENCY OS LIVE MILESTONE TRACKER ENGINE
  // ---------------------------------------------------------
  const trackerInput = document.getElementById('tracker-code-input');
  const trackerBtn = document.getElementById('tracker-search-btn');
  const trackerResults = document.getElementById('tracker-timeline-results');

  const fetchAndRenderMilestones = async (projectCode) => {
    if (!trackerResults) return;
    trackerResults.innerHTML = '<div class="log-line text-muted">Fetching live milestone timeline...</div>';

    try {
      const response = await fetch(`/api/milestone?code=${encodeURIComponent(projectCode)}`);
      const data = await response.json();

      const renderNotFound = (code, nextSteps) => {
        const stepsList = (nextSteps || [
          'Verify your Project Code format (e.g., STD-84920 or STD-92140).',
          'If you recently submitted an intake form, allow up to 15 minutes for system provisioning.',
          'Reach out to our engineering team on WhatsApp or Email for instant tracking assistance.'
        ]).map(step => `<li><i data-lucide="info" style="width:16px; height:16px; margin-right:8px; display:inline-block; vertical-align:middle;"></i> ${step}</li>`).join('');

        trackerResults.innerHTML = `
          <div class="tracker-not-found-card glass-card" style="padding: var(--space-6); border-radius: var(--radius-md); border-left: 4px solid var(--text-dim, #999);">
            <div style="margin-bottom: var(--space-4);">
              <span class="status-badge" style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-family: var(--font-mono); font-weight: 600;">NO MATCH FOUND</span>
              <h3 style="margin-top: var(--space-2); font-size: 1.25rem;">No Active Project Found for ID: "<code>${code}</code>"</h3>
            </div>
            <p style="color: var(--text-dim); margin-bottom: var(--space-4); font-size: 0.9rem;">We couldn't locate any active project matching this code in our system database.</p>
            <div class="next-steps-container" style="background: var(--bg-surface-elevated); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <h4 style="margin: 0 0 var(--space-2) 0; font-size: 0.95rem; font-weight: 600;">Recommended Next Steps:</h4>
              <ul style="margin: 0; padding-left: 0; list-style: none; font-size: 0.88rem; color: var(--text-dim); display: flex; flex-direction: column; gap: 8px;">
                ${stepsList}
              </ul>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      };

      if (data.success && data.milestones && data.milestones.length > 0) {
        trackerResults.innerHTML = '';
        data.milestones.forEach((item) => {
          const milestoneDiv = document.createElement('div');
          milestoneDiv.className = `tracker-milestone-item ${item.is_completed ? 'completed' : 'pending'}`;
          milestoneDiv.innerHTML = `
            <div class="milestone-icon">${item.is_completed ? '✔' : '⏳'}</div>
            <div class="milestone-details">
              <h4>${item.title}</h4>
              <p>${item.description}</p>
            </div>
            <div class="milestone-timestamp">${item.timestamp}</div>
          `;
          trackerResults.appendChild(milestoneDiv);
        });
      } else {
        renderNotFound(projectCode, data.next_steps);
      }
    } catch (err) {
      // Local fallback checking for valid sample codes or rendering Not Found card
      const SAMPLE_LOOKUP = {
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

      const milestones = SAMPLE_LOOKUP[projectCode];
      if (milestones) {
        trackerResults.innerHTML = '';
        milestones.forEach(item => {
          const milestoneDiv = document.createElement('div');
          milestoneDiv.className = `tracker-milestone-item ${item.is_completed ? 'completed' : 'pending'}`;
          milestoneDiv.innerHTML = `
            <div class="milestone-icon">${item.is_completed ? '✔' : '⏳'}</div>
            <div class="milestone-details">
              <h4>${item.title}</h4>
              <p>${item.description}</p>
            </div>
            <div class="milestone-timestamp">${item.timestamp}</div>
          `;
          trackerResults.appendChild(milestoneDiv);
        });
      } else {
        const stepsList = [
          'Verify your Project Code format (e.g. STD-84920 or STD-92140).',
          'If you recently submitted an intake form, allow up to 15 minutes for system provisioning.',
          'Reach out to our engineering team on WhatsApp or Email for instant tracking assistance.'
        ].map(step => `<li><i data-lucide="info" style="width:16px; height:16px; margin-right:8px; display:inline-block; vertical-align:middle;"></i> ${step}</li>`).join('');

        trackerResults.innerHTML = `
          <div class="tracker-not-found-card glass-card" style="padding: var(--space-6); border-radius: var(--radius-md); border-left: 4px solid var(--text-dim, #999);">
            <div style="margin-bottom: var(--space-4);">
              <span class="status-badge" style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-family: var(--font-mono); font-weight: 600;">NO MATCH FOUND</span>
              <h3 style="margin-top: var(--space-2); font-size: 1.25rem;">No Active Project Found for ID: "<code>${projectCode}</code>"</h3>
            </div>
            <p style="color: var(--text-dim); margin-bottom: var(--space-4); font-size: 0.9rem;">We couldn't locate any active project matching this code in our system database.</p>
            <div class="next-steps-container" style="background: var(--bg-surface-elevated); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <h4 style="margin: 0 0 var(--space-2) 0; font-size: 0.95rem; font-weight: 600;">Recommended Next Steps:</h4>
              <ul style="margin: 0; padding-left: 0; list-style: none; font-size: 0.88rem; color: var(--text-dim); display: flex; flex-direction: column; gap: 8px;">
                ${stepsList}
              </ul>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  };

  if (trackerBtn && trackerInput) {
    trackerBtn.addEventListener('click', () => {
      const code = trackerInput.value.trim() || 'STD-84920';
      fetchAndRenderMilestones(code);
    });

    // Auto load initial project code on startup
    fetchAndRenderMilestones(trackerInput.value || 'STD-84920');
  }
});

