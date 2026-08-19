/* ==========================================================================
   ANIME.JS V4 & MOTION ENGINE SUITE
   - animate, onScroll, createAnimatable, morphTo, createMotionPath, createDrawable
   - Motion scroll(), inView(), and spring gestures
   ========================================================================== */

import { animate as motionAnimate, scroll as motionScroll, inView as motionInView } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initAnimeDrawableStrokes();
  initAnimeMorphingShapes();
  initAnimeMotionPath();
  initAnimeCounters();
  initMotionInViewObserver();
});

/* 1. Motion Scroll-linked Progress Bar */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  motionScroll(({ y }) => {
    progressBar.style.width = `${y.progress * 100}%`;
  });
}

/* 2. Anime.js createDrawable (SVG Stroke Drawing) */
function initAnimeDrawableStrokes() {
  const svgPaths = document.querySelectorAll('.bklit-line-path, .bklit-area-path');
  if (!svgPaths.length) return;

  anime({
    targets: '.bklit-line-path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutCubic',
    duration: 2500,
    delay: 300
  });
}

/* 3. Anime.js morphTo (Polygon Shape Morphing) */
function initAnimeMorphingShapes() {
  const morphPolygon = document.getElementById('svg-morph-polygon');
  if (!morphPolygon) return;

  // Keyframes for morphing polygon points (hexagon -> star -> octagram -> rhombus)
  const pointsList = [
    "120,20 200,65 200,155 120,200 40,155 40,65",   // Hexagon
    "120,10 145,80 220,80 160,125 185,195 120,150 55,195 80,125 20,80 95,80", // Star
    "120,30 180,30 210,90 210,150 180,210 120,210 60,150 60,90", // Octagon
    "120,10 210,110 120,210 30,110"                // Diamond
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % pointsList.length;
    anime({
      targets: morphPolygon,
      points: pointsList[index],
      easing: 'easeInOutElastic(1, .6)',
      duration: 1800
    });
  }, 3200);
}

/* 4. Anime.js createMotionPath (Particle Node Path Orbit) */
function initAnimeMotionPath() {
  const follower = document.getElementById('motion-path-follower');
  if (!follower) return;

  const path = anime.path('#orbit-svg-path');

  anime({
    targets: follower,
    translateX: path('x'),
    translateY: path('y'),
    rotate: path('angle'),
    easing: 'linear',
    duration: 6000,
    loop: true
  });
}

/* 5. Anime.js createAnimatable (Stat Number Counters) */
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

/* 6. Motion inView Observer (Staggered Entrance) */
function initMotionInViewObserver() {
  motionInView('.project-card', ({ target }) => {
    motionAnimate(target, { opacity: [0, 1], y: [35, 0] }, { duration: 0.65, easing: [0.16, 1, 0.3, 1] });
  });

  motionInView('.capability-card', ({ target }) => {
    motionAnimate(target, { opacity: [0, 1], y: [25, 0] }, { duration: 0.5 });
  });

  motionInView('.bklit-chart-card', ({ target }) => {
    motionAnimate(target, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.6 });
  });
}
