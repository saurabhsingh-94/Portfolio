/* ==========================================================================
   PROJECT INVENTORY ENGINE (REAL PROJECTS ONLY)
   ========================================================================== */

let projectData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
  initThemeToggle();
  initTerminal();
});

async function fetchProjects() {
  try {
    const res = await fetch('./data/projects.json');
    const data = await res.json();
    projectData = data.projects || [];
    renderProjects(projectData);
    initFilters();
  } catch (err) {
    console.error('Failed to load project inventory:', err);
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No projects found matching criteria.</p>`;
    return;
  }

  container.innerHTML = projects.map(p => {
    const statusClass = p.status ? p.status.toLowerCase().replace(/\s+/g, '-') : 'production';
    
    return `
      <div class="project-card visible" data-status="${statusClass}">
        <div class="card-top">
          <div class="card-header">
            <h3 class="card-title">${escapeHtml(p.title)}</h3>
            <span class="status-badge ${statusClass}">${escapeHtml(p.status || 'Production')}</span>
          </div>
          <p class="card-summary">${escapeHtml(p.summary)}</p>
          <div class="card-tags">
            ${(p.technologies || []).slice(0, 4).map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <a href="${p.links.caseStudy || '#'}" class="card-link">
            Case Study & Detail ↗
          </a>
          ${p.links.live ? `
            <a href="${p.links.live}" target="_blank" rel="noopener" class="card-link" style="color: var(--muted);">
              GitHub Repository ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        renderProjects(projectData);
      } else {
        const filtered = projectData.filter(p => p.status.toLowerCase().replace(/\s+/g, '-') === filter);
        renderProjects(filtered);
      }
    });
  });
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

/* Interactive Terminal Engine */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  if (!input || !body) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';

      appendTerminalLine(`saurabh@web3-node:~$ ${escapeHtml(cmd)}`, 'var(--cyan)');

      switch (cmd) {
        case 'help':
          appendTerminalLine('Available commands:\n- about       : Display developer biography\n- projects    : List all 6 real repositories\n- certs       : View verified credentials\n- clear       : Clear terminal output\n- contact     : Get contact links', 'var(--ink)');
          break;
        case 'about':
          appendTerminalLine('Saurabh Kumar Singh — B.Tech CSE (Blockchain Spec).\nPassionate about Hedera Hashgraph, EVM Smart Contracts, Rust, and Full-Stack Web3 development.', 'var(--emerald)');
          break;
        case 'projects':
          appendTerminalLine(projectData.map(p => `• [${p.status}] ${p.title} (${p.technologies.slice(0, 3).join(', ')})`).join('\n'), 'var(--yellow)');
          break;
        case 'certs':
          appendTerminalLine('• Hashgraph Association Certified Developer\n• HackerRank Problem Solving & Python Certificates', 'var(--indigo)');
          break;
        case 'contact':
          appendTerminalLine('GitHub: https://github.com/saurabhsingh-94\nLinkedIn: https://www.linkedin.com/in/saurabh-singh-381a65383/', 'var(--cyan)');
          break;
        case 'clear':
          body.innerHTML = '';
          break;
        default:
          if (cmd !== '') {
            appendTerminalLine(`Command not found: "${escapeHtml(cmd)}". Type "help" for a list of available commands.`, 'var(--red)');
          }
      }

      body.scrollTop = body.scrollHeight;
    }
  });
}

function appendTerminalLine(text, color = 'var(--ink)') {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const div = document.createElement('div');
  div.className = 'terminal-line';
  div.style.color = color;
  div.style.whiteSpace = 'pre-wrap';
  div.textContent = text;

  const inputWrap = document.querySelector('.terminal-input-wrap');
  body.insertBefore(div, inputWrap);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}
