export default class Accordion {
  constructor (el) {
    this.el = el;
    const defaultOptions = { a11y: false, multiOpen: false };
    this.options = Object.assign({}, defaultOptions, JSON.parse(el.dataset.accordionOptions || '{}'));
    this.items = this.el.querySelectorAll('.accordion__item');

    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const content = entry.target;
        if (content.closest('.accordion__item').classList.contains('accordion__item--active')) {
          this.setMaxHeight(content);
        }
      });
    });
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
    this.el.addEventListener('click', e => {
      const item = e.target.closest('.accordion__item');
      if (!item) return;

      const isActive = item.classList.contains('accordion__item--active');
      const content = item.querySelector('.accordion__item__content');

      if (this.options.multiOpen) {
        item.classList.toggle('accordion__item--active');
        if (isActive) {
          this.setMaxHeight(content, 0);
          this.ariaHandler(item, false);
        } else {
          this.setMaxHeight(content);
          this.ariaHandler(item, true);
        }
      } else {
        this.items.forEach(other => {
          const otherContent = other.querySelector('.accordion__item__content');
          other.classList.remove('accordion__item--active');
          this.setMaxHeight(otherContent, 0);
          this.ariaHandler(other, false);
        });

        if (!isActive) {
          item.classList.add('accordion__item--active');
          this.setMaxHeight(content);
          this.ariaHandler(item, true);
        }
      }
    });

    this.el.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;

      const head = e.target.closest('.accordion__item__head');
      head?.click();
    });
  }

  setMaxHeight(content, height = null) {
    if (height === 0) {
      content.style.maxHeight = '0px';
    } else {
      const style = window.getComputedStyle(content);
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);
      const totalHeight = content.scrollHeight + paddingTop + paddingBottom;
      
      content.style.maxHeight = `${totalHeight}px`;
    }
  }
}