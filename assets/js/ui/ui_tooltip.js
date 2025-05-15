class Tooltip {
  constructor (el) {
    this.el = el ;
    const defaultOptions = {direction: {x: 'auto', y: 'auto'}, a11y: false};
    const userOptions = JSON.parse(el.dataset.tooltipOptions || '{}');
    this.options = Object.assign({}, defaultOptions, userOptions);
    this.options.direction = Object.assign({}, defaultOptions.direction, userOptions.direction || {});
    this.popup = this.el.querySelector('.tooltip__popup');
    this.isOpen = false;
    this.init();
  }

  init () {
    this.bindEvent();
    if (this.options.a11y) this.activateA11y();
  }

  activateA11y () {
    this.popup.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
  }

  getBtnPosition (el) {
    const pos = el.getBoundingClientRect();
    return {
      width: pos.width,
      height: pos.height,
      top: pos.top,
      bottom: pos.bottom,
      left: pos.left,
      right: pos.right
    }
  }

  calculateDirection (btn) {
    const {
      top: btnTop, 
      // bottom: btnBottom, 
      left: btnLeft, 
      right: btnRight
    } = this.getBtnPosition(btn);
    
    const {
      clientWidth: popupWidth,
      clientHeight: popupHeight
    } = this.popup;

    const sideRoom = (popupWidth / 2) - (btn.clientWidth / 2); 

    let translateValue = {x: -50, y: -100};
    
    // direction X 
    if (this.options.direction.x === 'auto') {
      if (btnLeft < sideRoom) {
        this.popup.classList.add('tooltip__popup--active--align-x-left');
        translateValue.x = 0; 
      } else if (window.innerWidth - btnRight < sideRoom) {
        this.popup.classList.add('tooltip__popup--active--align-x-right');
        translateValue.x = 0; 
      } else {
        translateValue.x = -50;
      }
    } else if (this.options.direction.x === 'center') {
      translateValue.x = -50;
    } else if (this.options.direction.x === 'left') {
      this.popup.classList.add('tooltip__popup--active--align-x-left');
      translateValue.x = 0; 
    } else if (this.options.direction.x === 'right') {
      this.popup.classList.add('tooltip__popup--active--align-x-right');
      translateValue.x = 0; 
    }

    // direction Y 
    if (this.options.direction.y === 'auto') {
      if (btnTop < popupHeight) {
        this.popup.classList.add('tooltip__popup--active--align-y-bottom');
        translateValue.y = 0; 
      } else {
        translateValue.y = -100; 
      }
    } else if (this.options.direction.y === 'top') {
      translateValue.y = -100; 
    } else if (this.options.direction.y === 'bottom') {
      this.popup.classList.add('tooltip__popup--active--align-y-bottom');
      translateValue.y = 0; 
    }
    
    this.popup.style.transform = `translate(${translateValue.x}%, ${translateValue.y}%)`;
    this.open();
  }

  open () {
    this.isOpen = true;
    this.popup.classList.add('tooltip__popup--active');
    if (this.options.a11y) {
      this.activateA11y();
      this.el.focus();
    }
  }

  close () {
    this.popup.classList.remove('tooltip__popup--active');
    this.popup.classList.remove('tooltip__popup--active--align-x-left')
    this.popup.classList.remove('tooltip__popup--active--align-x-right')
    this.popup.classList.remove('tooltip__popup--active--align-y-bottom');
    this.isOpen = false;
    if (this.options.a11y) {
      this.activateA11y();
      const openBtn = this.el.querySelector('.tooltip__btn-open');
      if (openBtn) openBtn.focus();
    }
  }

  bindEvent () {
    this.el.addEventListener('click', e => {
      const openBtn = e.target.closest('.tooltip__btn-open');
      const closeBtn = e.target.closest('.tooltip__popup__head__close');

      if (closeBtn) {
        this.close();
        return;
      }

      if (this.isOpen) return;
      if (!openBtn) return;

      this.openBtn = openBtn;
      this.calculateDirection(openBtn);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    document.addEventListener('click', e => {
      if (this.isOpen && !this.el.contains(e.target)) {
        this.close();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tooltip').forEach(el => new Tooltip(el));
})