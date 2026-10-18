/**
 * Aaditya Raj - Portfolio Application
 * Manages Boxing Game Dismissal (complete cleanup) and Interactive Page Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  initBoxingEntrance();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   Boxing Game Entrance Management & Clean Shutdown
   ========================================================================== */
function initBoxingEntrance() {
  const fightScreen = document.getElementById('fightScreenRoot');
  const btnStart = document.getElementById('btnStartFight');
  const btnRetry = document.getElementById('btnRetryFight');
  const btnEnter = document.getElementById('btnEnterFromFight');
  const btnSkip = document.getElementById('btnSkipFight');

  if (document.getElementById('fightCanvas')) {
    window.fightGame = new ArenaFightingGame('fightCanvas');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        window.fightGame.startFight();
      });
    }

    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        window.fightGame.startFight();
      });
    }

    // Function to completely kill the game so it NEVER runs in the background
    const terminateAndEnter = () => {
      if (window.fightGame) {
        window.fightGame.destroy(); // Stops requestAnimationFrame & audio completely
      }
      if (fightScreen) {
        fightScreen.classList.add('dismissed');
        setTimeout(() => {
          fightScreen.style.display = 'none'; // Completely removes from rendering
        }, 600);
      }
    };

    if (btnEnter) btnEnter.addEventListener('click', terminateAndEnter);
    if (btnSkip) btnSkip.addEventListener('click', terminateAndEnter);
  }
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
