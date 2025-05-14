class Progressbar {
  constructor (el) {
    this.el = el;
    const defaultOptions = {type: 'bar', isLabel: false}
    this.options = Object.assign({}, defaultOptions, JSON.parse(this.el.dataset.progressbarOptions || '{}'));
    this.bar = null;
    this.label = null;
    this.init();
  }
  
  init () {
    this.createBar();
    if(this.options.isLabel) this.createLabel();
    this.scrollEvent();
  }
  
  createBar () {
    this.bar = document.createElement('span');
    this.el.appendChild(this.bar);
    this.bar.classList.add('scroll-progress__bar');

    if (this.options.type === 'bar') {
      this.el.classList.add('scroll-progress--type-bar');
      this.bar.style.width = Math.floor(this.getProgressPercent() * 100); 
    } else if (this.options.type === 'round') {
      this.el.classList.add('scroll-progress--type-round');
      this.bar.style.background = `conic-gradient(var(--progress-color) ${Math.floor(this.getProgressPercent()  * 360)}deg, transparent 0deg)`;
    }
  }
  
  createLabel () {
    this.label = document.createElement('span');
    this.el.appendChild(this.label)
    this.label.classList.add('scroll-progress__label');
    this.label.textContent = Math.floor(this.getProgressPercent() * 100);
  }

  getProgressPercent () {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return window.scrollY / scrollHeight;
  }

  updateProgress () {
    if(this.options.isLabel) this.label.textContent = Math.floor(this.getProgressPercent() * 100) ;
    if (this.options.type === 'bar') {
      this.bar.style.width = `${Math.floor(this.getProgressPercent() * 100)}%`;
    } else if (this.options.type === 'round') {
      this.bar.style.background = `conic-gradient(var(--progress-color) ${Math.floor(this.getProgressPercent()  * 360)}deg, transparent 0deg)`;
    }
  }

  scrollEvent () {
    document.addEventListener('scroll', () => this.updateProgress())
  }
}

addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.scroll-progress').forEach(el => new Progressbar(el));
});