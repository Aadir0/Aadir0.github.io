/**
 * Aaditya Raj - Portfolio Application (v8.0)
 * Minimalist, authentic indie game developer portfolio:
 * - Smooth name-swap: Aaditya Raj <-> cholebhature (no clipping, no dotted lines)
 * - Clean tactile project list inspired by tsitski.com
 * - Auto-syncing Devlogs via RSS with external read links
 * - 3D boxing game accessible from projects page
 * - Ambient cursor torch & gentle golden star dust
 */

document.addEventListener('DOMContentLoaded', () => {
  initNameSwap();
  initBoxingMiniGame();
  initTabNavigation();
  initDevlogSync();
  initMouseTorchAndGlitter();
});

/* ==========================================================================
   1. Name Swap Effect: Aaditya Raj <-> cholebhature (Clean & Seamless)
   ========================================================================== */
function initNameSwap() {
  const nameSwap = document.getElementById('heroNameSwap') || document.querySelector('.name-swap');
  if (!nameSwap) return;

  nameSwap.addEventListener('mouseenter', () => {
    nameSwap.classList.add('swapped');
  });

  nameSwap.addEventListener('mouseleave', () => {
    nameSwap.classList.remove('swapped');
  });

  // Tap toggle for mobile touch screens
  nameSwap.addEventListener('click', () => {
    nameSwap.classList.toggle('swapped');
  });
}

/* ==========================================================================
   2. 3D Boxing Game (Only Opened from Projects Page)
   ========================================================================== */
function initBoxingMiniGame() {
  const fightScreen = document.getElementById('fightScreenRoot');
  if (!fightScreen) return;

  const moodBtn = document.getElementById('btnProjectsMood');
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

  if (moodBtn) {
    moodBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGame();
    });
  }

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
   3. Tab Navigation (home / projects / blog)
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
   4. Devlogs Auto-Sync & External Link Management
   ========================================================================== */
// Feed Configuration: Change this URL to your itch.io, Substack, Medium, or Hashnode RSS feed!
const DEVLOG_CONFIG = {
  feedUrl: 'https://cholebhature-hehe.itch.io/feed/devlog.rss',
  fallbackPlatformName: 'itch.io'
};

async function initDevlogSync() {
  const container = document.getElementById('blogPostsContainer');
  if (!container || !DEVLOG_CONFIG.feedUrl) return;

  try {
    const rssApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(DEVLOG_CONFIG.feedUrl)}`;
    const response = await fetch(rssApiUrl, { cache: 'no-store' });
    if (!response.ok) return;

    const data = await response.json();
    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      container.innerHTML = '';
      data.items.slice(0, 8).forEach(item => {
        // Extract or fallback cover image
        let coverImg = item.thumbnail || (item.enclosure && item.enclosure.link);
        if (!coverImg && item.content) {
          const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match) coverImg = match[1];
        }
        if (!coverImg) {
          coverImg = 'assets/images/projects/the-last-train.png';
        }

        // Clean snippet
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description || item.content || '';
        const excerpt = (tempDiv.textContent || tempDiv.innerText || '').trim().slice(0, 140) + '...';

        // Format date
        let dateStr = '';
        if (item.pubDate) {
          const d = new Date(item.pubDate);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
        }

        const card = document.createElement('article');
        card.className = 'ts-blog-card';
        card.innerHTML = `
          <div class="ts-blog-thumb">
            <img src="${coverImg}" alt="${item.title}" loading="lazy">
          </div>
          <div class="ts-blog-content">
            <div class="ts-blog-meta">
              <span class="ts-blog-date">${dateStr || 'Recent'}</span>
              <span class="ts-link-sep">·</span>
              <span class="ts-blog-tag">${DEVLOG_CONFIG.fallbackPlatformName}</span>
            </div>
            <h3 class="ts-blog-title">${item.title}</h3>
            <p class="ts-blog-excerpt">${excerpt}</p>
            <div class="ts-blog-footer">
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="ts-simple-link">
                Read on ${DEVLOG_CONFIG.fallbackPlatformName} ↗
              </a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }
  } catch (err) {
    // If the feed is new or network is down, the static fallback cards stay active
    console.log('Devlog feed using fallback:', err);
  }
}

/* ==========================================================================
   5. Mouse Torch Light & Ambient Glitter Particles
   ========================================================================== */
function initMouseTorchAndGlitter() {
  const torch = document.getElementById('cursorGlowLight');
  const canvas = document.getElementById('glitterCanvas');

  // Torch Spotlight (Soft warm radial sheen on light paper)
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

  // Glitter Canvas (Gentle golden amber star dust)
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const particles = [];
    const PARTICLE_COUNT = 24;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    class StarParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.6;
        this.alpha = Math.random() * 0.45 + 0.15;
        this.fadeSpeed = (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1);
      }

      update() {
        this.alpha += this.fadeSpeed;
        if (this.alpha > 0.65) {
          this.alpha = 0.65;
          this.fadeSpeed = -Math.abs(this.fadeSpeed);
        } else if (this.alpha < 0.08) {
          this.alpha = 0.08;
          this.fadeSpeed = Math.abs(this.fadeSpeed);
        }
      }

      draw() {
        ctx.fillStyle = `rgba(195, 120, 35, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new StarParticle());
    }

    function animateGlitter() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateGlitter);
    }
    animateGlitter();
  }
}
