// ============================================
// JS FORGE — APP.JS
// Theme toggle, utilities, smooth scroll, nav active state
// ============================================

// ============================================
// THEME SYSTEM
// ============================================
const Theme = {
  init() {
    const saved = localStorage.getItem('jsforge_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'dark');
    this.apply(initialTheme);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('jsforge_theme')) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateButtonIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem('jsforge_theme', next);
  },

  updateButtonIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
};

Theme.init();

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => Theme.toggle());
  }
});

// ============================================
// UTILITIES
// ============================================
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function safeStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '[Circular Object]';
  }
}

function formatArg(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return `"${arg}"`;
  if (typeof arg === 'object') return safeStringify(arg);
  if (typeof arg === 'symbol') return arg.toString();
  if (typeof arg === 'bigint') return arg.toString() + 'n';
  return String(arg);
}

// ============================================
// NAVIGATION
// ============================================
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
})();

console.log('%c devcraft ', 'background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;');
console.log('%c Built for hackathon glory 🚀 ', 'color: #a78bfa; font-style: italic;');