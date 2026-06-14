// ============================================
// JAVASCRIPT CURRICULUM PAGE — INTERACTIVITY
// Copy buttons, Mark Complete, Scroll Spy, Progress
// ============================================

const Curriculum = {
  sections: [
    'why-js', 'vars-scope', 'types', 'operators',
    'control-flow', 'numbers-math', 'strings',
    'conversion', 'comparison', 'quick-ref', 'projects'
  ],

  init() {
    this.initCopyButtons();
    this.initMarkComplete();
    this.initScrollSpy();
    this.updateProgress();
    this.loadCompletedState();
  },

  // --- Copy Buttons (both .code-copy-btn and .js-copy-btn) ---
  initCopyButtons() {
    // Handle .code-copy-btn buttons (in code headers)
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleCopy(btn));
    });

    // Handle .js-copy-btn buttons (in code actions)
    document.querySelectorAll('.js-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleCopy(btn));
    });
  },

  handleCopy(btn) {
    const code = btn.getAttribute('data-copy');
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      const original = btn.innerHTML;
      const originalText = btn.textContent;

      // Show copied feedback
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
      btn.style.color = 'var(--green)';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.color = '';
      }, 2000);
    }).catch(() => {
      // Fallback: select and copy
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  },

  // --- Mark Complete ---
  initMarkComplete() {
    document.querySelectorAll('.mark-complete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        const isCompleted = btn.classList.contains('completed');

        if (isCompleted) {
          this.unmarkComplete(section, btn);
        } else {
          this.markComplete(section, btn);
        }
      });
    });
  },

  markComplete(section, btn) {
    btn.classList.add('completed');
    btn.querySelector('.complete-text').textContent = 'Completed';

    const card = document.querySelector(`[data-section="${section}"]`);
    if (card) card.classList.add('completed');

    // Update sidebar nav
    const navLink = document.querySelector(`.sidebar-nav a[data-nav="${section}"]`);
    if (navLink) {
      navLink.classList.add('completed');
      navLink.querySelector('.nav-check').textContent = '✓';
    }

    // Save to localStorage
    const completed = this.getCompleted();
    if (!completed.includes(section)) {
      completed.push(section);
      localStorage.setItem('jsforge_js_curriculum', JSON.stringify(completed));
    }

    this.updateProgress();
    this.celebrate(btn);
  },

  unmarkComplete(section, btn) {
    btn.classList.remove('completed');
    btn.querySelector('.complete-text').textContent = 'Mark Complete';

    const card = document.querySelector(`[data-section="${section}"]`);
    if (card) card.classList.remove('completed');

    const navLink = document.querySelector(`.sidebar-nav a[data-nav="${section}"]`);
    if (navLink) {
      navLink.classList.remove('completed');
      navLink.querySelector('.nav-check').textContent = '○';
    }

    const completed = this.getCompleted().filter(s => s !== section);
    localStorage.setItem('jsforge_js_curriculum', JSON.stringify(completed));
    this.updateProgress();
  },

  getCompleted() {
    try {
      return JSON.parse(localStorage.getItem('jsforge_js_curriculum')) || [];
    } catch {
      return [];
    }
  },

  loadCompletedState() {
    const completed = this.getCompleted();
    completed.forEach(section => {
      const btn = document.querySelector(`.mark-complete-btn[data-section="${section}"]`);
      const card = document.querySelector(`[data-section="${section}"]`);
      const navLink = document.querySelector(`.sidebar-nav a[data-nav="${section}"]`);

      if (btn) {
        btn.classList.add('completed');
        btn.querySelector('.complete-text').textContent = 'Completed';
      }
      if (card) card.classList.add('completed');
      if (navLink) {
        navLink.classList.add('completed');
        navLink.querySelector('.nav-check').textContent = '✓';
      }
    });
  },

  // --- Progress ---
  updateProgress() {
    const completed = this.getCompleted().length;
    const total = this.sections.length;
    const percent = Math.round((completed / total) * 100);

    const topFill = document.getElementById('curriculum-progress-fill');
    const topText = document.getElementById('progress-text');
    const topFraction = document.getElementById('progress-fraction');
    const sideFill = document.getElementById('sidebar-progress-fill');
    const sideText = document.getElementById('sidebar-progress-text');

    if (topFill) topFill.style.width = percent + '%';
    if (topText) topText.textContent = percent + '% Complete';
    if (topFraction) topFraction.textContent = completed + ' / ' + total + ' sections';
    if (sideFill) sideFill.style.width = percent + '%';
    if (sideText) sideText.textContent = percent + '% complete';
  },

  // --- Scroll Spy ---
  initScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.getAttribute('data-section');
          this.setActiveNav(section);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    document.querySelectorAll('.lesson-card').forEach(card => {
      observer.observe(card);
    });
  },

  setActiveNav(section) {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      link.classList.remove('active');
    });
    const active = document.querySelector(`.sidebar-nav a[data-nav="${section}"]`);
    if (active) active.classList.add('active');
  },

  // --- Celebration ---
  celebrate(btn) {
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 200);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Curriculum.init();
});
