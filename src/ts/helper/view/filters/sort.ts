// @ts-nocheck

// + Imports +

// Custom
import * as config from '../../../config';

// + Class +
class Class {
  #addClass(el: HTMLElement) {
    // Values
    const elements = [el];

    // Classlist
    elements.forEach(el => el.classList.add('cc-active'));
  }

  #removeClass(el: HTMLElement) {
    // Values
    const elements = [el];

    // Classlist
    elements.forEach(el => el.classList.remove('cc-active'));
  }

  #showTag(text: string) {
    // Values
    this.sortTag.classList.remove('cc-inactive');

    // Overwrite
    this.sortTagText.innerHTML = text;
  }

  #hideTag() {
    // Values
    this.sortTag.classList.add('cc-inactive');
  }

  init(state: any) {
    // Values
    this.addParams = state.filters.addParams;
    this.active = '';
    this.fileName = 'sort.ts';
    this.paramName = 'sortieren-nach';
    this.commaSubstitution = '_c_';
    this.ampersandSubstitution = '_a_';

    // Elements
    this.parent = document.querySelector('[c-el="sort"]');
    this.buttons = this.parent?.childNodes;
    this.sortTag = document.querySelector('[c-el="sort-tag"]');
    this.sortTagText = this.sortTag.querySelector('[c-el="sort-tag-text"]');

    // Guard
    if (
      !this.parent ||
      !this.buttons.length ||
      !this.sortTag ||
      !this.sortTagText
    )
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

    // Label buttons correctly
    this.buttons.forEach((btn: HTMLElement, index: number) => {
      // Generate value
      const value = btn.innerHTML
        .toLowerCase()
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
    if (param !== '') {
      // Elements
      let button = undefined;

      // Loop
      this.buttons.forEach((btn: HTMLElement) => {
        if (btn.getAttribute('data-value') === param) button = btn;
      });

      // Click
      if (button) {
        this.#addClass(button);
        this.active = param;
        this.#showTag(button.innerHTML);
      }
      if (!button)
        console.warn(
          `KannaMaps -> ${this.fileName}: "${param}" is an invalid param!`
        );
    }

    // Init listeners
    this.#listeners();
  }

  // Events
  #listeners() {
    // Tag event listener
    this.sortTag.addEventListener('click', () => {
      this.reset();
    });

    // Buttons loop
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
        if (this.active === value) {
          // Deselect old button
          this.active = '';
          this.#removeClass(btn);
          this.#hideTag();
        } else {
          // Deselect old
          if (this.active !== '') {
            // Elements
            let button = undefined;

            // Loop
            this.buttons.forEach((btn: HTMLElement) => {
              // Logic
              if (btn.getAttribute('data-value') === this.active) button = btn;
            });

            // Click
            if (button) {
              button.click();
            } else
              console.warn(
                `KannaMaps -> ${this.fileName}: "${this.active}" is an invalid param!`
              );
          }

          // Select new button
          this.#addClass(btn);
          this.active = value;
          this.#showTag(btn.innerHTML);
        }

        // Add params
        this.addParams(this.paramName, this.active);
      });
    });
  }

  // Reset
  reset() {
    // Click
    if (this.active !== '') {
      // Elements
      let button = undefined;

      // Loop
      this.buttons.forEach((btn: HTMLElement) => {
        if (btn.getAttribute('data-value') === this.active) button = btn;
      });

      // Click
      button?.click();
      if (!button)
        console.warn(
          `KannaMaps -> ${this.fileName}: "${this.active}" is an invalid param!`
        );
    }
  }
}

// Export an instance of Class
export default new Class();
