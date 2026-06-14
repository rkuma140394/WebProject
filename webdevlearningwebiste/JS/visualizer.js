// ============================================
// JS FORGE - VISUALIZER.JS
// Data type analysis and visualization
// ============================================

class TypeVisualizer {
  static analyze(valueStr) {
    let parsed;
    try {
      parsed = new Function('return ' + valueStr)();
    } catch {
      return { error: 'Invalid JavaScript expression' };
    }

    const type = parsed === null ? 'null' : typeof parsed;
    return {
      value: parsed,
      type,
      displayType: type === 'null' ? 'null' : typeof parsed,
      isPrimitive: !['object', 'function'].includes(typeof parsed) || parsed === null,
      isMutable: typeof parsed === 'object' && parsed !== null
    };
  }

  static render(valueStr) {
    const container = document.getElementById('type-display');
    const analysis = this.analyze(valueStr);

    if (analysis.error) {
      container.innerHTML = `<div class="placeholder-center" style="color: var(--error)">${analysis.error}</div>`;
      return;
    }

    const colors = {
      string: '#22c55e',
      number: '#3b82f6',
      boolean: '#ec4899',
      undefined: '#6b7280',
      null: '#6b7280',
      object: '#f59e0b',
      function: '#8b5cf6',
      symbol: '#06b6d4',
      bigint: '#f97316'
    };

    const color = colors[analysis.displayType] || '#9ca3af';

    let visual = '';
    if (analysis.type === 'string') {
      visual = this.renderString(analysis.value);
    } else if (analysis.type === 'number') {
      visual = this.renderNumber(analysis.value);
    } else if (analysis.type === 'boolean') {
      visual = this.renderBoolean(analysis.value);
    } else if (analysis.type === 'null') {
      visual = `<div style="padding: 20px; text-align: center; color: var(--text-muted)">null — intentional absence of value</div>`;
    } else if (analysis.type === 'undefined') {
      visual = `<div style="padding: 20px; text-align: center; color: var(--text-muted)">undefined — variable declared but not assigned</div>`;
    } else if (typeof analysis.value === 'object') {
      visual = this.renderObject(analysis.value);
    } else if (typeof analysis.value === 'function') {
      visual = `<pre style="font-size: 0.85rem; overflow-x: auto;">${analysis.value.toString().slice(0, 200)}...</pre>`;
    } else if (analysis.type === 'bigint') {
      visual = `<div style="font-family: var(--font-mono); font-size: 1.2rem;">${analysis.value.toString()}n</div>`;
    } else if (analysis.type === 'symbol') {
      visual = `<div style="font-family: var(--font-mono);">${analysis.value.toString()}</div>`;
    }

    container.innerHTML = `
      <div class="type-badge" style="background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
        ${analysis.displayType}
      </div>
      <div class="memory-representation">${visual}</div>
      <div class="type-info">
        <div><strong>Primitive:</strong> ${analysis.isPrimitive ? 'Yes' : 'No'}</div>
        <div><strong>Mutable:</strong> ${analysis.isMutable ? 'Yes' : 'No'}</div>
        <div><strong>String Value:</strong> ${String(analysis.value)}</div>
        <div><strong>Constructor:</strong> ${analysis.value?.constructor?.name || 'N/A'}</div>
      </div>
    `;
  }

  static renderString(str) {
    return `
      <div style="margin-bottom: 8px; color: var(--text-muted); font-size: 0.85rem;">Length: ${str.length} characters</div>
      <div>${str.split('').map((c, i) =>
        `<div class="char-cell" title="Index ${i}: '${c}' (code: ${c.charCodeAt(0)})">${c}</div>`
      ).join('')}</div>
    `;
  }

  static renderNumber(num) {
    const isInteger = Number.isInteger(num);
    const binary = Math.abs(num).toString(2).padStart(32, '0');
    const groups = binary.match(/.{1,8}/g).join(' ');

    return `
      <div style="display: grid; gap: 12px;">
        <div style="font-size: 1.5rem; font-weight: 700;">${num}</div>
        <div>
          <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px;">32-bit Binary (IEEE 754 truncated)</div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 2px;">${groups}</div>
        </div>
        <div>
          <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px;">Hexadecimal</div>
          <div style="font-family: var(--font-mono);">0x${Math.abs(num).toString(16).toUpperCase()}</div>
        </div>
        <div>
          <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px;">Properties</div>
          <div>Integer: ${isInteger} | Safe: ${Number.isSafeInteger(num)} | Finite: ${Number.isFinite(num)}</div>
        </div>
      </div>
    `;
  }

  static renderBoolean(val) {
    return `
      <div style="display: flex; justify-content: center; gap: 20px; padding: 20px;">
        <div style="padding: 20px 40px; border-radius: 12px; background: ${val ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)'}; border: 2px solid ${val ? 'var(--green)' : 'var(--text-muted)'};">
          <div style="font-size: 2rem; font-weight: 700; color: ${val ? 'var(--green)' : 'var(--text-muted)'};">${val}</div>
        </div>
      </div>
    `;
  }

  static renderObject(obj) {
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return `<div style="color: var(--text-muted);">Empty Object {}</div>`;
    }
    return `
      <div style="display: grid; gap: 8px;">
        ${entries.map(([k, v]) => `
          <div style="display: flex; gap: 12px; align-items: center; padding: 8px; background: var(--bg-primary); border-radius: 6px;">
            <span style="color: var(--accent); font-weight: 600;">${k}:</span>
            <span style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.9rem;">${this.formatValue(v)}</span>
            <span style="margin-left: auto; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${typeof v}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  static formatValue(v) {
    if (v === null) return 'null';
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'object') return '{...}';
    return String(v);
  }
}

// Initialize
const vizBtn = document.getElementById('visualize-btn');
const vizInput = document.getElementById('type-input');

if (vizBtn && vizInput) {
  vizBtn.addEventListener('click', () => TypeVisualizer.render(vizInput.value));
  vizInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') TypeVisualizer.render(vizInput.value);
  });
  // Auto-visualize on load
  TypeVisualizer.render(vizInput.value);
}