// @ts-nocheck

// + Imports +

// Custom
import * as config from '../../../config';

// + Class +
class Class {
  init(state: any) {
    // Values
    this.addParams = state.filters.addParams;
    this.multiSelect = 3;
    this.actives = [];
    this.fileName = 'areaOfApplications.ts';
    this.paramName = 'anwendungsgebiet';
    this.commaSubstitution = '__c__';
    this.ampersandSubstitution = '__a__';

    // Elements
    this.parent = state.elements.filters.querySelector(
      '[c-el="area-of-application"]'
    );
    this.buttons = this.parent?.querySelectorAll('label');

    // Guard
    if (!this.parent || !this.buttons.length)
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

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

        // Update
        str = str
          .replace(new RegExp(this.commaSubstitution, 'g'), ',')
          .replace(new RegExp(this.ampersandSubstitution, 'g'), '&amp;');

        // Loop
        this.buttons.forEach((btn: HTMLElement) => {
          if (btn.querySelector('span')?.innerHTML.toLowerCase() === str)
            button = btn;
        });

        // Click
        if (button) {
          button.click();
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
      const value = btn
        .querySelector('span')
        ?.innerHTML.toLowerCase()
        .replace(/,/g, this.commaSubstitution)
        .replace(/&amp;/g, this.ampersandSubstitution);

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
        } else {
          // Multiselect
          if (this.multiSelect - 1 < this.actives.length) {
            // Elements
            let button = undefined;

            // Loop
            this.buttons.forEach((btn: HTMLElement) => {
              // Values
              const btnTxt = btn
                .querySelector('span')
                ?.innerHTML.toLowerCase()
                .replace(/,/g, this.commaSubstitution)
                .replace(/&amp;/g, this.ampersandSubstitution);

              // Logic
              if (btnTxt === this.actives[0]) button = btn;
            });

            // Click
            button?.click();
          }

          console.log('hey', this.actives[0], value);

          // Push
          console.log(value, this.actives);
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

      // Update
      str = str
        .replace(new RegExp(this.commaSubstitution, 'g'), ',')
        .replace(new RegExp(this.ampersandSubstitution, 'g'), '&amp;');

      // Loop
      this.buttons.forEach((btn: HTMLElement) => {
        if (btn.querySelector('span')?.innerHTML.toLowerCase() === str)
          button = btn;
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
