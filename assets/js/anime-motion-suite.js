/* ==========================================================================
   ANIME.JS ON-SCROLL ENGINE
   ========================================================================== */

import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initAnimeOnScrollReveals();
  initAnimeCountersOnScroll();
});

/* 1. Anime.js Scroll Progress Bar */
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

/* 2. Anime.js onScroll Observer */
function initAnimeOnScrollReveals() {
  window.observeProjectCards = function() {
    const cards = document.querySelectorAll('.project-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [35, 0],
            duration: 650,
            easing: 'easeOutCubic'
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => cardObserver.observe(card));
  };

  // Run initial observation
  window.observeProjectCards();

  // Section items
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

/* 3. Stat Counters */
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
