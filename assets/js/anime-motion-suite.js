/* ==========================================================================
   ANIME.JS & MOTION SUITE
   - Motion scroll-linked progress bar
   - Motion inView entrance animations
   - Anime.js stat counter number animations
   ========================================================================== */

import { animate as motionAnimate, scroll as motionScroll, inView as motionInView } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initAnimeCounters();
  initMotionInViewObserver();
});

/* 1. Motion Scroll Progress Bar */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  motionScroll(({ y }) => {
    progressBar.style.width = `${y.progress * 100}%`;
  });
}

/* 2. Anime.js Stat Counters */
function initAnimeCounters() {
  const statElements = document.querySelectorAll('.stat-num[data-value]');
  if (!statElements.length) return;

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

/* 3. Motion inView Staggered Entrance */
function initMotionInViewObserver() {
  motionInView('.project-card', ({ target }) => {
    motionAnimate(target, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
  });

  motionInView('.capability-card', ({ target }) => {
    motionAnimate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5 });
  });
}
