'use strict';

const findMaxPrice = (ads) => {
  if (!Array.isArray(ads)) {
    return 0;
  }
  const initialPrice = 0;

  const maxPrice = ads.reduce((lastMaxPrice, currentObject) => {
    if (currentObject.price > lastMaxPrice) {
      lastMaxPrice = currentObject.price;
    }
    return lastMaxPrice;
  }, initialPrice);
  return maxPrice;
};
module.exports = findMaxPrice;
