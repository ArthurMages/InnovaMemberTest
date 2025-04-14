class RussianRoulette {
    constructor() {
      this.chamber = document.getElementById('chamber');
      this.trigger = document.getElementById('trigger');
      this.bulletCount = document.getElementById('bullets');
      this.result = document.getElementById('result');
      
      this.chambers = 6;
      this.bullets = 1;
      this.bulletPosition = Math.floor(Math.random() * this.chambers);
      this.currentChamber = 0;
      this.cheatActive = false;
      this.isAnimating = false;
      
      this.init();
    }
  
    init() {
      try {
        this.trigger.addEventListener('click', () => {
          if (!this.isAnimating) this.fire();
        });
        
        this.chamber.addEventListener('click', () => {
          if (!this.isAnimating) this.spinChamber();
        });
        
        this.chamber.addEventListener('dblclick', () => this.activateCheat());
        
        document.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          if (!this.isAnimating) this.resetGame();
        });
      } catch (error) {
        console.error('Initialization error:', error);
      }
    }
  
    spinChamber() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.currentChamber = Math.floor(Math.random() * this.chambers);
      this.chamber.classList.add('spin-animation');
      
      setTimeout(() => {
        this.chamber.classList.remove('spin-animation');
        this.isAnimating = false;
      }, 1000);
    }
  
    fire() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      
      if (this.cheatActive) {
        this.safeShot();
        this.isAnimating = false;
        return;
      }
  
      const isFatal = this.currentChamber === this.bulletPosition;
  
      requestAnimationFrame(() => {
        if (isFatal && this.bullets > 0) {
          this.handleFatalShot();
        } else {
          this.handleSafeShot();
        }
        
        this.updateBulletCount();
        setTimeout(() => this.isAnimating = false, 500);
      });
    }
  
    handleFatalShot() {
      this.result.textContent = "💥 BOOM! Vous avez perdu!";
      this.result.className = 'danger';
      this.bullets = Math.max(0, this.bullets - 1);
      setTimeout(() => alert('Game Over!'), 500);
    }
  
    handleSafeShot() {
      this.result.textContent = "🔫 Clic! Vous survivez...";
      this.result.className = 'safe';
      this.currentChamber = (this.currentChamber + 1) % this.chambers;
    }
  
    updateBulletCount() {
      this.bulletCount.textContent = this.bullets;
    }
  
    activateCheat() {
      this.cheatActive = true;
      this.result.textContent = "👻 Mode invincible activé!";
      this.result.className = 'safe';
      setTimeout(() => {
        if (this.result.textContent === "👻 Mode invincible activé!") {
          this.result.textContent = '';
          this.result.className = '';
        }
      }, 2000);
    }
  
    resetGame() {
      this.bullets = 1;
      this.bulletPosition = Math.floor(Math.random() * this.chambers);
      this.currentChamber = 0;
      this.updateBulletCount();
      this.result.textContent = "🔄 Jeu réinitialisé!";
      this.result.className = '';
      setTimeout(() => this.result.textContent = '', 2000);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new RussianRoulette());