/* ==========================================================================
   HIGH-END ANIME.JS & 3D MOTION SUITE
   - Title & Heading Word-Span Stagger Reveals (anime.stagger)
   - Interactive 3D Card Parallax Tilt Engine
   - Ambient Mouse Light Follower
   - Scroll-linked Progress Bar
   ========================================================================== */

import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCursorGlow();
  initScrollProgressBar();
  initTitleWordStaggerReveals();
  initAnimeOnScrollReveals();
  initAnimeCountersOnScroll();
  init3DCardTiltEngine();
});

/* 1. Ambient Mouse Glow Follower */
function initAmbientCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    glow.style.left = `${mouseX}px`;
    glow.style.top = `${mouseY}px`;
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

/* 3. Title & Heading Word Stagger Revealer (anime.stagger) */
function initTitleWordStaggerReveals() {
  const titles = document.querySelectorAll('.hero-title, .section-title');
  
  titles.forEach(title => {
    if (title.getAttribute('data-split') === 'true') return;
    title.setAttribute('data-split', 'true');

    // Split text nodes into wrapped word spans
    const text = title.innerHTML;
    const words = text.split(' ');
    
    title.innerHTML = words.map(w => `<span class="word-mask"><span class="word-span">${w}</span></span>`).join(' ');
  });

  // Animate hero title words on load
  anime({
    targets: '.hero-title .word-span',
    translateY: ['110%', '0%'],
    rotateX: [-25, 0],
    opacity: [0, 1],
    delay: anime.stagger(50),
    duration: 950,
    easing: 'easeOutCubic'
  });
}

/* 4. Anime.js onScroll Intersection Observer */
function initAnimeOnScrollReveals() {
  window.observeProjectCards = function() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach((card, i) => {
      // Set initial transform
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.96)';
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.96, 1],
            duration: 750,
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

  // Section Headers & Cards
  const sectionItems = document.querySelectorAll('.section-title .word-span, .capability-card, .cert-card, .terminal-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: ['110%', '0%'],
          rotateX: [entry.target.classList.contains('word-span') ? -20 : 0, 0],
          duration: 750,
          easing: 'easeOutCubic'
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

      const rotateX = ((centerY - y) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;

      anime({
        targets: card,
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.02,
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
        duration: 500,
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
            duration: 2200,
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
