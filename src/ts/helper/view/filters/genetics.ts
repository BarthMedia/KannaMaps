// @ts-nocheck

// + Imports +

// Custom
import * as config from '../../../config';

// + Class +
class Class {
  init(state: any) {
    // Values
    this.addParams = state.filters.addParams;
    this.multiSelect = true;
    this.actives = [];
    this.fileName = 'genetics.ts';
    this.paramName = 'genetik';

    // Elements
    this.buttons = state.elements.filters.querySelectorAll('[c-el="genetics"]');

    // Guard
    if (!this.buttons.length)
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

    // Initial state
    const param = (
      new URLSearchParams(location.search).get(this.paramName) || ''
    ).toLowerCase();

    // Click
    if (param !== '')
      param.split(',').every(str => {
        // Elements
        let button = undefined;

        // Loop
        this.buttons.forEach((btn: HTMLElement) => {
          if (btn.getAttribute('data-value') === str) button = btn;
        });

        // Click
        if (button) {
          button.click();
          this.actives.push(str);
        }
        if (!button)
          console.warn(
            `KannaMaps -> ${this.fileName}: "${str}" is an invalid param!`
          );

        // Break if multi select
        if (button && !this.multiSelect) return false;
        return true;
      });

    // Init listeners
    this.#listeners();
  }

  // Events
  #listeners() {
    // Loop
    this.buttons.forEach((btn: HTMLElement) => {
      // Values
      const value = btn.getAttribute('data-value');

      // Guard
      if (!value)
        throw new Error(
          `KannaMaps -> ${this.fileName}: Button has no value`,
          btn
        );

      // Listener
      btn.addEventListener('click', () => {
        // Logic
        if (this.actives.includes(value)) {
          this.#spliceActives(value);
        } else {
          // Multiselect
          if (!this.multiSelect) {
            // Elements
            let button = undefined;

            // Loop
            this.buttons.forEach((btn: HTMLElement) => {
              if (btn.getAttribute('data-value') === this.actives[0])
                button = btn;
            });

            // Click
            button?.click();
          }

          // Push
          this.actives.push(value);
        }

        // Add params
        this.addParams(this.paramName, this.actives.join(','));
      });
    });
  }

  // Splice
  #spliceActives(value: string) {
    // Values
    const i = this.actives.indexOf(value);

    // Remove the value from the array
    if (i !== -1) {
      this.actives.splice(i, 1);
    }
  }

  // Reset
  reset() {
    // Values
    const arr = [...this.actives];

    // Loop
    arr.forEach((str: string) => {
      // Elements
      let button = undefined;

      // Loop
      this.buttons.forEach((btn: HTMLElement) => {
        if (btn.getAttribute('data-value') === str) button = btn;
      });

      // Click
      button?.click();
      if (!button)
        console.warn(
          `KannaMaps -> ${this.fileName}: "${str}" is an invalid param!`
        );
    });
  }
}

// Export an instance of Class
export default new Class();
