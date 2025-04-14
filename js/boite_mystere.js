import { CheatManager } from './cheat-module.js';

class MysteryBox {
  constructor() {
    this.box = document.getElementById('mystery-box');
    this.counter = document.getElementById('click-count');
    this.result = document.getElementById('open-result');
    this.state = { 
      clicks: 0, 
      isOpened: false, 
      cheatEnabled: false,
      activeAnimations: new Set()
    };

    this.cheatManager = new CheatManager(
      ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
      () => this.activateCheat()
    );

    this.init();
  }

  init() {
    try {
      this.box.addEventListener('click', () => this.handleClick());
      this.box.addEventListener('dblclick', () => this.handleDoubleClick());
      this.box.addEventListener('contextmenu', (e) => this.handleRightClick(e));
      document.addEventListener('keydown', (e) => this.cheatManager.register(e.key));
      this.initSecretCorner();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  initSecretCorner() {
    const secretCorner = document.createElement('div');
    secretCorner.className = 'secret-corner';
    secretCorner.setAttribute('aria-hidden', 'true');
    document.body.appendChild(secretCorner);
    
    secretCorner.addEventListener('click', () => {
      this.state.cheatEnabled = true;
      this.createFlashEffect();
    });
  }

  createFlashEffect() {
    const flashEffect = document.createElement('div');
    flashEffect.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 9998;
      pointer-events: none;
      animation: flash-fade 150ms ease-out;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes flash-fade {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;

    document.body.appendChild(style);
    document.body.appendChild(flashEffect);
    
    requestAnimationFrame(() => {
      flashEffect.style.opacity = '0';
      setTimeout(() => {
        flashEffect.remove();
        style.remove();
      }, 200);
    });
  }

  handleClick() {
    if (this.state.isOpened) return;
    this.updateCounter();
    this.animateBoxPress();
  }

  animateBoxPress() {
    this.box.style.transform = 'scale(0.95)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!this.state.isOpened) {
          this.box.style.transform = '';
        }
      }, 150);
    });
  }

  updateCounter() {
    this.state.clicks = Math.min(this.state.clicks + 1, 999);
    this.counter.textContent = `Clics : ${this.state.clicks}`;
    this.counter.style.transform = 'scale(1.1)';
    setTimeout(() => this.counter.style.transform = '', 200);
  }

  openBox(isDoubleClick) {
    if (this.state.cheatEnabled && !isDoubleClick) {
      isDoubleClick = true;
      this.state.cheatEnabled = false;
    }
    
    this.state.isOpened = true;
    this.box.classList.add('open');
    
    if (isDoubleClick) {
      this.showWinResult();
    } else {
      this.showLoseResult();
    }
  }

  showWinResult() {
    this.result.textContent = '🎉 Boîte gagnante !';
    this.result.style.color = '#4eff4e';
    this.result.style.textShadow = '0 0 10px rgba(78, 255, 78, 0.7)';
    this.spawnConfetti();
  }

  showLoseResult() {
    this.result.textContent = '💥 Boîte perdante !';
    this.result.style.color = '#ff6347';
    this.result.style.textShadow = '0 0 10px rgba(255, 99, 71, 0.7)';
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
  }

  spawnConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];
    const confettiCount = this.state.cheatEnabled ? 100 : 30;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    
    const spawn = (count) => {
      if (count >= confettiCount) return;

      requestAnimationFrame(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
          left: ${Math.random() * 100}vw;
          top: ${Math.random() * -20}vh;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          animation-delay: ${Math.random() * 1}s;
          animation-duration: ${1 + Math.random() * 2}s;
          width: ${5 + Math.random() * 10}px;
          height: ${5 + Math.random() * 10}px;
        `;
        container.appendChild(confetti);
        spawn(count + 1);
      });
    };

    document.body.appendChild(container);
    spawn(0);
    
    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  activateCheat() {
    document.body.classList.add('hue-rotate');
    setTimeout(() => document.body.classList.remove('hue-rotate'), 300);
    this.state.cheatEnabled = true;
  }
}

document.addEventListener('DOMContentLoaded', () => new MysteryBox());