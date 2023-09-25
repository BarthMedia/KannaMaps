// @ts-nocheck

// + Imports +

// Custom
import * as config from '../../../config';

// + Class +
class Class {
  #addClass(el: HTMLElement) {
    // Values
    const elements = [el];
    el.childNodes.forEach(node => elements.push(node));

    // Classlist
    elements.forEach(el => el.classList.add('cc-active'));
  }

  #removeClass(el: HTMLElement) {
    // Values
    const elements = [el];
    el.childNodes.forEach(node => elements.push(node));

    // Classlist
    elements.forEach(el => el.classList.remove('cc-active'));
  }

  init(state: any) {
    // Values
    this.addParams = state.filters.addParams;
    this.active = false;
    this.fileName = 'availability.ts';
    this.paramName = 'lieferbar';

    // Elements
    this.button = state.elements.filters.querySelector('[c-el="availability"]');

    // Guard
    if (!this.button)
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

    // Initial state
    const param = (
      new URLSearchParams(location.search).get(this.paramName) || ''
    ).toLowerCase();

    // Click
    if (param === 'ja') {
      this.#addClass(this.button);
      this.active = true;
    }

    // Init listeners
    this.#listeners();
  }

  // Events
  #listeners() {
    // Loop
    this.button.addEventListener('click', () => {
      // Logic
      if (this.active) {
        this.active = false;
        this.#removeClass(this.button);
      } else {
        this.active = true;
        this.#addClass(this.button);
      }

      // Add params
      this.addParams(this.paramName, this.active ? 'ja' : '');
    });
  }

  // Reset
  reset() {
    // Click
    if (this.active) {
      this.button.click();
    }
  }
}

// Export an instance of Class
export default new Class();
