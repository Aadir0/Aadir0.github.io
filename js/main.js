/**
 * Aaditya Raj - Portfolio Application (v6.0)
 * Authentic indie simplicity inspired by tsitski.com:
 * - Direct landing on the portfolio (game opens on-demand via "Refresh your mood")
 * - Name-swap cursor effect: Aaditya -> cholebhature
 * - Tabbed non-scrolling views (home / projects / contact)
 * - Mouse torch spotlight & ambient glitter sparkles
 * - 1-Click email copy & Formspree contact form
 */

document.addEventListener('DOMContentLoaded', () => {
  initNameSwap();
  initBoxingMiniGame();
  initTabNavigation();
  initMouseTorchAndGlitter();
  initEmailCopy();
  initContactForm();
});

/* ==========================================================================
   1. Name Swap Effect: Aaditya -> cholebhature (tsitski style)
   ========================================================================== */
function initNameSwap() {
  const nameSwap = document.getElementById('heroNameSwap') || document.querySelector('.name-swap');
  if (!nameSwap) return;

  let ticking = false;

  function updateMaskPosition(e) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const rect = nameSwap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      nameSwap.style.setProperty('--nx', `${x}px`);
      nameSwap.style.setProperty('--ny', `${y}px`);
    });
  }

  window.addEventListener('pointermove', updateMaskPosition, { passive: true });

  nameSwap.addEventListener('pointerleave', () => {
    nameSwap.style.setProperty('--nx', '-999px');
    nameSwap.style.setProperty('--ny', '-999px');
  });

  // Tap toggle for mobile touch screens
  nameSwap.addEventListener('click', () => {
    nameSwap.classList.toggle('swapped');
  });
}

/* ==========================================================================
   2. 3D Boxing Game (Launched via "Refresh your mood")
   ========================================================================== */
function initBoxingMiniGame() {
  const fightScreen = document.getElementById('fightScreenRoot');
  if (!fightScreen) return;

  const moodButtons = [
    document.getElementById('btnHeaderMood'),
    document.getElementById('btnHeroMood'),
    document.getElementById('btnProjectsMood')
  ].filter(Boolean);

  const closeBtn = document.getElementById('btnCloseFightScreen');

  function openGame() {
    fightScreen.style.display = 'block';
    fightScreen.classList.remove('hidden', 'dismissed');

    if ((!window.fightGame || window.fightGame.destroyed) && document.getElementById('fightCanvas')) {
      window.fightGame = new ArenaFightingGame('fightCanvas');
    }
  }

  function closeGame() {
    fightScreen.classList.add('dismissed');
    setTimeout(() => {
      fightScreen.style.display = 'none';
    }, 350);

    if (window.fightGame && window.fightGame.destroy) {
      window.fightGame.destroy();
    }
  }

  moodButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGame();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeGame();
    });
  }

  // Difficulty selection inside arena overlay
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (window.fightGame) {
        window.fightGame.setDifficulty(btn.dataset.diff);
      }
    });
  });

  // Delegated buttons inside fight screen
  fightScreen.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('diff-btn')) return;

    switch (btn.id) {
      case 'btnStartFight':
      case 'btnRetryFight':
        if (window.fightGame) window.fightGame.startFight();
        break;
      case 'btnSuperMove':
      case 'btnMobileSuper':
        if (window.fightGame) window.fightGame.triggerSuperMove();
        break;
      case 'btnEnterFromFight':
      case 'btnSkipFromLose':
      case 'btnSkipFight':
      case 'btnSkipFightMobile':
        closeGame();
        break;
    }
  });
}

/* ==========================================================================
   3. Tab Navigation (home / projects / contact)
   ========================================================================== */
function initTabNavigation() {
  const navLinks = document.querySelectorAll('.ts-nav-link');
  const panels = document.querySelectorAll('.ts-panel');
  const allTriggers = document.querySelectorAll('[data-tab-target]');

  if (!navLinks.length || !panels.length) return;

  function switchTab(targetId, updateHash = true) {
    if (!targetId) return;

    const cleanId = targetId.replace(/^#/, '');
    const targetPanel = document.getElementById(cleanId);
    if (!targetPanel) return;

    panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === cleanId);
    });

    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-tab-target') === cleanId;
      link.classList.toggle('active', isTarget);
      link.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    if (updateHash && window.location.hash !== `#${cleanId}`) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${cleanId}`);
      } else {
        window.location.hash = cleanId;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  allTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-tab-target');
      if (target) {
        switchTab(target, true);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && document.getElementById(hash)) {
      switchTab(hash, false);
    }
  });

  const initialHash = window.location.hash.replace(/^#/, '');
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash, false);
  }
}

/* ==========================================================================
   4. Mouse Torch Light & Ambient Glitter Particles
   ========================================================================== */
function initMouseTorchAndGlitter() {
  const torch = document.getElementById('cursorGlowLight');
  const canvas = document.getElementById('glitterCanvas');

  // Torch Spotlight
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

      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      torch.classList.remove('active');
      torchActive = false;
    });

    function animateTorch() {
      if (torchActive) {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        torch.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      requestAnimationFrame(animateTorch);
    }
    animateTorch();
  }

  // Glitter Canvas
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const particles = [];
    const PARTICLE_COUNT = 32;

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

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.12 - Math.random() * 0.28,
        size: 0.8 + Math.random() * 1.6,
        baseAlpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.02,
        isStar: Math.random() > 0.65
      });
    }

    function drawSparkle(cx, cy, r, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(255, 220, 165, ${alpha})`;

      ctx.beginPath();
      ctx.moveTo(0, -r * 2);
      ctx.quadraticCurveTo(0, 0, r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, r * 2);
      ctx.quadraticCurveTo(0, 0, -r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 225, ${Math.min(alpha * 1.3, 1)})`;
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

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.baseAlpha * (0.4 + 0.6 * Math.sin(p.phase));

        if (p.isStar) {
          drawSparkle(p.x, p.y, p.size, currentAlpha);
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
   5. 1-Click Email Copy
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
   6. Contact Form (Formspree + Mailto Fallback)
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
    const body = encodeURIComponent(`Hi Aaditya,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`);
    const mailtoUrl = `mailto:aadisingh3217@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    btn.textContent = 'Opening Email Client...';
    showStatus(`Opening email client to send to aadisingh3217@gmail.com...`, 'info');

    setTimeout(() => {
      btn.textContent = originalText;
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
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const endpoint = form.getAttribute('action');

    if (endpoint && endpoint.includes('formspree.io/f/')) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.textContent = 'Message Sent ✓';
          showStatus(`Thanks ${name}! Your message was delivered directly to Aaditya.`, 'success');
          form.reset();

          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Formspree response not ok');
        }
      } catch (err) {
        triggerMailtoFallback(name, email, message, btn, originalText);
      }
    } else {
      triggerMailtoFallback(name, email, message, btn, originalText);
    }
  });
}
