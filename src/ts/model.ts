// + Imports +

// Base
import { async } from 'regenerator-runtime';

// Custom
import * as config from './config';
import * as utils from './helper/model/utils';

// + Objects +

// State
export const state: any = {};

// + Functions +

// Initialize
export const init = async function () {
  try {
    // Add endpoints
    state.getProductData = async () => {
      const pageinate = parseInt(
        document
          .querySelector('[c-el="product-list"]')
          ?.getAttribute('data-paginate') || '6'
      );
      const res = await product(
        location.search.length
          ? location.search + `&paginate=${pageinate}`
          : `?paginate=${pageinate}`
      );
      state.productData = res;
      return res;
    };
    state.getSearchData = async (query = '') => {
      const res = await search(query);
      state.searchData = res;
      return res;
    };

    // Await initial data
    await state.getProductData();
  } catch (err) {
    throw 'model.ts -> init: ' + err;
  }
};

// Get product data
const product = async function (query = '') {
  try {
    // Await test data
    return await utils.getJson(config.PRODUCT_API_URL + query);
  } catch (err) {
    throw 'model.ts -> init: ' + err;
  }
};

// Get search data
const search = async function (query = '') {
  try {
    // Await test data
    return await utils.getJson(config.SEARCH_API_URL + query);
  } catch (err) {
    throw 'model.ts -> init: ' + err;
  }
};
