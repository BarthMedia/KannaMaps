// + Imports +

// Custom
import * as config from './config';
import render from './helper/view/render';
import filter from './helper/view/filter';
import elements from './helper/view/elements';

// + Exports +
export default function init(state: any) {
  // Elements
  state.elements = elements();

  // Add render to state
  state.renderProductData = (showSkeleton = false) => {
    render(showSkeleton);
  };

  // Initial render
  state.renderProductData();

  // Initialize filters
  filter(state);
}
