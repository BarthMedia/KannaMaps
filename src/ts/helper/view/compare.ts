// + Imports +

// Custom
import * as config from '../../config';

// Helper

// + Exports +
export default function (state: any, data: any) {
  // Click popup open button!

  // Elements
  const opener = document.querySelector(
    '[c-el="apothecaries-pop-up-button"]'
  ) as HTMLElement;
  const modul = document.querySelector('[c-el="apothecaries-popup"]');
  const notAvailableString = 'n.v.';

  // Guard
  if (!opener || !modul)
    throw new Error(`KannaMaps Compare: Couldn't find required elements!`);

  // Strain
  const strain = modul.querySelector('[c-el="strain"]');
  if (strain) strain.innerHTML = data.data.strain || notAvailableString;

  // Type
  const type = modul.querySelector('[custom-identifier="type"]');
  if (type) type.innerHTML = data.data.type || notAvailableString;

  // Images
  const indica = modul.querySelector('[c-el="indica"]');
  const sativa = modul.querySelector('[c-el="sativa"]');
  const hybrid = modul.querySelector('[c-el="hybrid"]');
  if (indica && sativa && hybrid) {
    // Values
    const elements = [indica, sativa, hybrid];

    // Loop
    elements.forEach(el => {
      // Hide all elements
      el.classList.add('cc-inactive');

      // Show specific
      if (el.getAttribute('c-el') === data.data.genetics.toLowerCase())
        el.classList.remove('cc-inactive');
    });
  }

  // Open
  opener.click();

  // Clear
  state.elements.compareTemplateList.innerHTML = '';

  // Loop
  data.data.apothecaries_data.detailed.forEach((data: any) => {
    // Clone
    const clone = state.elements.compareItemTemplate.cloneNode(
      true
    ) as HTMLElement;

    /**
     * Manipulate
     */

    // Available
    const green = clone.querySelector('[c-el="available-dot"]');
    const red = clone.querySelector('[c-el="unavailable-dot"]');
    if (green && red)
      if (data.available) {
        green['style'].display = 'none';
        red['style'].display = 'block';
      } else {
        {
          red['style'].display = 'none';
          green['style'].display = 'block';
        }
      }

    // Name
    const name = clone.querySelector('[c-el="name"]');
    if (name) name.innerHTML = data._vendor.name;

    // Price
    const price = clone.querySelector('[c-el="price"]');
    if (price)
      price.innerHTML =
        data?.price?.toFixed(2)?.replace('.', ',') || notAvailableString;

    // Click
    clone.addEventListener('click', () => {
      if (data._vendor.live_url) location.href = data._vendor.live_url;
    });

    // Append
    state.elements.compareTemplateList.append(clone);
  });
}
