class CursorEffect {
  constructor (userOptions) {
    const defaultOptions = {enableSmoothing: false, smoothingSpeed: 0.1, hideDefaultCursor: false, enableHoverEffect: false};
    this.options = Object.assign({}, defaultOptions, userOptions || {});
    this.cursor = null;
    this.pageX = 0;
    this.pageY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.init()
  }

  init () {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; //모바일 제외

    this.createCursorEl();
    if(!this.options.hideDefaultCursor) this.cursorStyleHandler();
    this.moveCursorEvent();
    if(this.options.enableHoverEffect) this.changeCursorEvent();
  }

  createCursorEl () {
    this.cursor = document.createElement('div');
    this.cursor.id = 'cursor';
    document.body.appendChild(this.cursor);

    const cursorItem = document.createElement('div');
    cursorItem.classList.add('cursor__item');
    this.cursor.appendChild(cursorItem);

    const cursorText = document.createElement('p');
    cursorText.classList.add('cursor__item__text');
    cursorItem.appendChild(cursorText);
  }

  moveCursorEvent () {
    window.addEventListener('mousemove', e => {
      this.pageX = e.clientX;
      this.pageY = e.clientY;
    })

    const loop = this.options.enableSmoothing ? this.smoothLoop.bind(this) : this.instantLoop.bind(this);
    loop(); 
  }

  smoothLoop() {
    const animate = () => {
      this.targetX += (this.pageX - this.targetX) * this.options.smoothingSpeed;
      this.targetY += (this.pageY - this.targetY) * this.options.smoothingSpeed;
      this.cursor.style.left = `${this.targetX}px`;
      this.cursor.style.top = `${this.targetY}px`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  instantLoop() {
    const animate = () => {
      this.cursor.style.left = `${this.pageX}px`;
      this.cursor.style.top = `${this.pageY}px`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  cursorStyleHandler () {
    document.body.style.cursor = 'none';
  }

  changeCursorEvent () {
    const hoverItems = document.querySelectorAll('a[href]:not([href="#"]):not([href="#none"]):not([href="javascript:void(0)"]):not([href="javascript:;"]):not([href=""]), button')
    hoverItems.forEach(item => {
      const cursorStatus = (item.dataset.cursor) ? item.dataset.cursor : 'zoom';
      item.addEventListener('mouseover', () => this.cursor.dataset.cursorStatus = cursorStatus);
      item.addEventListener('mouseleave', () => this.cursor.removeAttribute('data-cursor-status'));
    })
  }
}

class MouseFollow {
  constructor (el) {
    this.el = el;
    this.items = Array.from(this.el.querySelectorAll('.mouse-follow__item')).map(item => {
      const defaultOptions = { followRange: 0.1, speed: 0.5 };
      const itemOptions = Object.assign({}, defaultOptions, JSON.parse(item.dataset.mouseFollowOptions || '{}'));
      return {
        el: item,
        options: itemOptions
      };
    });
    this.init();
  }

  init () {
    this.items.forEach(item => {
      this.followEvent(item);
    })
  }

  followEvent (item) {
    let currentX = 0, currentY = 0;
    let oldX = 0, oldY = 0;

    window.addEventListener('mousemove', e => {
      currentX = e.clientX - window.innerWidth / 2;
      currentY = e.clientY - window.innerHeight / 2;
    });

    const loop = () => {
      oldX += (currentX - oldX) * item.options.speed;
      oldY += (currentY - oldY) * item.options.speed;

      item.el.style.transform = `translate(${parseInt(oldX * item.options.followRange)}px, ${parseInt(oldY * item.options.followRange)}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }


}

document.addEventListener('DOMContentLoaded', () => {
  new CursorEffect ({
    enableHoverEffect: true
  });
  document.querySelectorAll('.mouse-follow').forEach(el => new MouseFollow(el));
})