/**
 * Aaditya Raj - Portfolio Application (v5.0)
 * Boxing entrance lifecycle, tab-based view switching, mouse torch spotlight,
 * ambient glitter sparkles, and direct email copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBoxingEntrance();
  initTabNavigation();
  initMouseTorchAndGlitter();
  initEmailCopy();
  initContactForm();
  initScrollProgress();
  initBackToTop();
  initWebsiteOrientation();
});

/* ==========================================================================
   1. Tab Navigation System (Dedicated Non-Scrolling Views)
   ========================================================================== */
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const panels = document.querySelectorAll('.view-panel');
  const allTabTriggers = document.querySelectorAll('[data-tab-target]');

  if (!tabButtons.length || !panels.length) return;

  function switchTab(targetId, updateHash = true) {
    if (!targetId) return;

    // Normalize targetId (remove leading # if passed)
    const cleanId = targetId.replace(/^#/, '');
    const targetPanel = document.getElementById(cleanId);
    if (!targetPanel) return;

    // Update panel visibility
    panels.forEach(panel => {
      if (panel.id === cleanId) {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // Update nav tab buttons state
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab-target') === cleanId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Sync URL hash without jumping
    if (updateHash && window.location.hash !== `#${cleanId}`) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${cleanId}`);
      } else {
        window.location.hash = cleanId;
      }
    }

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle all triggers (header tabs, logo, hero buttons, footer links)
  allTabTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-tab-target');
      if (target) {
        switchTab(target, true);
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && document.getElementById(hash)) {
      switchTab(hash, false);
    }
  });

  // Check initial hash on load
  const initialHash = window.location.hash.replace(/^#/, '');
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash, false);
  }
}

/* ==========================================================================
   2. Mouse Torch Spotlight & Ambient Glitter Particles (tsitski-inspired)
   ========================================================================== */
function initMouseTorchAndGlitter() {
  const torch = document.getElementById('cursorGlowLight');
  const canvas = document.getElementById('glitterCanvas');

  // --- A. Mouse Torch Spotlight ---
  if (torch) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let torchActive = false;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!torchActive) {
        torchActive = true;
        torch.classList.add('active');
      }

      // Update CSS variables for reactive card illumination
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      torch.classList.remove('active');
      torchActive = false;
    });

    // Smooth torch follow animation loop
    function animateTorch() {
      if (torchActive) {
        // Subtle lerp for organic floating feel
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        torch.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      requestAnimationFrame(animateTorch);
    }
    animateTorch();
  }

  // --- B. Ambient Glitter & Star Dust Particles ---
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const particles = [];
    const PARTICLE_COUNT = 38;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.35, // Gentle upward drift
        size: 0.8 + Math.random() * 1.8,
        baseAlpha: 0.2 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        isStar: Math.random() > 0.65 // 35% are delicate 4-point sparkle stars
      });
    }

    function drawSparkleStar(cx, cy, radius, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(255, 225, 175, ${alpha})`;
      
      // Vertical flare
      ctx.beginPath();
      ctx.moveTo(0, -radius * 2.2);
      ctx.quadraticCurveTo(0, 0, radius * 2.2, 0);
      ctx.quadraticCurveTo(0, 0, 0, radius * 2.2);
      ctx.quadraticCurveTo(0, 0, -radius * 2.2, 0);
      ctx.quadraticCurveTo(0, 0, 0, -radius * 2.2);
      ctx.fill();

      // Bright center core
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 250, 230, ${Math.min(alpha * 1.4, 1)})`;
      ctx.fill();
      ctx.restore();
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function renderGlitter() {
      if (!isVisible) {
        requestAnimationFrame(renderGlitter);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around screen boundaries
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Twinkle sinusoidal brightness
        const currentAlpha = p.baseAlpha * (0.45 + 0.55 * Math.sin(p.phase));

        if (p.isStar) {
          drawSparkleStar(p.x, p.y, p.size, currentAlpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 210, 150, ${currentAlpha * 0.75})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(renderGlitter);
    }

    renderGlitter();
  }
}

/* ==========================================================================
   3. 1-Click Email Copy Functionality
   ========================================================================== */
function initEmailCopy() {
  const btn = document.getElementById('btnCopyEmail');
  const label = document.getElementById('copyLabel');
  const icon = document.getElementById('copyIcon');
  if (!btn) return;

  const email = 'aadisingh3217@gmail.com';

  btn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }

      btn.classList.add('copied');
      if (label) label.textContent = 'Copied!';
      if (icon) icon.textContent = '✓';

      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
        if (icon) icon.textContent = '📋';
      }, 2500);
    } catch (err) {
      console.warn('Clipboard copy failed', err);
    }
  });
}

/* ==========================================================================
   4. Boxing Game Entrance Management & Clean Shutdown
   ========================================================================== */
function initBoxingEntrance() {
  const fightScreen = document.getElementById('fightScreenRoot');
  if (!fightScreen || !document.getElementById('fightCanvas')) return;

  window.fightGame = new ArenaFightingGame('fightCanvas');

  // Difficulty selection on the start screen
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (window.fightGame) {
        window.fightGame.setDifficulty(btn.dataset.diff);
      }
    });
  });

  // Function to completely kill the game so it NEVER runs in the background
  const terminateAndEnter = () => {
    exitLandscapeForWebsite();

    if (window.fightGame) {
      window.fightGame.destroy(); // Stops requestAnimationFrame & audio completely
    }
    if (fightScreen) {
      fightScreen.classList.add('dismissed');
      setTimeout(() => {
        fightScreen.style.display = 'none'; // Completely removes from rendering
        checkWebsiteOrientationPrompt();
      }, 600);
    }
  };

  // Single delegated listener: every button in the fight screen keeps working
  fightScreen.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !window.fightGame) return;

    if (btn.classList.contains('diff-btn')) return; // handled above

    switch (btn.id) {
      case 'btnStartFight':
      case 'btnRetryFight':
        window.fightGame.startFight();
        break;
      case 'btnSuperMove':
      case 'btnMobileSuper':
        window.fightGame.triggerSuperMove();
        break;
      case 'btnEnterFromFight':
        terminateAndEnter();
        break;
      case 'btnSkipFromLose':
      case 'btnSkipFight':
      case 'btnSkipFightMobile':
        terminateAndEnter();
        break;
    }
  });
}

/* ==========================================================================
   5. Mobile Website Orientation Notice (Vertical Mode on Entry)
   ========================================================================== */
function initWebsiteOrientation() {
  const dismissBtn = document.getElementById('btnDismissRotateNotice');
  const notice = document.getElementById('websiteRotateNotice');
  if (dismissBtn && notice) {
    dismissBtn.addEventListener('click', () => {
      notice.classList.add('hidden');
      notice.dataset.dismissed = 'true';
    });
  }

  const handleOrientationUpdate = () => {
    checkWebsiteOrientationPrompt();
  };

  window.addEventListener('resize', handleOrientationUpdate);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleOrientationUpdate, 250);
  });
}

function checkWebsiteOrientationPrompt() {
  const notice = document.getElementById('websiteRotateNotice');
  const fightScreen = document.getElementById('fightScreenRoot');
  if (!notice) return;

  // If fight screen is still active, don't show the website notice
  if (fightScreen && !fightScreen.classList.contains('dismissed') && fightScreen.style.display !== 'none') {
    notice.classList.add('hidden');
    return;
  }

  if (notice.dataset.dismissed === 'true') {
    return;
  }

  const isTouch = window.matchMedia('(pointer: coarse)').matches || 
                  'ontouchstart' in window || 
                  (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isTouch && isLandscape) {
    notice.classList.remove('hidden');
  } else {
    notice.classList.add('hidden');
  }
}

function exitLandscapeForWebsite() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
    if (exitFs) {
      try {
        const p = exitFs.call(document);
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    }
  }

  if (typeof screen !== 'undefined' && screen.orientation) {
    if (screen.orientation.unlock) {
      try { screen.orientation.unlock(); } catch (e) {}
    }
    if (screen.orientation.lock) {
      try { screen.orientation.lock('portrait').catch(() => {}); } catch (e) {}
    }
  }

  setTimeout(checkWebsiteOrientationPrompt, 300);
}

/* ==========================================================================
   6. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ==========================================================================
   7. Floating Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 450);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. Contact Form Handling (Formspree + Direct Mailto Fallback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusMsg = document.getElementById('formStatusMsg');

  const showStatus = (text, type = 'success') => {
    if (!statusMsg) return;
    statusMsg.textContent = text;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.classList.remove('hidden');
  };

  const triggerMailtoFallback = (name, email, message, btn, originalText) => {
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Hi Aaditya,

${message}

---
Sender: ${name}
Email: ${email}`);
    const mailtoUrl = `mailto:aadisingh3217@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    btn.textContent = 'Opening Email Client...';
    btn.style.background = '#0284C7';
    showStatus(`Opening email client to send to aadisingh3217@gmail.com...`, 'info');

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please fill in your name, email, and message.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending Message...';
    btn.disabled = true;

    const endpoint = form.getAttribute('action');
    const hasLiveEndpoint = endpoint && endpoint.includes('formspree.io/f/') && !endpoint.includes('mrpedoan_placeholder');

    if (hasLiveEndpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.textContent = 'Message Sent ✓';
          btn.style.background = '#15803D';
          showStatus(`Thanks ${name}! Your message was delivered directly to Aaditya's Gmail.`, 'success');
          form.reset();

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Endpoint submission failed');
        }
      } catch (err) {
        triggerMailtoFallback(name, email, message, btn, originalText);
      }
    } else {
      triggerMailtoFallback(name, email, message, btn, originalText);
    }
  });
}
