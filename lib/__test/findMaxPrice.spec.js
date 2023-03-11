'use strict';

const findMaxPrice = require('../findMaxPrice');

describe.only('findMaxPrice tests', () => {
  it("should return the price when there's only one ad", () => {
    const ads = [
      {
        price: 25,
      },
    ];
    const result = findMaxPrice(ads);
    expect(result).toBe(ads[0].price);
  });
  it("should return the maximun price when there's more than one ad", () => {
    const ads = [
      {
        price: 50,
      },
      { price: 100 },
    ];
    const result = findMaxPrice(ads);
    expect(result).toBe(100);
  });
  it("should return 0 if there's no ads in the array", () => {
    const ads = [];
    const result = findMaxPrice(ads);
    expect(result).toBe(0);
  });
  it('should be 0 if ads is not an array', () => {
    const ads = 'hello';
    const result = findMaxPrice(ads);
    expect(result).toBe(0);
  });
});
