// + Imports +

// Custom
import * as config from '../../config';

// + Exports +
export default function () {
  // Values
  const state = window.KannaMaps;
  const obj: any = {};

  // * Define *

  // Rendering
  const productList = document.querySelector('[c-el="product-list"]');
  const productTemplate = productList?.children[0].cloneNode(true);
  const emptyState = document.querySelector('[c-el="empty-state"]');
  const paginationWrapper = document.querySelector(
    '[c-el="pagination-wrapper"]'
  );
  const paginationNumberTemplate = paginationWrapper?.children[0].cloneNode(
    true
  ) as HTMLElement;
  const totalResults = document.querySelectorAll('[c-el="total-results"]');
  const totalResultsPlural = document.querySelectorAll(
    '[c-el="total-results-plural"]'
  );

  // Manipulate
  paginationNumberTemplate.classList.remove('cc-current');

  // * Append *

  // Rendering
  obj.productList = productList;
  obj.productTemplate = productTemplate;
  obj.emptyState = emptyState;
  obj.paginationWrapper = paginationWrapper;
  obj.paginationNumberTemplate = paginationNumberTemplate;
  obj.totalResults = totalResults;
  obj.totalResultsPlural = totalResultsPlural;

  // Return
  return obj;
}
