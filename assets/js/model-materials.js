/* ==========================================================================
   MODEL MATERIALS & INTERACTIVE CANVAS FALLBACK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvasFallback();
  initModelViewerEvents();
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

    modelViewer.addEventListener('error', (err) => {
      console.warn('3D Model failed to load, falling back to interactive Canvas 3D node grid.', err);
      if (fallbackCanvas) {
        fallbackCanvas.style.opacity = '1';
      }
    });
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

  // Interactive 3D LEGO Block / Node Grid Animation
  const nodes = [];
  const count = 28;

  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 200,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 14 + Math.random() * 16,
      color: i % 4 === 0 ? '#e31813' : i % 4 === 1 ? '#0284c7' : i % 4 === 2 ? '#16a34a' : '#f3c300'
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
    ctx.strokeStyle = 'rgba(200, 210, 225, 0.25)';
    ctx.lineWidth = 1;
    const step = 40;

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

    // Connect close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.strokeStyle = `rgba(100, 116, 139, ${0.35 * (1 - dist / 130)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Render tactile 3D block nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse attraction
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        node.x += (dx / dist) * 0.5;
        node.y += (dy / dist) * 0.5;
      }

      // Draw rounded block node with top highlight
      ctx.save();
      ctx.fillStyle = node.color;
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      const r = 6;
      ctx.beginPath();
      ctx.roundRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size, r);
      ctx.fill();

      // Top tactile highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.roundRect(node.x - node.size / 2 + 2, node.y - node.size / 2 + 2, node.size - 4, 3, 2);
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}
