// ============================================
// JS FORGE - BITWISE.JS
// Interactive bitwise calculator with visual bit representation
// ============================================

class BitwiseLab {
  constructor() {
    this.aInput = document.getElementById('bit-a');
    this.bInput = document.getElementById('bit-b');
    this.opSelect = document.getElementById('operator');

    if (!this.aInput) return;

    [this.aInput, this.bInput, this.opSelect].forEach(el => {
      el.addEventListener('input', () => this.update());
    });

    this.update();
  }

  toBinary(num, bits = 8) {
    return ((num >>> 0) & 0xFF).toString(2).padStart(bits, '0');
  }

  renderBits(binaryStr, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = binaryStr.split('').map(bit =>
      `<span class="bit ${bit === '1' ? 'active' : ''}">${bit}</span>`
    ).join('');
  }

  update() {
    const a = parseInt(this.aInput.value) || 0;
    const b = parseInt(this.bInput.value) || 0;
    const op = this.opSelect.value;

    let result;
    switch(op) {
      case '&': result = (a & b) & 0xFF; break;
      case '|': result = (a | b) & 0xFF; break;
      case '^': result = (a ^ b) & 0xFF; break;
      case '<<': result = (a << b) & 0xFF; break;
      case '>>': result = (a >> b) & 0xFF; break;
      case '>>>': result = (a >>> b) & 0xFF; break;
      default: result = 0;
    }

    const aBin = this.toBinary(a);
    const bBin = this.toBinary(b);
    const resBin = this.toBinary(result);

    this.renderBits(aBin, 'bits-a');
    this.renderBits(bBin, 'bits-b');
    this.renderBits(resBin, 'bits-result');

    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const decResult = document.getElementById('decimal-result');
    const binResult = document.getElementById('binary-result');

    if (labelA) labelA.textContent = `A = ${a}`;
    if (labelB) labelB.textContent = `B = ${b}`;
    if (decResult) decResult.textContent = `${a} ${op} ${b} = ${result}`;
    if (binResult) binResult.textContent = `0b${resBin}`;

    // Trigger animation
    const resEl = document.getElementById('bits-result');
    if (resEl) {
      resEl.style.animation = 'none';
      resEl.offsetHeight;
      resEl.style.animation = 'pulse 0.4s ease';
    }
  }
}

new BitwiseLab();