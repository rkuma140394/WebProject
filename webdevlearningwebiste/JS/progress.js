// ============================================
// JS FORGE / DEVCRAFT - PROGRESS.JS
// Learning path progress tracking via localStorage
// ============================================

const Progress = {
  lessons: [
    { id: 'playground', title: 'Playground', completed: false, icon: '🖥️' },
    { id: 'visualizer', title: 'Type Visualizer', completed: false, icon: '🔍' },
    { id: 'bitwise', title: 'Bitwise Lab', completed: false, icon: '🔲' },
    { id: 'quiz', title: 'Final Challenge', completed: false, icon: '🏆' },
    // JavaScript Learning Path
    { id: 'why-js', title: 'Why JavaScript Exists', completed: false, icon: '⚡' },
    { id: 'vars-scope', title: 'Variables & Scope', completed: false, icon: '📦' },
    { id: 'types', title: 'Data Types', completed: false, icon: '🔍' },
    { id: 'operators', title: 'Operators', completed: false, icon: '➕' },
    { id: 'control-flow', title: 'Control Flow', completed: false, icon: '🔁' },
    { id: 'numbers-math', title: 'Numbers & Math', completed: false, icon: '🔢' },
    { id: 'strings', title: 'Strings', completed: false, icon: '📝' },
    { id: 'conversion', title: 'Type Conversion', completed: false, icon: '♻️' },
    { id: 'comparison', title: 'Comparison Deep Dive', completed: false, icon: '⚖️' },
    { id: 'quick-ref', title: 'Quick Reference', completed: false, icon: '📋' }
  ],

  init() {
    const saved = localStorage.getItem('jsforge_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach((item) => {
          const lesson = this.lessons.find(l => l.id === item.id);
          if (lesson) lesson.completed = item.completed;
        });
      } catch(e) {}
    }
    this.render();
    this.markCurrentPageVisited();
  },

  complete(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.completed = true;
      this.save();
      this.render();
    }
  },

  isCompleted(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    return lesson ? lesson.completed : false;
  },

  isLessonComplete(lessonId) {
    return this.isCompleted(lessonId);
  },

  markLessonComplete(lessonId) {
    this.complete(lessonId);
  },

  save() {
    localStorage.setItem('jsforge_progress', JSON.stringify(this.lessons));
  },

  render() {
    const container = document.getElementById('progress-path');
    if (!container) return;

    container.innerHTML = this.lessons.map((l, i) => `
      <div class="lesson-node ${l.completed ? 'completed' : ''} ${i === this.getNextIndex() ? 'active' : ''}">
        <div class="node-icon">${l.completed ? '✓' : l.icon}</div>
        <div class="node-title">${l.title}</div>
      </div>
      ${i < this.lessons.length - 1 ? '<div class="connector"></div>' : ''}
    `).join('');
  },

  getNextIndex() {
    return this.lessons.findIndex(l => !l.completed);
  },

  reset() {
    this.lessons.forEach(l => l.completed = false);
    this.save();
    this.render();
  },

  markCurrentPageVisited() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    const map = {
      'playground': 'playground',
      'visualizer': 'visualizer',
      'bitwise': 'bitwise',
      'quiz': 'quiz',
      'javascript': 'why-js'
    };
    if (map[page]) {
      // this.complete(map[page]);
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Progress.init());
} else {
  Progress.init();
}
