// @ts-nocheck

// + Imports +

// Custom
import * as config from '../../../config';

// + Class +
class Class {
  init(state: any) {
    // Values
    this.addParams = state.filters.addParams;
    this.fileName = 'priceRange.ts';
    this.paramName = 'preis';
    this.duration = 0.3;

    // Elements
    this.parent = state.elements.filters.querySelector('[c-el="price-range"]');
    this.handlesWrapper = this.parent.querySelector(
      '[fs-rangeslider-element="wrapper"]'
    );
    this.handles = this.parent?.querySelectorAll(
      '[fs-rangeslider-element="handle"]'
    );
    this.displays = this.parent?.querySelectorAll(
      '[fs-rangeslider-element="display-value"]'
    );
    this.inputs = this.parent?.querySelectorAll('[fs-cmsfilter-field="price"]');
    this.track = this.parent?.querySelector('[fs-rangeslider-element="track"]');
    this.fill = this.parent?.querySelector('[fs-rangeslider-element="fill"]');

    // Guard
    if (
      !this.parent ||
      !this.inputs.length ||
      !this.handles.length ||
      !this.displays.length ||
      !this.handlesWrapper ||
      !this.track ||
      !this.fill
    )
      throw new Error(
        `KannaMaps -> ${this.fileName}: Couldn't find necessary elements!`
      );

    // Duplicate display span's and overwrite this.displays
    const displays = [];
    this.displays.forEach((display: HTMLElement) => {
      // Clone the existing display element
      const clonedDisplay = display.cloneNode(true) as HTMLElement;

      // Optionally modify the cloned display element if needed
      clonedDisplay.removeAttribute('fs-rangeslider-element');

      // Replace the existing display element with the cloned one in the DOM
      display.parentNode.replaceChild(clonedDisplay, display);

      // Add the cloned display element to the updated this.displays array
      displays.push(clonedDisplay);
    });
    this.displays = displays;

    // Initial state
    const param = (
      new URLSearchParams(location.search).get(this.paramName) || ''
    ).toLowerCase();

    // Values
    this.minMaxValues = [
      parseFloat(this.handlesWrapper.getAttribute('fs-rangeslider-min') || '0'),
      parseFloat(
        this.handlesWrapper.getAttribute('fs-rangeslider-max') || '30'
      ),
    ];
    this.values = [...this.minMaxValues];

    // Click
    if (param !== '') {
      try {
        // Values
        const params = param.split('-').map(str => parseFloat(str));

        // Guard
        if (params.length !== 2) throw new Error('Too many params!');
        if (isNaN(params[0]) || isNaN(params[1])) throw new Error('isNan!');
        if (params[0] >= params[1]) throw new Error('>=');
        if (
          params[0] < this.minMaxValues[0] ||
          params[1] > this.minMaxValues[1]
        )
          throw new Error('Not within min/max!');

        // Success
        this.values = [params[0], params[1]];
        this.#moveHandles();
      } catch (err) {
        console.warn(
          `KannaMaps -> ${this.fileName}: "${param}" is an invalid param!`,
          err
        );
      }
    }

    // Init listeners
    this.#listeners();
  }

  #moveHandles() {
    // Values
    const totalWidth = this.track.offsetWidth;
    let left = 0,
      right = 0;

    // Destroy
    fsAttributes.rangeslider.destroy();

    // Loop
    this.handles.forEach((handle: HTMLElement, index: number) => {
      // Values
      const input = this.inputs[index];
      const value = this.values[index];
      const display = this.displays[index];
      const oldVal = parseFloat(input.value);
      const valDifference = value - oldVal;

      // Math
      const x = (value / this.minMaxValues[1]) * totalWidth;
      if (!index) left = x;
      else right = x;

      // Guard
      if (oldVal === value) return;

      // Overwrite
      input.value = value;
      handle.setAttribute('fs-rangeslider-start', value);

      // Animate
      const animation = gsap.to(handle, {
        duration: this.duration,
        left: x + 'px',
        onUpdate: () => {
          display.innerHTML = (oldVal + valDifference * animation.progress())
            .toFixed(1)
            .replace('.', ',');
        },
        onComplete: () => {
          display.innerHTML = value.toString().replace('.', ',');
        },
      });
    });

    // Fill logic
    const options = {
      duration: this.duration,
      left: left + 'px',
      width: `${right - left}px`,
    };
    gsap.to(this.fill, options);

    // Destroy & rebuild fs rangeslider
    setTimeout(async () => {
      await fsAttributes.rangeslider.init();
      await fsAttributes.rangeslider.init();
    }, this.duration * 1000);
  }

  // Events
  #listeners() {
    // Values
    const _this = this;

    // Loop through handles
    this.handles.forEach((handle: HTMLElement, index: number) => {
      // Values
      const input = this.inputs[index];
      const display = this.displays[index];

      // Initialize variables to track the slider's state
      let isDragging = false;

      // Event listeners for mouse/touch events for the current handle
      handle.addEventListener('mousedown', () => startDragging());
      document.addEventListener('mousemove', handleDragging);
      document.addEventListener('mouseup', stopDragging);
      handle.addEventListener('touchstart', () => startDragging());
      document.addEventListener('touchmove', handleDragging);
      document.addEventListener('touchend', stopDragging);
      this.track.addEventListener('click', () => {
        handleDragging(true);
      });

      // Function to handle the start of dragging
      function startDragging() {
        isDragging = true;
      }

      // Function to handle dragging
      function handleDragging(isClick = false) {
        if (isDragging || isClick === true) {
          // Values
          const val = parseFloat(input.value);

          // Set
          display.innerHTML = val.toString().replace('.', ',');
          _this.values[index] = val;
          if (!_this.#arraysAreEqual())
            _this.addParams(_this.paramName, _this.values.join('-'));
          else _this.addParams(_this.paramName, '');
        }
      }

      // Function to handle the end of dragging
      function stopDragging() {
        isDragging = false;
      }
    });
  }

  // Helper
  #arraysAreEqual() {
    // Values
    const arr1 = this.values,
      arr2 = this.minMaxValues;

    // Logic
    if (arr1.length !== arr2.length) {
      return false; // If the arrays have different lengths, they can't be equal
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false; // If any elements are different, the arrays are not equal
      }
    }

    return true; // If we haven't found any differences, the arrays are equal
  }

  // Reset
  reset() {
    if (!this.#arraysAreEqual()) {
      this.addParams(this.paramName, '');
      this.values = [...this.minMaxValues];
      this.#moveHandles();
    }
  }
}

// Export an instance of Class
export default new Class();
