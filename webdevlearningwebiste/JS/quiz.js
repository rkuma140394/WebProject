// ============================================
// JS FORGE - QUIZ.JS
// Interactive quiz engine with scoring and progress tracking
// ============================================

const allQuizData = [
  {
    question: 'What is the output of typeof null?',
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    correct: 2,
    explanation: 'This is a historical bug in JavaScript. typeof null returns "object".'
  },
  {
    question: 'Which of these is NOT a primitive type?',
    options: ['String', 'Array', 'Boolean', 'Symbol'],
    correct: 1,
    explanation: 'Array is a reference type (object). Primitives are string, number, boolean, null, undefined, symbol, bigint.'
  },
  {
    question: 'What does 5 & 3 evaluate to?',
    options: ['8', '7', '1', '15'],
    correct: 2,
    explanation: '5 is 101, 3 is 011. AND gives 001 which is 1.'
  },
  {
    question: 'What is the result of [] + []?',
    options: ['[]', '""', 'undefined', 'Error'],
    correct: 1,
    explanation: 'Arrays are converted to strings. [] becomes "", so "" + "" = "".'
  },
  {
    question: 'What does ~~5.7 do?',
    options: ['Rounds to 6', 'Floors to 5', 'Truncates to 5', 'Returns NaN'],
    correct: 2,
    explanation: 'Double bitwise NOT truncates toward zero (like Math.trunc), so 5.7 becomes 5.'
  },
  {
    question: 'What is 0.1 + 0.2 === 0.3?',
    options: ['true', 'false', 'undefined', 'Error'],
    correct: 1,
    explanation: 'Due to floating-point precision, 0.1 + 0.2 is 0.30000000000000004.'
  },
  {
    question: 'What does typeof NaN return?',
    options: ['"NaN"', '"undefined"', '"number"', '"error"'],
    correct: 2,
    explanation: 'NaN is technically a number value in IEEE 754, so typeof NaN is "number".'
  },
  {
    question: 'What is the output of 1 < 2 < 3?',
    options: ['true', 'false', 'Error', 'undefined'],
    correct: 0,
    explanation: '(1 < 2) is true, then true < 3 becomes 1 < 3 which is true.'
  },
  {
    question: 'What is the output of 3 > 2 > 1?',
    options: ['true', 'false', 'Error', '1'],
    correct: 1,
    explanation: '(3 > 2) is true, then true > 1 becomes 1 > 1 which is false.'
  },
  {
    question: 'How do you reliably check if a variable is an array?',
    options: ['typeof arr === "array"', 'arr instanceof Array', 'Array.isArray(arr)', 'arr.constructor === Array'],
    correct: 2,
    explanation: 'Array.isArray() is the most reliable method across all contexts.'
  }
];

// Select daily questions from the master list (UTC-based rotation)
function getDailyQuestions(count = 1) {
  const now = new Date();
  // Use UTC days so the daily question is the same worldwide
  const utcDays = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  const start = utcDays % allQuizData.length;
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(allQuizData[(start + i) % allQuizData.length]);
  }
  return out;
}

// Default: up to 10 questions per UTC day (or fewer if the master list is smaller)
const quizData = getDailyQuestions(Math.min(10, allQuizData.length));

class QuizEngine {
  constructor() {
    this.current = 0;
    this.score = 0;
    this.questionArea = document.getElementById('question-area');
    this.feedbackArea = document.getElementById('feedback-area');
    this.resultsArea = document.getElementById('results-area');
    this.counter = document.getElementById('question-counter');
    this.scoreDisplay = document.getElementById('score-display');

    if (this.questionArea) {
      this.loadQuestion();
    }
  }

  loadQuestion() {
    const q = quizData[this.current];

    this.counter.textContent = `Question ${this.current + 1} / ${quizData.length}`;
    this.scoreDisplay.textContent = `Score: ${this.score}`;

    document.getElementById('question-text').textContent = q.question;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.selectAnswer(idx));
      container.appendChild(btn);
    });

    this.questionArea.classList.remove('hidden');
    this.feedbackArea.classList.add('hidden');
  }

  selectAnswer(index) {
    const q = quizData[this.current];
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) btn.classList.add('correct');
      else if (idx === index && idx !== q.correct) btn.classList.add('wrong');
    });

    const isCorrect = index === q.correct;
    if (isCorrect) this.score++;

    setTimeout(() => this.showFeedback(isCorrect, q.explanation), 400);
  }

  showFeedback(isCorrect, explanation) {
    this.questionArea.classList.add('hidden');
    this.feedbackArea.classList.remove('hidden');

    const icon = document.getElementById('feedback-icon');
    const text = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('next-btn');

    icon.textContent = isCorrect ? '✅' : '❌';
    text.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong><br><span style="color: var(--text-secondary);">${explanation}</span>`;

    nextBtn.onclick = () => {
      this.current++;
      if (this.current < quizData.length) {
        this.loadQuestion();
      } else {
        this.showResults();
      }
    };
  }

  showResults() {
    this.feedbackArea.classList.add('hidden');
    this.resultsArea.classList.remove('hidden');

    const percentage = Math.round((this.score / quizData.length) * 100);
    let message = '';
    if (percentage === 100) message = 'Perfect score! You are a JS master! 🔥';
    else if (percentage >= 80) message = 'Great job! Almost there! 💪';
    else if (percentage >= 60) message = 'Good effort! Keep practicing! 📚';
    else message = 'Keep learning! Review the lessons and try again! 🌱';

    document.getElementById('final-score').innerHTML = `
      <div style="font-size: 3rem; font-weight: 700; color: var(--accent); margin-bottom: 10px;">${this.score} / ${quizData.length}</div>
      <div style="color: var(--text-secondary); margin-bottom: 20px;">${percentage}% — ${message}</div>
    `;

    // Mark quiz as complete in progress
    if (typeof Progress !== 'undefined') {
      Progress.complete('quiz');
    }
  }
}

new QuizEngine();