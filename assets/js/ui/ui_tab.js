class Tab {
  constructor(el) {
    this.el = el;
    const defaultOptions = {
      "type": "basic",
      "scrollDuration": 500, 
      "easing": "ease",   
      "offset": 0,
      "a11y": false,
    };
    this.options = Object.assign({}, defaultOptions, JSON.parse(el.dataset.tabOptions || '{}'));
    this.navHeight = 0;
    this.nav = this.el.querySelector('.tab__nav');
    this.navBtns = this.el.querySelectorAll('.tab__nav__btn');
    this.panels = this.el.querySelectorAll('.tab__content__panel');
    this.init();
  }

  init() {
    if(this.options.type === 'basic'){
      this.activateByClick(this.navBtns[0], this.panels[0]);
    } else if(this.options.type === 'scroll') {
      this.activateByClick(this.navBtns[0], this.panels[0]);
      this.el.classList.add('tab--scroll');
    } else if(this.options.type === 'scroll-fix') {
      this.navHeight = this.nav.clientHeight;
      this.el.classList.add('tab--scroll');
      this.activateByScroll();
    }

    this.bindEvent();
  }

  resetActive() {
    this.navBtns.forEach(btn => {
      btn.classList.remove('tab__nav__btn--active');
      if(this.options.a11y) btn.removeAttribute('title');
    });
    this.panels.forEach(panel => panel.classList.remove('tab__content__panel--active'));
  }

  activateByClick(btn, panel) {
    this.resetActive();

    btn.classList.add('tab__nav__btn--active');
    if(this.options.a11y) btn.setAttribute('title', '선택됨');

    panel.classList.add('tab__content__panel--active');
  }
  
  scrollTarget(panel) {
    if (this.options.a11y) {
      panel.setAttribute('tabindex', '-1');
      panel.focus({ preventScroll: true }); 

      setTimeout(() => {
        panel.removeAttribute('tabindex');
      }, 100);
    }
  
    const target = panel.getBoundingClientRect().top + window.scrollY - this.navHeight - this.options.offset;

    /* smoothScroll - claude ai 추천코드 */
    //기존코드 주석 
    // window.scrollTo({
    //   top: target,
    //   behavior: 'smooth'
    // });

    this.smoothScroll(target, this.options.scrollDuration, this.options.easing);
  }

  /* 
    smoothScroll - claude ai 추천코드
    easing, scrollDuration, offset -> data-tab-options 옵션 추가
  */
  smoothScroll(targetY, duration = 500, easing = 'ease') { // claude ai 추천코드 
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    const easings = {
      linear: t => t,
      ease: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeIn: t => t * t,
      easeOut: t => t * (2 - t),
      easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    };
    
    const easingFunction = easings[easing] || easings.ease;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easingFunction(progress);
      
      window.scrollTo(0, startY + distance * easeProgress);
      
      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    }
    
    window.requestAnimationFrame(step);
  }

  activateByScroll () {
    const getPos = (el) => {
      const { top, bottom } = el.getBoundingClientRect();
      return {
        top: Math.round(top),
        bottom: Math.round(bottom)
      };
    };
  
    const observeSection = (el, { onEnter, onLeave }, anchor = 0) => {
      const pos = getPos(el);
      if (pos.top <= anchor && pos.bottom > anchor) {
        onEnter?.(el);
      } else {
        onLeave?.(el);
      }
    };
  
    const tabContent = this.el.querySelector('.tab__content');
    let ticking = false;
    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          observeSection(this.el, {
            onEnter: () => {
              tabContent.style.paddingTop = `${this.navHeight}px`;
              this.nav.classList.add('tab__nav--fixed');
              this.nav.style.top = `${this.options.offset}px`;
              document.documentElement.style.position = 'relative';
            },
            onLeave: () => {
              tabContent.style.paddingTop = '';
              this.nav.classList.remove('tab__nav--fixed');
              this.nav.style.top = 0;
              document.documentElement.style.position = '';
            }
          }, this.options.offset);
  
          this.panels.forEach((panel, i) => {
            observeSection(panel, {
              onEnter: () => {
                this.navBtns[i].classList.add('tab__nav__btn--active');
                if(this.options.a11y) this.navBtns[i].setAttribute('title', '선택됨');

                panel.classList.add('tab__content__panel--active');
              },
              onLeave: () => {
                this.navBtns[i].classList.remove('tab__nav__btn--active');
                if(this.options.a11y) this.navBtns[i].removeAttribute('title');

                panel.classList.remove('tab__content__panel--active');
              }
            }, this.navHeight + this.options.offset);
          });
          ticking = false; 
        });
        ticking = true; 
      }
    });
  }

  bindEvent() {
    this.el.addEventListener('click', e => {
      const targetBtn = e.target.closest('.tab__nav__btn');
      if (!targetBtn) return;

      const panelId = targetBtn.dataset.tabTarget;
      const targetPanel = this.el.querySelector(panelId);
      if (!targetPanel) return;

      if(this.options.type === 'basic' || this.options.type === 'scroll') this.activateByClick(targetBtn, targetPanel);

      if(this.options.type === 'scroll' || this.options.type === 'scroll-fix') this.scrollTarget(targetPanel);
    });
  }
}

addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.tab').forEach(el => new Tab(el));
});
