// + Imports +

// Custom
import * as config from '../../config';
import * as utils from './utils';
import renderCard from './renderCard';
import * as model from '../../model';

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
    if (typeof data?.items?.length !== 'number')
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

    // Show total results
    state.elements.totalResults.forEach((el: HTMLElement, index: number) => {
      // Render
      el.innerHTML = data.itemsTotal;
      const plural = state.elements.totalResultsPlural[index];
      if (data.itemsTotal !== 1) plural.style.display = '';
      else plural.style.display = 'none';
    });

    // Empty state
    if (data.itemsTotal > 0) state.elements.emptyState.style.display = 'none';
    else state.elements.emptyState.style.display = 'flex';

    // Pagination
    if (data.pageTotal < 2) state.elements.emptyState.style.display = 'none';
    else {
      initPagination();
      state.elements.paginationWrapper.style.display = 'flex';
    }

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

  // + + + Pagination function + + +
  function initPagination() {
    // Elements
    const wrapper: HTMLElement = state.elements.paginationWrapper;
    const textTemplate: HTMLElement = state.elements.paginationNumberTemplate;

    // Clear
    wrapper.innerHTML = '';

    // Access pagination data (assuming you have this data available)
    const currentPage: number = data.curPage;
    const nextPage: number = data.nextPage;
    const prevPage: number = data.prevPage;
    const totalPages: number = data.pageTotal;

    // Number of page buttons to show before and after the ellipsis
    const pagesBeforeEllipsis = 2; // Adjust this value
    const pagesAfterEllipsis = 2; // Adjust this value

    // Create pagination elements
    if (totalPages > 1) {
      // Create a "Previous" button if there's a previous page
      if (prevPage) {
        const prevButton = textTemplate.cloneNode(true) as HTMLElement;
        prevButton.classList.add('cc-prev');
        prevButton.textContent = 'Vorherige';
        prevButton.addEventListener('click', () => goToPage(prevPage));
        wrapper.appendChild(prevButton);
      }

      // Create page number buttons
      if (totalPages <= pagesBeforeEllipsis + pagesAfterEllipsis + 1) {
        // Display all page buttons if there are fewer pages than the total number of buttons to show
        for (let page = 1; page <= totalPages; page++) {
          createPageButton(page);
        }
      } else {
        // Determine which page numbers to display with ellipsis
        const pagesToDisplay = [];

        if (currentPage <= pagesBeforeEllipsis + 1) {
          // Display pages 1 to (2 * pagesBeforeEllipsis + 1) when current page is near the beginning
          for (let page = 1; page <= 2 * pagesBeforeEllipsis + 1; page++) {
            createPageButton(page);
          }
          addEllipsis();
        } else if (currentPage >= totalPages - pagesAfterEllipsis) {
          // Display pages (totalPages - 2 * pagesAfterEllipsis) to totalPages when current page is near the end
          addEllipsis();
          for (
            let page = totalPages - 2 * pagesAfterEllipsis;
            page <= totalPages;
            page++
          ) {
            createPageButton(page);
          }
        } else {
          // Display pages before and after the current page with ellipsis in between
          addEllipsis();
          for (
            let page = currentPage - pagesBeforeEllipsis;
            page <= currentPage + pagesAfterEllipsis;
            page++
          ) {
            createPageButton(page);
          }
          addEllipsis();
        }
      }

      // Create a "Next" button if there's a next page
      if (nextPage) {
        const nextButton = textTemplate.cloneNode(true) as HTMLElement;
        nextButton.classList.add('cc-next');
        nextButton.textContent = 'Nächste';
        nextButton.addEventListener('click', () => goToPage(nextPage));
        wrapper.appendChild(nextButton);
      }
    }

    // Function to create a page number button
    function createPageButton(page: number) {
      const pageNumberButton = textTemplate.cloneNode(true) as HTMLElement;
      pageNumberButton.textContent = page.toString();

      if (page === currentPage) {
        pageNumberButton.classList.add('cc-current'); // Highlight the current page
      }

      pageNumberButton.addEventListener('click', () => goToPage(page));
      wrapper.appendChild(pageNumberButton);
    }

    // Function to add an ellipsis button
    function addEllipsis() {
      const ellipsisButton = textTemplate.cloneNode(true) as HTMLElement;
      ellipsisButton.classList.add('cc-ellipsis');
      ellipsisButton.textContent = '...';
      ellipsisButton.classList.add('ellipsis'); // Add a class for styling ellipsis
      wrapper.appendChild(ellipsisButton);
    }

    // Function to handle page navigation
    function goToPage(page: number) {
      // Implement your logic to navigate to the selected page
      // For example, you can update the UI to display the selected page's content
      // or trigger a data fetch for the new page's data.
      state.filters.addParams('seite', page.toString());
    }
  }
}
