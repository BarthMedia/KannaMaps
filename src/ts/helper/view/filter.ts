// + Imports +

// Custom
import * as config from '../../config';

// Filters
import genetics from './filters/genetics';
import availability from './filters/availability';
import areaOfApplications from './filters/areaOfApplications';

// + Exports +
export default function init(state: any) {
  // Elements
  const filters = document.querySelector('[c-el="filters"]');
  const reset = filters?.querySelector('[c-el="reset"]');
  state.elements.filters = filters;
  state.elements.reset = reset;

  // Values
  const functionRegister = [genetics, availability, areaOfApplications];

  // Guard
  if (!filters || !reset)
    throw new Error(
      `KannaMaps -> filter.ts: Couldn't find necessary elements!`
    );

  // Event listener api
  state.filters = {};
  const params: any = {};
  state.filters.addParams = (key: string, value: string) => {
    // Add
    params[key] = value;

    // Trigger
    trigger();
  };

  // Trigger
  let timeoutId: number | undefined;
  let showSkeleton = true;
  function trigger() {
    // Skeleton logic
    if (showSkeleton) {
      showSkeleton = false;
      state.renderProductData(true);
    }

    // Clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Create timeout
    timeoutId = setTimeout(() => {
      showSkeleton = true;
      filter();
    }, config.FILTER_TRIGGER_DELAY * 1000);
  }

  // Filter
  async function filter() {
    // Get the current URL search parameters as an object
    const currentSearchParams = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    // Merge the new object into the existing search parameters object, overwriting any conflicting keys
    const mergedSearchParams = { ...currentSearchParams, ...params };

    // Filter out empty values from the merged search parameters
    const filteredSearchParams = {};
    for (const key in mergedSearchParams) {
      if (mergedSearchParams[key] !== '') {
        filteredSearchParams[key] = mergedSearchParams[key];
      }
    }

    // Convert the merged object back into search parameters
    const mergedSearchParamsString = new URLSearchParams(
      filteredSearchParams
    ).toString();

    // Activate reset button styles
    if (mergedSearchParamsString !== '') reset?.classList.remove('cc-inactive');
    else reset?.classList.add('cc-inactive');

    // Update the URL with the new search parameters
    const newURL = `${window.location.pathname}${
      mergedSearchParamsString.length ? '?' : ''
    }${mergedSearchParamsString}`.toLowerCase();

    // Update the URL without causing a page reload
    window.history.replaceState({}, document.title, newURL);

    // Load products
    await state.getProductData();

    // Render new products
    state.renderProductData();
  }

  // Initialize filters
  functionRegister.forEach(f => {
    f['init'](state);
  });

  // Reset event listener
  reset.addEventListener('click', () => {
    functionRegister.forEach(f => {
      f['reset']();
    });
  });

  // On pagination call, take existing location.search params
  // and add pagination params to it
}
