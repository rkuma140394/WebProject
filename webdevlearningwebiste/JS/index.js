// ============================================
// JS FORGE - INDEX.JS
// Homepage: animated counters + mini quiz
// ============================================

// Animated Counters
(function() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString() + '+';
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      };
      update();
    });
  };

  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
})();

// Mini Quiz Logic
function checkAnswer(btn, isCorrect) {
  const allOptions = btn.parentElement.querySelectorAll('.quiz-option');
  allOptions.forEach(opt => opt.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    btn.textContent += ' ✅';
  } else {
    btn.classList.add('wrong');
    btn.textContent += ' ❌';
    allOptions.forEach(opt => {
      if (opt.onclick && opt.onclick.toString().includes('true')) {
        opt.classList.add('correct');
      }
    });
  }
}
