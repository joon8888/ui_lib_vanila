class Progressbar {
  constructor () {
    this.el = document.querySelector('.scroll-progress');
    const defaultOptions = {type: 'bar', isLabel: 'true'}
    this.options = Object.assign({}, defaultOptions, JSON.parse(this.el.dataset.progressbarOptions || '{}'));
    this.bar = null;
    this.label = null;
    this.scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.init();
  }
  init () {
    this.createBar();
    this.scrollEvent();
  }
  createBar () {
    this.bar = document.createElement('span');
    this.el.appendChild(this.bar);
    this.bar.classList.add('scroll-progress__bar');
    this.bar.style.width = Math.floor(window.scrollY / this.scrollHeight * 100);
  }
  activateLabel () {
    this.label = document.createElement('span');
    this.el.appendChild(this.label)
    this.label.classList.add('scroll-progress__label');
    this.label.textContent = Math.floor(window.scrollY / this.scrollHeight * 100);
  }
  scrollEvent () {
    if(this.options.isLabel) this.activateLabel();

    document.addEventListener('scroll', () => {
      const progress = Math.floor(window.scrollY / this.scrollHeight * 100);
      if(this.options.isLabel) this.label.textContent = progress;
      this.bar.style.width = `${progress}%`;
    })
  }
}

addEventListener("DOMContentLoaded", () => {
  new Progressbar();
});