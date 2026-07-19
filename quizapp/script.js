const questions = [
  {
    question: "Which is the largest animal in the world?",
    answers: [
      { text: "Shark", correct: false },
      { text: "Blue whale", correct: true },
      { text: "Elephant", correct: false },
      { text: "Giraffe", correct: false }
    ]
  },
  {
    question: "Which is the smallest country in the world?",
    answers: [
      { text: "Vatican City", correct: true },
      { text: "Bhutan", correct: false },
      { text: "Nepal", correct: false },
      { text: "Sri Lanka", correct: false }
    ]
  },
  {
    question: "Which is the largest desert in the world?",
    answers: [
      { text: "Kalahari", correct: false },
      { text: "Gobi", correct: false },
      { text: "Sahara", correct: false },
      { text: "Antarctica", correct: true }
    ]
  },
  {
    question: "Which is the smallest continent in the world?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Australia", correct: true },
      { text: "Arctic", correct: false },
      { text: "Africa", correct: false }
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreBadge = document.getElementById("score-badge");
const progressText = document.getElementById("progress-text");
const statusText = document.getElementById("status-text");
const progressFill = document.getElementById("progress-fill");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1;

  questionElement.textContent = `${questionNo}. ${currentQuestion.question}`;
  updateProgress();
  statusText.textContent = "Pick the best answer";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    if (answer.correct) {
      button.dataset.correct = "true";
    }

    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answered = false;
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function updateProgress() {
  const progressPercent = (currentQuestionIndex / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `Question ${Math.min(currentQuestionIndex + 1, questions.length)} of ${questions.length}`;
  scoreBadge.textContent = `Score: ${score}`;
}

function selectAnswer(e) {
  if (answered) return;

  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  answered = true;

  selectedBtn.classList.add("selected");

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
    statusText.textContent = "Correct!";
  } else {
    selectedBtn.classList.add("incorrect");
    statusText.textContent = "Not quite";
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
  nextButton.innerHTML = currentQuestionIndex === questions.length - 1 ? "See Results" : "Next";
  updateProgress();
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!`;

  const resultMessage = score === questions.length
    ? "Perfect score! You know your facts."
    : score >= questions.length / 2
      ? "Nice work! You are doing great."
      : "Keep practicing — you are getting there!";

  const resultCard = document.createElement("div");
  resultCard.className = "result-card";
  resultCard.innerHTML = `<strong>${resultMessage}</strong><br />Try another round to sharpen your knowledge.`;
  answerButtons.appendChild(resultCard);

  progressFill.style.width = "100%";
  progressText.textContent = "Quiz complete";
  statusText.textContent = score === questions.length ? "Perfect score!" : score >= questions.length / 2 ? "Great job!" : "Nice try!";
  scoreBadge.textContent = `Score: ${score}`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  if (nextButton.innerHTML === "Play Again") {
    startQuiz();
  } else if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showScore();
  }
});

startQuiz();