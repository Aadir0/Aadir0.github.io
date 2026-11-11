/**
 * Aaditya Raj - Portfolio Application (v7.0)
 * Clean, warm, and authentic indie game developer portfolio:
 * - Smooth name-swap: Aaditya -> cholebhature (no clipping, no dotted lines)
 * - 3D boxing game only on projects page
 * - Dedicated Devlogs & Blog section with full article reader modal
 * - Ambient cursor torch & gentle star dust
 */

document.addEventListener('DOMContentLoaded', () => {
  initNameSwap();
  initBoxingMiniGame();
  initTabNavigation();
  initDevlogReader();
  initMouseTorchAndGlitter();
});

/* ==========================================================================
   1. Name Swap Effect: Aaditya -> cholebhature (Clean & Seamless)
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
   4. Devlogs & Blog Modal Reader
   ========================================================================== */
const blogPosts = {
  'last-train': {
    title: 'Building The Last Train: Fluid Aerial Blade Combos in Unity URP',
    meta: 'Combat Systems · Unity (URP) · Nov 2026',
    image: 'assets/images/projects/the-last-train.png',
    content: `
      <p>When developing <strong>The Last Train</strong>, the primary goal was to make combat feel snappy and airborne rather than grounded and sluggish. The player fights swarms of skeletons and flying witches atop a hurtling train cutting through the night.</p>
      
      <p>Here are the core gameplay systems we engineered to achieve that responsive arcade feel:</p>

      <h3>1. Jump Buffering and Coyote Time</h3>
      <p>In fast platformers, pressing jump a split second before hitting the ground should never drop your input. We implemented an 8-frame input buffer queue and 6-frame coyote timer. This makes landing directly into another leap or blade slash feel immediate and seamless.</p>

      <h3>2. Aerial Combat & Hitstop Sparks</h3>
      <p>Landing a mid-air blade hit momentarily freezes the character for <code>45 milliseconds</code> (hitstop) before resuming velocity. Combined with directional particle sparks, screen-shake, and an upward lift impulse, stringing 4-hit air juggles feels exceptionally juicy.</p>

      <h3>3. Performance atop a Hurtling Train</h3>
      <p>Instead of moving the train across an endless infinite terrain, the train remains stationary at the origin while the procedural skyline, track ties, and wind particles scroll backward at 60 km/h. This completely eliminated floating-point jitter while maintaining cinematic speed.</p>
    `
  },
  'time-traveler': {
    title: 'Time Traveler Post-Mortem: Designing Circular Temporal Puzzles',
    meta: 'Hackathon Winner · Unity & C# · Oct 2026',
    image: 'assets/images/projects/time-traveler.png',
    content: `
      <p><strong>Time Traveler</strong> was created for and awarded 1st Place at <em>Just a Hackathon</em>. The challenge was building an intuitive temporal loop mechanic within a strict 48-hour jam deadline.</p>

      <h3>The Core Time-Loop Mechanic</h3>
      <p>The player can trigger a timeline record. Every action, step, and button press is recorded into a cyclical keyframe buffer. Upon pressing rewind, time rewinds smoothly, and a holographic clone repeats your exact recorded actions while you move freely as a new iteration.</p>

      <h3>Solving the Paradox Dilemma</h3>
      <p>A classic puzzle trap in time travel games is creating state deadlocks (e.g. clone pushes a block, but the current iteration removes that block). We resolved this by treating temporal clones as deterministic shadow actors with spatial collision priority, preventing physics instability and frustrating desyncs.</p>

      <h3>Key Takeaway</h3>
      <p>Simple puzzle elements—like opening a gate while your past self steps on a pressure plate—become immensely rewarding when paired with crisp clock audio ticks and reverse-dissolve shaders.</p>
    `
  },
  'nightmare': {
    title: 'Atmospheric Silhouettes: Winning Best Art Direction at Geek-N-Jam',
    meta: 'Geek-N-Jam Winner · Visual Design · Sep 2026',
    image: 'assets/images/projects/nightmare.png',
    content: `
      <p>Co-developed with Rishabh Surana for the Geek-N-Jam game jam, <strong>Nightmare — A fairy tale</strong> was honored with the <em>Best Art Direction Award</em>. Our vision was an eerie, Grimm-style dark fantasy platformer where the environment itself tells a story.</p>

      <h3>Multi-Plane Parallax Depth</h3>
      <p>To give the 2D world cinematic depth, we separated the visuals into 5 distinct parallax layers: twisted foreground roots, player playfield, misty midground trees, ruined silhouette castles, and a desolate glowing moon.</p>

      <h3>Dynamic Rim Lighting</h3>
      <p>Using Unity's 2D Light system, characters cast real-time soft shadows against foreground hazards while receiving a delicate amber rim glow from ambient fireflies. This kept the player instantly readable against pitch-dark backdrops.</p>

      <h3>Juicy Audio-Visual Polish</h3>
      <p>Every jump and environmental landing kicks up atmospheric mist particles paired with soft wooden thuds, grounding the fairy tale world in physical texture.</p>
    `
  }
};

function initDevlogReader() {
  const modal = document.getElementById('devlogModal');
  const modalBody = document.getElementById('devlogModalBody');
  const closeBtn = document.getElementById('btnCloseModal');
  if (!modal || !modalBody) return;

  function openPost(postId) {
    const post = blogPosts[postId];
    if (!post) return;

    modalBody.innerHTML = `
      <span class="modal-meta">${post.meta}</span>
      <h2>${post.title}</h2>
      <img src="${post.image}" alt="${post.title}" loading="lazy">
      <div class="modal-article-text">${post.content}</div>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-blog]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = btn.getAttribute('data-open-blog');
      openPost(postId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Mouse Torch Light & Ambient Glitter Particles
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
    const PARTICLE_COUNT = 30;

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
        vy: -0.1 - Math.random() * 0.25,
        size: 0.8 + Math.random() * 1.5,
        baseAlpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.02,
        isStar: Math.random() > 0.65
      });
    }

    function drawSparkle(cx, cy, r, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(255, 225, 175, ${alpha})`;

      ctx.beginPath();
      ctx.moveTo(0, -r * 2);
      ctx.quadraticCurveTo(0, 0, r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, r * 2);
      ctx.quadraticCurveTo(0, 0, -r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 230, ${Math.min(alpha * 1.3, 1)})`;
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
          ctx.fillStyle = `rgba(255, 215, 160, ${currentAlpha * 0.75})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(renderGlitter);
    }

    renderGlitter();
  }
}
