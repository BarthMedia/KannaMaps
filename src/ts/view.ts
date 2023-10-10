// + Imports +

// Custom
import * as config from './config';
import render from './helper/view/render';
import filter from './helper/view/filter';
import elements from './helper/view/elements';
import compare from './helper/view/compare';

// + Exports +
export default function init(state: any) {
  // Elements
  state.elements = elements();

  // Add render to state
  state.renderProductData = (showSkeleton = false) => {
    render(showSkeleton);
  };

  // Compare
  state.compare = (data: any) => {
    compare(state, data);
  };

  // Initial render
  state.renderProductData();

  // Initialize filters
  filter(state);

  // Function to add the class 'pointer-events-none'
  function addPointerEventsNone() {
    // Add the 'pointer-events-none' class to the element
    state.elements.transitionLoader.classList.add('pointer-events-none');
  }

  // Event listener for the 'popstate' event
  window.addEventListener('popstate', function (event) {
    // This event is triggered when the user navigates backward or forward in their browser history
    // You can add your logic here to determine when to add the class 'pointer-events-none'

    // For example, you can add the class when the user navigates backward:
    addPointerEventsNone();
  });
}
