/**
 * Aaditya Raj - Portfolio Application
 * Boxing entrance lifecycle, emote celebration, and interactive page polish.
 * All fight-screen buttons use event delegation so they keep working
 * in every game state (including right after a knockout).
 */

document.addEventListener('DOMContentLoaded', () => {
  initBoxingEntrance();
  initFlipCards();
  initContactForm();
  initScrollAnimations();
  initScrollProgress();
  initActiveNav();
  initBackToTop();
  initWebsiteOrientation();
});

/* ==========================================================================
   Mobile Website Orientation Management (Vertical Mode on Entry)
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

  // When browsing website on mobile, if device is held horizontally, show orientation hint
  if (isTouch && isLandscape) {
    notice.classList.remove('hidden');
  } else {
    notice.classList.add('hidden');
  }
}

function exitLandscapeForWebsite() {
  // Exit fullscreen if active
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
    if (exitFs) {
      try {
        const p = exitFs.call(document);
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    }
  }

  // Release landscape lock and restore natural vertical portrait mode
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
   Mobile & Desktop Flip Card Interactions
   ========================================================================== */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if user clicked a link inside the flipped card
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
  });
}

/* ==========================================================================
   Boxing Game Entrance Management & Clean Shutdown
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

  // Single delegated listener: every button in the fight screen keeps working,
  // no matter which overlay is open or when it was created.
  fightScreen.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !window.fightGame) return;

    if (btn.classList.contains('diff-btn')) return; // handled above

    switch (btn.id) {
      case 'btnStartFight':
      case 'btnRetryFight':
        window.fightGame.startFight();
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
   Juicy Page Animations & Micro-Interactions
   ========================================================================== */
function initScrollAnimations() {
  // Intersection Observer for graceful section reveals
  const revealElements = document.querySelectorAll('.project-row, .milestones-bullets, .skills-block');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

/* ==========================================================================
   Scroll Progress Bar
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
   Active Nav Highlighting
   ========================================================================== */
function initActiveNav() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = ['about', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   Floating Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 550);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending Message...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Received ✓';
      btn.style.background = '#15803D';
      
      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 700);
  });
}
