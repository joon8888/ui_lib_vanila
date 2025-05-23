export default class Accordion {
  constructor (el) {
    this.el = el;
    const defaultOptions = { a11y: false, multiOpen: false };
    this.options = Object.assign({}, defaultOptions, JSON.parse(el.dataset.accordionOptions || '{}'));
    this.items = this.el.querySelectorAll('.accordion__item');
    this.init();
  }

  init (el) {
    if(this.options.a11y) this.initA11y(); // a11y 옵션 처리
    this.bindEvent();
  }

  initA11y () {
    this.items.forEach(item => {
      const head = item.querySelector('.accordion__item__head');
      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');

      this.ariaHandler(item, false);
    });
  }

  ariaHandler (item, isExpand) {
    if(!this.options.a11y) return;

    const head = item.querySelector('.accordion__item__head');
    const content = item.querySelector('.accordion__item__content');

    head.setAttribute('aria-expanded', isExpand.toString());
    head.setAttribute('title', (!isExpand) ? '열기' : '닫기');
    content.setAttribute('aria-hidden', (!isExpand).toString());
  }

  bindEvent () {
    this.el.addEventListener('click', (e) => {
      const item = e.target.closest('.accordion__item');
      if (!item) return;

      const isActive = item.classList.contains('accordion__item--active');

      if (this.options.multiOpen) { // 다중열림 옵션 처리
        item.classList.toggle('accordion__item--active');
        if (!isActive) {
          this.ariaHandler(item, true);
        } else {
          this.ariaHandler(item, false);
        }
      } else {
        this.el.querySelectorAll('.accordion__item').forEach(other => {
          this.ariaHandler(other, false);
          other.classList.remove('accordion__item--active');
        });

        if (!isActive) {
          this.ariaHandler(item, true);
          item.classList.add('accordion__item--active');
        }
      }
    });

    this.el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      
      const head = e.target.closest('.accordion__item__head');
      head.click(); 
    });
  }
}