import { makeAutoObservable } from 'mobx';

export class UiStore {
  windowWidth = window.innerWidth;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    // Add resize listener
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setWindowWidth(window.innerWidth);
  };

  setWindowWidth(width) {
    this.windowWidth = width;
  }

  get isMobile() {
    return this.windowWidth <= 768;
  }
}
