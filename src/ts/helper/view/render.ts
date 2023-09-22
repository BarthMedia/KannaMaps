// + Imports +

// Custom
import * as config from '../../config';
import * as utils from './utils';
import renderCard from './renderCard';

// + Exports +
export default function (showSkeleton: boolean) {
  // Values
  const state = window.KannaMaps;
  const list: HTMLElement = state.elements.productList;
  const template: HTMLElement = state.elements.productTemplate;
  const data = state.productData;
  const skeletonFadeDuration = parseFloat(
    list.getAttribute('data-skeleton-fade-duration') ||
      config.SKELETON_FADE_DURATION.toString()
  );

  // + Guard +

  // Elements exist
  if (!utils.isElement(list) || !utils.isElement(template)) {
    console.error(
      `KannaMaps -> render.ts: Couldn't find list and/or template!`,
      list,
      template
    );
    return false;
  }

  // Product data exists
  try {
    if (typeof data.items.length !== 'number')
      'KannaMaps.productData.items is not an array!';
  } catch (err) {
    console.error(
      `KannaMaps -> render.ts: The product data is not in the correct format!`,
      err
    );
    return false;
  }

  // Render new product data
  if (!showSkeleton) render();

  // + + + Show / hide skeleton + + +

  // Define
  const cssHide = { opacity: 0, display: 'none', pointerEvents: 'none' };
  const cssShow = {
    opacity: 1,
    display: 'block',
    pointerEvents: 'auto',
  };

  // GSAP
  let progress = 1;
  if (state.gsap) {
    progress = state.gsap.progress();
    state.gsap.kill();
  }
  const tl = gsap.timeline({ paused: true });
  state.gsap = tl;

  // Loop
  const skeletons: HTMLElement[] = [];
  list.childNodes.forEach((item: any) => {
    // Elements
    const skeleton: HTMLElement | null =
      item.querySelector('[c-el="skeleton"]');

    // Push
    if (skeleton) skeletons.push(skeleton);
  });

  // Animate
  tl.fromTo(
    skeletons,
    showSkeleton ? cssHide : cssShow,
    showSkeleton
      ? { ...cssShow, duration: skeletonFadeDuration, ease: 'power1.inOut' }
      : { ...cssHide, duration: skeletonFadeDuration, ease: 'power1.inOut' }
  );

  // Play
  tl.progress(1 - progress);
  tl.play();

  // + + + Render function + + +
  function render() {
    // Clear content
    list.innerHTML = '';

    // Data
    data.items.forEach((_: any, index: number) => {
      // Elements
      const clone = template.cloneNode(true) as HTMLElement;

      // Manipulate
      const res = renderCard(clone, index);

      // Append
      if (res !== false) list.append(clone);
    });
  }
}
