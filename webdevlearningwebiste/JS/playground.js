// ============================================
// JS FORGE - PLAYGROUND.JS
// Multi-language IDE with Monaco Editor + Pyodide Python
// ============================================

const defaultCode = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .card {
      background: rgba(255,255,255,0.1);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      text-align: center;
    }
    h1 { margin: 0 0 10px; }
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: white;
      color: #764ba2;
      font-weight: bold;
      cursor: pointer;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, HTML! 🎉</h1>
    <p>This runs live in the browser.</p>
    <button onclick="alert('You clicked me!')">Click Me</button>
  </div>
</body>
</html>`,

  css: `/* CSS Demo - Try changing colors! */
body {
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #0f0f23;
}

.demo-box {
  width: 300px;
  padding: 40px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  text-align: center;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
  transition: transform 0.3s;
}

.demo-box:hover {
  transform: scale(1.05) rotate(2deg);
}

h2 {
  margin: 0 0 12px;
  font-size: 1.8rem;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255,255,255,0.2);
  border-radius: 100px;
  font-size: 0.85rem;
}`,

  javascript: `// JavaScript Playground
const greeting = "Hello, devcraft! 🚀";
console.log(greeting);

// Array methods
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
console.log("Doubled:", doubled);

// Async demo
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Starting...");
  await delay(500);
  console.log("✅ Done after 500ms!");
}

run();`,

  python: `# Python in the Browser! 🐍
name = "Forge Developer"
print(f"Hello, {name}!")

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(f"Squares: {squares}")

# Dictionary
user = {"name": "Alice", "role": "Admin", "active": True}
for key, value in user.items():
    print(f"  {key}: {value}")

# Simple math
import math
print(f"Pi = {math.pi:.5f}")
print(f"Sqrt(16) = {math.sqrt(16)}")`,

  typescript: `// TypeScript Demo
interface User {
  name: string;
  age: number;
  isAdmin?: boolean;
}

const user: User = {
  name: "Alice",
  age: 30
};

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

console.log(greet(user));

// Generic function
function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<number>(42));
console.log(identity<string>("TS is awesome!"));`,

  json: `{
  "project": "devcraft",
  "version": "2.0",
  "features": [
    "Multi-language IDE",
    "Live Preview",
    "Python Runtime",
    "TypeScript Support"
  ],
  "config": {
    "theme": "dark",
    "autoSave": true,
    "fontSize": 14
  }
}`,

  markdown: `# Welcome to devcraft 🚀

## Features
- **Monaco Editor** - VS Code's editor in the browser
- **Multi-language** - HTML, CSS, JS, Python, TS, and more
- **Live Preview** - See HTML/CSS changes instantly
- **Python Runtime** - Real Python via WebAssembly

## Code Example
\`\`\`javascript
const forge = new JSForge();
forge.learn("everything");
\`\`\`

> "The best way to learn is to build."`,

  sql: `-- SQL Playground
-- Create tables
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@forge.dev'),
  ('Bob', 'bob@forge.dev'),
  ('Carol', 'carol@forge.dev');

-- Query
SELECT * FROM users WHERE name LIKE 'A%';

-- Join example
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;`
};

let editor = null;
let pyodide = null;
let currentLang = 'html';
let pyodideLoading = false;

const langSelect = document.getElementById('lang-select');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const clearCodeBtn = document.getElementById('clear-code-btn');
const resetBtn = document.getElementById('reset-btn');
const consoleOutput = document.getElementById('console-output');
const previewFrame = document.getElementById('preview-frame');
const pythonLoader = document.getElementById('python-loader');
const pyStatus = document.getElementById('py-status');
const tabs = document.querySelectorAll('.output-tab');

function initMonaco() {
  require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }});
  // Try loading Monaco; on failure fall back to a simple textarea editor
  require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: defaultCode.html,
      language: 'html',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 16 },
      lineNumbers: 'on',
      roundedSelection: true,
      renderLineHighlight: 'all',
      matchBrackets: 'always',
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });
    // Apply prefill from URL hash after Monaco is ready
    parseHashPrefill();
  }, (err) => {
    console.warn('Monaco failed to load, using fallback editor.', err);
    createTextareaEditor();
    parseHashPrefill();
  });
}

// Fallback simple textarea-based editor when Monaco fails to load
function createTextareaEditor() {
  const container = document.getElementById('monaco-editor');
  if (!container) return;
  container.innerHTML = '';
  const ta = document.createElement('textarea');
  ta.id = 'editor-fallback';
  ta.style.width = '100%';
  ta.style.height = '100%';
  ta.style.padding = '12px';
  ta.style.background = 'var(--bg-input)';
  ta.style.color = 'var(--text)';
  ta.style.border = 'none';
  ta.style.fontFamily = "'JetBrains Mono', monospace";
  ta.style.fontSize = '14px';
  ta.style.resize = 'none';
  ta.spellcheck = false;
  container.appendChild(ta);
  editor = {
    getValue: () => ta.value,
    setValue: (v) => { ta.value = v; },
    focus: () => { ta.focus(); },
  };
  // Keyboard shortcut for run
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  });
  // initialize with default code
  editor.setValue(defaultCode.html);
  editor.focus();
}

// Prefill editor from location.hash (e.g. #lang=javascript&code=...)
function parseHashPrefill() {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const lang = params.get('lang');
    const codeParam = params.get('code');
    if (!lang && !codeParam) return;

    const code = codeParam ? decodeURIComponent(codeParam) : null;
    const normalizedLang = lang ? String(lang).toLowerCase() : null;

    if (normalizedLang) {
      currentLang = normalizedLang;
      if (langSelect) langSelect.value = normalizedLang;
      if (editor) {
        try {
          const monacoLang = normalizedLang === 'python' ? 'python' : normalizedLang;
          monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
        } catch (e) {
          // ignore if monaco language isn't available
        }
        editor.setValue(code || defaultCode[normalizedLang] || '');
      }
      updateUIForLang(normalizedLang);
    } else if (code && editor) {
      editor.setValue(code);
    }
  } catch (err) {
    console.warn('Playground prefill failed:', err);
  }

}

langSelect.addEventListener('change', () => {
  const lang = langSelect.value;
  currentLang = lang;
  if (editor) {
    try {
      if (window.monaco && monaco.editor && typeof editor.getModel === 'function') {
        monaco.editor.setModelLanguage(editor.getModel(), lang === 'python' ? 'python' : lang);
      }
    } catch (e) {
      // ignore if Monaco isn't available or setModelLanguage fails
    }
    if (typeof editor.setValue === 'function') editor.setValue(defaultCode[lang] || '');
  }
  updateUIForLang(lang);
});

function updateUIForLang(lang) {
  const previewTab = tabs[1];
  if (lang === 'html' || lang === 'css') {
    previewTab.style.display = 'block';
    switchTab('preview');
  } else {
    previewTab.style.display = 'none';
    switchTab('console');
  }
  if (lang === 'python') {
    pyStatus.style.display = 'inline-block';
    if (!pyodide && !pyodideLoading) {
      loadPyodide();
    } else if (pyodide) {
      pyStatus.textContent = 'Python Ready';
      pyStatus.className = 'status-badge ready';
    }
  } else {
    pyStatus.style.display = 'none';
  }
  clearOutput();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
  });
});

function switchTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  if (tabName === 'console') {
    consoleOutput.style.display = 'block';
    previewFrame.style.display = 'none';
    pythonLoader.style.display = 'none';
  } else {
    consoleOutput.style.display = 'none';
    previewFrame.style.display = 'block';
    pythonLoader.style.display = 'none';
  }
}

runBtn.addEventListener('click', runCode);

function runCode() {
  const code = editor.getValue();
  clearOutput();
  switch (currentLang) {
    case 'html': runHTML(code); break;
    case 'css': runCSS(code); break;
    case 'javascript': runJavaScript(code); break;
    case 'python': runPython(code); break;
    case 'typescript': runTypeScript(code); break;
    case 'json': runJSON(code); break;
    case 'markdown': runMarkdown(code); break;
    case 'sql': runSQL(code); break;
  }
}

function runHTML(code) {
  switchTab('preview');
  const blob = new Blob([code], { type: 'text/html' });
  previewFrame.src = URL.createObjectURL(blob);
  log('✅ HTML rendered in preview', 'success');
}

function runCSS(code) {
  switchTab('preview');
  const html = `<!DOCTYPE html>
<html><head><style>${code}</style></head>
<body>
  <div class="demo-box">
    <h2>CSS Preview</h2>
    <span class="badge">Live Demo</span>
    <p>Edit the CSS code to see changes!</p>
  </div>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  previewFrame.src = URL.createObjectURL(blob);
  log('✅ CSS applied to preview', 'success');
}

function runJavaScript(code) {
  switchTab('console');
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push({ type: 'log', text: args.map(formatArg).join(' ') }),
    error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
    warn: (...args) => logs.push({ type: 'warn', text: args.join(' ') }),
    info: (...args) => logs.push({ type: 'info', text: args.join(' ') }),
  };
  try {
    const fn = new Function('console', code);
    fn(mockConsole);
    if (logs.length === 0) {
      log('✅ Code executed successfully (no output)', 'success');
    } else {
      logs.forEach(l => log(l.text, l.type));
    }
  } catch (err) {
    log(err.message, 'error');
  }
}

async function loadPyodide() {
  if (pyodideLoading || pyodide) return;
  pyodideLoading = true;
  pyStatus.textContent = 'Loading Python...';
  pyStatus.className = 'status-badge loading';
  try {
    pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
    pyStatus.textContent = 'Python Ready';
    pyStatus.className = 'status-badge ready';
    log('🐍 Python runtime loaded successfully!', 'success');
  } catch (err) {
    pyStatus.textContent = 'Python Failed';
    pyStatus.style.background = 'rgba(239,68,68,0.15)';
    pyStatus.style.color = 'var(--red)';
    log('Failed to load Python: ' + err.message, 'error');
  } finally {
    pyodideLoading = false;
  }
}

async function runPython(code) {
  switchTab('console');
  if (!pyodide) {
    if (!pyodideLoading) {
      await loadPyodide();
    } else {
      log('⏳ Python is still loading... please wait', 'warn');
      return;
    }
  }
  try {
    pyodide.setStdout({ batched: (text) => log(text, 'log') });
    pyodide.setStderr({ batched: (text) => log(text, 'error') });
    await pyodide.runPythonAsync(code);
    log('✅ Python execution complete', 'success');
  } catch (err) {
    log(err.message, 'error');
  }
}

function runTypeScript(code) {
  switchTab('console');
  log('⚠️ TypeScript is shown with syntax highlighting. Execution transpiles to JS.', 'warn');
  const jsCode = code
    .replace(/:\s*(string|number|boolean|any|void)/g, '')
    .replace(/:\s*\w+(\[\])?/g, '')
    .replace(/interface\s+\w+\s*\{[^}]+\}/g, '')
    .replace(/<\w+(,\s*\w+)*>/g, '');
  try {
    const fn = new Function('console', jsCode);
    const logs = [];
    const mockConsole = {
      log: (...args) => logs.push({ type: 'log', text: args.map(formatArg).join(' ') }),
      error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
    };
    fn(mockConsole);
    logs.forEach(l => log(l.text, l.type));
    log('✅ TypeScript (transpiled) executed', 'success');
  } catch (err) {
    log(err.message, 'error');
  }
}

function runJSON(code) {
  switchTab('console');
  try {
    const parsed = JSON.parse(code);
    log(JSON.stringify(parsed, null, 2), 'info');
    log('✅ Valid JSON', 'success');
  } catch (err) {
    log('Invalid JSON: ' + err.message, 'error');
  }
}

function runMarkdown(code) {
  switchTab('console');
  log('📝 Markdown Preview:', 'info');
  log('Markdown renders as formatted text. This is a syntax-highlighting mode.', 'warn');
  log(code, 'log');
}

function runSQL(code) {
  switchTab('console');
  log('🗄️ SQL Preview:', 'info');
  log('SQL syntax highlighting active. Connect to a database to execute queries.', 'warn');
  log('\nYour query:\n' + code, 'log');
}

function log(text, type) {
  const pre = document.createElement('pre');
  pre.className = type;
  pre.textContent = text;
  const placeholder = consoleOutput.querySelector('.placeholder');
  if (placeholder) placeholder.remove();
  consoleOutput.appendChild(pre);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearOutput() {
  consoleOutput.innerHTML = '<pre class="placeholder">// Output will appear here...</pre>';
  if (previewFrame) previewFrame.src = 'about:blank';
}

function formatArg(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return `"${arg}"`;
  if (typeof arg === 'object') return JSON.stringify(arg);
  if (typeof arg === 'symbol') return arg.toString();
  if (typeof arg === 'bigint') return arg.toString() + 'n';
  return String(arg);
}

clearBtn.addEventListener('click', clearOutput);

clearCodeBtn.addEventListener('click', () => {
  if (editor) {
    editor.setValue('');
    editor.focus();
  }
  clearOutput();
});

resetBtn.addEventListener('click', () => {
  if (editor) {
    editor.setValue(defaultCode[currentLang] || '');
  }
  clearOutput();
});

initMonaco();
updateUIForLang('html');
