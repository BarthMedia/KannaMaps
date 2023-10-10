// + Imports +

// Custom
import * as config from '../../config';

// Filters
import genetics from './filters/genetics';
import availability from './filters/availability';
import areaOfApplications from './filters/areaOfApplications';
import effects from './filters/effects';
import activities from './filters/activities';
import sideEffects from './filters/sideEffects';
import cannabinoids from './filters/cannabinoids';
import terpenes from './filters/terpenes';
import tastes from './filters/tastes';
import irradiations from './filters/irradiations';
import producers from './filters/producers';
import qualities from './filters/qualities';
import sort from './filters/sort';
import priceRange from './filters/priceRange';

// + Exports +
export default function init(state: any) {
  // Elements
  const filters = document.querySelector('[c-el="filters"]');
  const reset = filters?.querySelector('[c-el="reset"]') as HTMLElement;
  state.elements.filters = filters;
  state.elements.reset = reset;

  // Values
  const functionRegister = [
    genetics,
    availability,
    areaOfApplications,
    effects,
    activities,
    sideEffects,
    cannabinoids,
    terpenes,
    tastes,
    irradiations,
    producers,
    qualities,
    sort,
    priceRange,
  ];

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

    // If not pagination, reset pagination
    if (key !== 'seite') params['seite'] = '';

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
  function resetF() {
    // Events
    reset.dispatchEvent(
      new CustomEvent('onReset', {
        bubbles: true,
      })
    );

    // Loop
    functionRegister.forEach(f => {
      f['reset']();
    });

    // Events
    reset.dispatchEvent(
      new CustomEvent('afterReset', {
        bubbles: true,
      })
    );
  }
  reset.addEventListener('click', resetF);
  state.filters.reset = resetF;

  // Init reset button styles
  if (location.search !== '') reset?.classList.remove('cc-inactive');
  else reset?.classList.add('cc-inactive');

  // On pagination call, take existing location.search params
  // and add pagination params to it
}
