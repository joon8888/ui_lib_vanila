import Accordion from './ui/ui_accordion.js';
import { CursorEffect, MouseFollow } from './ui/ui_mouse_effect.js';
import Progressbar from './ui/ui_progressbar.js';
import Tab from './ui/ui_tab.js';
import Tooltip from './ui/ui_tooltip.js'

export default class Ui {
  constructor () {
    this.initAccordion();
    // this.initCursotEffect();
    this.initMouseFollow();
    this.initProgressbar();
    this.initTab();
    this.initTooltip();
  }

  initAccordion () {
    document.querySelectorAll('.accordion').forEach(el => new Accordion(el));
  }

  // initCursotEffect () {
  //   new CursorEffect ({enableHoverEffect: true});
  // }

  initMouseFollow () {
    document.querySelectorAll('.mouse-follow').forEach(el => new MouseFollow(el));
  }

  initProgressbar () {
    document.querySelectorAll('.scroll-progress').forEach(el => new Progressbar(el));
  }

  initTab() {
    document.querySelectorAll('.tab').forEach(el => new Tab(el));
  }

  initTooltip () {
    document.querySelectorAll('.tooltip').forEach(el => new Tooltip(el));
  }
}