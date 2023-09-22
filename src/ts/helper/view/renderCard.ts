// + Imports +

// Custom
import * as config from '../../config';
import * as utils from './utils';

// + Exports +
export default function (clone: HTMLElement, index: number) {
  // Values
  const state = window.KannaMaps;
  const data = state.productData.items[index];
  const list: HTMLElement = state.elements.productList;
  const notAvailableString =
    list.getAttribute('data-not-available-string') || 'n.v.';

  // Elements exist
  if (!data) {
    console.error(
      `KannaMaps -> render.ts: Couldn't find product datta!`,
      clone,
      index
    );
    return false;
  }

  // + Manipulate +

  // Strain
  const strain = clone.querySelector('[c-el="strain"]');
  if (strain) strain.innerHTML = data.data.strain || notAvailableString;

  // Type
  const type = clone.querySelector('[c-el="type"]');
  if (type) type.innerHTML = data.data.type || notAvailableString;

  // Url
  const urls = clone.querySelectorAll('[c-el="url"]');
  const dataUrl =
    data.wf_slug !== ''
      ? (list.getAttribute('data-slug-prefix') || '/info/') + data.wf_slug
      : undefined;
  if (urls.length && dataUrl)
    urls.forEach(url => url.setAttribute('href', dataUrl));
}
