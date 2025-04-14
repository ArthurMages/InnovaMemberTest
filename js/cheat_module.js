export class CheatManager {
    constructor(pattern, callback) {
      this.pattern = pattern;
      this.inputSequence = [];
      this.callback = callback;
    }
  
    register(input) {
      this.inputSequence.push(input);
      if (this.inputSequence.length > this.pattern.length) {
        this.inputSequence.shift();
      }
      
      if (this.inputSequence.join(',') === this.pattern.join(',')) {
        this.callback();
        this.reset();
      }
    }
  
    reset() {
      this.inputSequence = [];
    }
  }