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
    this.multiSelect = 3;
    this.actives = [];
    this.fileName = 'cannabinoids.ts';
    this.paramName = 'cannabinoid';
    this.commaSubstitution = '_c_';
    this.ampersandSubstitution = '_a_';

    // Elements
    this.parent = state.elements.filters.querySelector('[c-el="cannabinoids"]');
    this.buttons = this.parent?.querySelectorAll(
      'label:not([c-el="no-button"])'
    );

    // Guard
    if (!this.parent || !this.buttons.length)
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

    // Label buttons correctly
    this.buttons.forEach((btn: HTMLElement, index: number) => {
      // Generate value
      const value = btn
        .querySelector('span')
        ?.innerHTML.toLowerCase()
        .replace(/,/g, this.commaSubstitution)
        .replace(/&amp;/g, this.ampersandSubstitution);

      // Set
      btn.setAttribute('data-value', `${value}`);
    });

    // Initial state
    const param = (
      new URLSearchParams(location.search).get(this.paramName) || ''
    ).toLowerCase();

    // Click
    let btnsClicked = 0;
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
          this.#addClass(button);
          this.actives.push(str);
          btnsClicked++;
        }
        if (!button)
          console.warn(
            `KannaMaps -> ${this.fileName}: "${str}" is an invalid param!`
          );

        // Break if multi select
        if (this.multiSelect <= btnsClicked) return false;
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

      // Double click
      let isDoubleClick = false;

      // Listener
      btn.addEventListener('click', () => {
        // Guard
        if (!isDoubleClick) {
          isDoubleClick = true;
          setTimeout(() => {
            isDoubleClick = false;
          }, 1);
        } else return;

        // Logic
        if (this.actives.includes(value)) {
          this.#spliceActives(value);
          this.#removeClass(btn);
        } else {
          // Push
          this.actives.push(value);
          this.#addClass(btn);

          // Multiselect
          if (this.multiSelect < this.actives.length) {
            // Elements
            let button = undefined;

            // Loop
            this.buttons.forEach((btn: HTMLElement) => {
              // Logic
              if (btn.getAttribute('data-value') === this.actives[0])
                button = btn;
            });

            // Click
            if (button) {
              this.actives.splice(0, 1);
              this.#removeClass(button);
            } else
              console.warn(
                `KannaMaps -> ${this.fileName}: "${this.actives[0]}" is an invalid param!`
              );
          }
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
