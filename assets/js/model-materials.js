/* ==========================================================================
   MODEL MATERIALS & ANIME.JS V4 UTILITIES (animate, onScroll, morphTo, createDrawable)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvasFallback();
  initModelViewerEvents();
  initAnimeUtilities();
});

function initModelViewerEvents() {
  const modelViewer = document.querySelector('model-viewer');
  const fallbackCanvas = document.getElementById('hero-canvas-fallback');

  if (modelViewer) {
    modelViewer.addEventListener('load', () => {
      console.log('3D Hero GLB Model loaded successfully.');
      if (fallbackCanvas) {
        fallbackCanvas.style.opacity = '0';
      }
    });

    modelViewer.addEventListener('error', () => {
      console.warn('3D Model failed to load, falling back to interactive Canvas 3D particle grid.');
      if (fallbackCanvas) {
        fallbackCanvas.style.opacity = '1';
      }
    });
  }
}

/* Anime.js v4 Animation Hooks & Motion Paths */
function initAnimeUtilities() {
  // Animate Bklit UI Area Chart SVG Path if present
  const areaPath = document.querySelector('.bklit-area-path');
  if (areaPath) {
    areaPath.style.opacity = '0';
    setTimeout(() => {
      areaPath.style.transition = 'opacity 1s ease';
      areaPath.style.opacity = '1';
    }, 300);
  }
}

function initHeroCanvasFallback() {
  const canvas = document.getElementById('hero-canvas-fallback');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Quantum Particle Nodes
  const nodes = [];
  const count = 32;

  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      size: 3 + Math.random() * 4,
      color: i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#10b981' : '#6366f1'
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = 44;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.3 * (1 - dist / 140)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Render nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse attraction
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        node.x += (dx / dist) * 0.6;
        node.y += (dy / dist) * 0.6;
      }

      ctx.save();
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}
