class Progressbar {
  constructor () {
    this.el = document.querySelector('.scroll-progress');
    const defaultOptions = {type: 'bar', isLabel: 'true'}
    this.options = Object.assign({}, defaultOptions, JSON.parse(this.el.dataset.progressbarOptions || '{}'));
    this.label = null;
    this.init();
  }
  init () {
    this.scrollEvent();
  }
  activateLabel () {
    this.label = document.createElement('span');
    this.el.appendChild(this.label)
    this.label.classList.add('.scroll-progress__label');
    this.label.textContent = Math.floor(window.scrollY / scrollHeight * 100)
  }
  scrollEvent () {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const bar = this.el.querySelector('.scroll-progress__bar');
    this.activateLabel()
    document.addEventListener('scroll', () => {
      const progress = Math.floor(window.scrollY / scrollHeight * 100)
      label.textContent = progress;
      bar.style.width = `${progress}%`;
    })
  }
}

addEventListener("DOMContentLoaded", () => {
  new Progressbar();
});