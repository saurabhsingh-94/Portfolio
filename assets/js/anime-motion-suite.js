/* ==========================================================================
   HIGH-END ANIME.JS & 3D MOTION SUITE
   ========================================================================== */

import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCursorGlow();
  initScrollProgressBar();
  initHeroHeaderReveals();
  initAnimeOnScrollReveals();
  initAnimeCountersOnScroll();
  init3DCardTiltEngine();
});

/* 1. Ambient Mouse Glow Follower */
function initAmbientCursorGlow() {
  let glow = document.querySelector('.ambient-glow');
  if (!glow) {
    glow = document.createElement('div');
    glow.className = 'ambient-glow';
    document.body.appendChild(glow);
  }

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* 2. Scroll Progress Bar */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    anime({
      targets: progressBar,
      width: `${scrolled}%`,
      duration: 50,
      easing: 'linear'
    });
  });
}

/* 3. Hero Header Anime.js Entrance Animation */
function initHeroHeaderReveals() {
  anime({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [35, 0],
    duration: 900,
    easing: 'easeOutCubic'
  });

  anime({
    targets: '.hero-bio, .hero-actions, .hero-stats',
    opacity: [0, 1],
    translateY: [25, 0],
    delay: anime.stagger(150),
    duration: 800,
    easing: 'easeOutCubic'
  });
}

/* 4. Anime.js onScroll Observer for Cards */
function initAnimeOnScrollReveals() {
  window.observeProjectCards = function() {
    const cards = document.querySelectorAll('.project-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 650,
            easing: 'easeOutCubic'
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => cardObserver.observe(card));
    init3DCardTiltEngine();
  };

  window.observeProjectCards();

  // Section Headers & Capabilities
  const sectionItems = document.querySelectorAll('.capability-card, .cert-card, .terminal-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 600,
          easing: 'easeOutQuad'
        });
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sectionItems.forEach(item => sectionObserver.observe(item));
}

/* 5. Interactive 3D Card Tilt Engine */
function init3DCardTiltEngine() {
  const cards = document.querySelectorAll('.project-card, .hero-visual-card, .capability-card');

  cards.forEach(card => {
    if (card.getAttribute('data-tilt-bound') === 'true') return;
    card.setAttribute('data-tilt-bound', 'true');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;

      anime({
        targets: card,
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.015,
        duration: 100,
        easing: 'linear'
      });
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        scale: 1.0,
        duration: 450,
        easing: 'easeOutQuad'
      });
    });
  });
}

/* 6. Stat Counters */
function initAnimeCountersOnScroll() {
  const statContainer = document.querySelector('.hero-stats');
  if (!statContainer) return;

  let triggered = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        const statElements = document.querySelectorAll('.stat-num[data-value]');

        statElements.forEach(el => {
          const targetVal = parseInt(el.getAttribute('data-value'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';

          const counterObj = { value: 0 };
          anime({
            targets: counterObj,
            value: targetVal,
            round: 1,
            easing: 'easeOutExpo',
            duration: 2000,
            update: function() {
              el.textContent = counterObj.value + suffix;
            }
          });
        });
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statContainer);
}
