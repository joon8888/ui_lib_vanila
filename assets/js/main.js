import Ui from './ui.js';

export default class Main {
  constructor (props) {
    this.setRoot(props);
    this.ui = new Ui();

    this.init();
  }

  setRoot({ context, name }) {
    context.APP_NAME = name;
    context[name] = this;
  }

  init () {
    this.loadPage = this.loadPage.bind(this);
    window.addEventListener('hashchange', this.loadPage);
    window.addEventListener('DOMContentLoaded', this.loadPage);
  }

  loadPage () {
    const hash = location.hash.replace('#', '') || 'home';
    const url = `html/${hash}.html`;
    const frame = document.getElementById('page-frame');
    if (frame) frame.src = url;

    const navBtns = document.querySelectorAll('.nav__menu__btn--load');
    navBtns.forEach(btn => {
      btn.classList.remove('active');
      if(btn.getAttribute('href') === `#${hash}`) btn.classList.add('active');
    })
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const mainApp = new Main({
    context: window,
    name: 'mainApp',
  });
});
