import { CheatManager } from './cheat-module.js';

const SYMBOLS = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎', '7️⃣'];
const SPIN_DURATION = 1000;

class SlotMachine {
  constructor() {
    this.reels = [...document.querySelectorAll('.reel')];
    this.spinButton = document.getElementById('spin');
    this.message = document.getElementById('message');
    this.cheatZone = document.getElementById('cheat-zone');
    this.cheatMode = false;
    this.isSpinning = false;
    this.secretCode = [];
    this.winningSequence = [];
    
    this.cheatManager = new CheatManager(
      ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
      () => this.activateCheatMode()
    );
    
    this.setupLightEffects();
    this.init();
  }

  setupLightEffects() {
    const lightEffects = document.createElement('div');
    lightEffects.className = 'light-effects';
    lightEffects.setAttribute('aria-hidden', 'true');
    
    for (let i = 0; i < 6; i++) {
      const beam = document.createElement('div');
      beam.className = 'light-beam';
      beam.style.transform = `rotate(${i * 60}deg)`;
      lightEffects.appendChild(beam);
    }
    
    document.getElementById('slot-machine').appendChild(lightEffects);
    this.lightEffects = lightEffects;
  }

  init() {
    try {
      this.spinButton.addEventListener('click', () => {
        if (!this.isSpinning) this.spinReels();
      });
      
      document.addEventListener('keydown', (e) => {
        this.cheatManager.register(e.key);
      });
      
      this.setupSymbolAnimations();
    } catch (error) {
      console.error('Slot machine initialization error:', error);
    }
  }

  activateCheatMode() {
    this.cheatMode = true;
    this.createCheatOverlay();
    this.winningSequence = new Array(this.reels.length).fill(SYMBOLS[0]);
  }

  createCheatOverlay() {
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 215, 0, 0.05);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
    `;

    document.body.appendChild(flashOverlay);
    
    requestAnimationFrame(() => {
      flashOverlay.style.opacity = '1';
      setTimeout(() => {
        flashOverlay.style.opacity = '0';
        setTimeout(() => flashOverlay.remove(), 500);
      }, 200);
    });
  }

  async spinReels() {
    try {
      this.message.textContent = '';
      this.message.className = '';
      this.spinButton.disabled = true;
      this.isSpinning = true;
          
      const spins = this.reels.map((reel, index) => 
        this.animateReel(reel, index * 300)
      );

      await Promise.all(spins);
      this.checkResult();
    } catch (error) {
      console.error('Spin error:', error);
    } finally {
      this.spinButton.disabled = false;
      this.isSpinning = false;
    }
  }

  animateReel(reel, delay) {
    return new Promise(resolve => {
      reel.classList.add('spinning');
      reel.style.filter = 'blur(2px)';
      
      setTimeout(() => {
        requestAnimationFrame(() => {
          const symbol = this.getReelSymbol(this.reels.indexOf(reel));
          reel.textContent = symbol;
          reel.classList.remove('spinning');
          reel.style.filter = '';
          resolve(symbol);
        });
      }, SPIN_DURATION + delay);
    });
  }

  checkResult() {
    const combination = this.reels.map(reel => reel.textContent);
    const isJackpot = combination.every((val, i, arr) => val === arr[0]);
    
    if (isJackpot) {
      this.showJackpotAnimation();
    } else {
      this.message.textContent = 'Essayez encore !';
    }
    
    this.cheatMode = false;
    this.winningSequence = [];
  }
  
  showJackpotAnimation() {
    this.message.textContent = '🎉 JACKPOT ! 🎉';
    this.message.className = 'jackpot-win';
    this.message.setAttribute('aria-live', 'polite');
    
    this.lightEffects.style.opacity = '1';
    
    const animate = () => {
      this.message.style.transform = `scale(${1 + Math.sin(Date.now() / 200) * 0.05})`;
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    
    setTimeout(() => {
      this.lightEffects.style.opacity = '0';
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new SlotMachine());