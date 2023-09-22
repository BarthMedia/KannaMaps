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

  // * Append *

  // Rendering
  obj.productList = productList;
  obj.productTemplate = productTemplate;

  // Return
  return obj;
}
