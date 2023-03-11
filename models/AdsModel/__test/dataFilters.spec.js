'use strict';

const request = require('supertest');
const assingSearchParameters = require('../dataFilters');

describe('assingSearchParameters test...', () => {
  it("should return object without util values, if there's not query params", () => {
    let req = {};
    req.query = {};
    const responseExpected = {
      filters: {},
      skip: undefined,
      limit: undefined,
      sort: undefined,
      fields: undefined,
    };
    const result = assingSearchParameters(req);
    expect(result).toMatchObject(responseExpected);
  });
  it('should return filters object if name || tag || price || idUser filters is aported in query params', () => {
    let req = {};
    req.query = {
      name: 'test',
      tag: 'testTag',
      price: '45',
      idUser: 'abcdef567',
    };

    const idUserProperty = 'idUser._id';
    const responseExpected = {
      filters: {
        name: {
          $options: 'i',
          $regex: req.query.name,
        },
        tags: {
          $options: 'i',
          $regex: req.query.tag.toLowerCase(),
        },
        price: 45,
        [idUserProperty]: req.query.idUser,
      },
      skip: undefined,
      limit: undefined,
      sort: undefined,
      fields: undefined,
    };
    const result = assingSearchParameters(req);
    expect(result).toMatchObject(responseExpected);
  });

  it('should return an object with skip property string, when skip is aported in query param', () => {
    let req = {};
    req.query = { skip: '3' };
    const responseExpected = {
      filters: {},
      skip: req.query.skip,
      limit: undefined,
      sort: undefined,
      fields: undefined,
    };

    const result = assingSearchParameters(req);
    expect(result.skip).toStrictEqual(req.query.skip);
    expect(result).toMatchObject(responseExpected);
  });

  it('should return an object with limit property string, when limit is aported in query param', () => {
    let req = {};
    req.query = { limit: '3' };
    const responseExpected = {
      filters: {},
      skip: undefined,
      limit: req.query.limit,
      sort: undefined,
      fields: undefined,
    };

    const result = assingSearchParameters(req);
    expect(result.limit).toStrictEqual(req.query.limit);
    expect(result).toMatchObject(responseExpected);
  });

  it('should return an object with sort property string, when sort is aported in query param', () => {
    let req = {};
    req.query = { sort: 'name' };
    const responseExpected = {
      filters: {},
      skip: undefined,
      limit: undefined,
      sort: req.query.sort,
      fields: undefined,
    };

    const result = assingSearchParameters(req);
    expect(result.sort).toStrictEqual(req.query.sort);
    expect(result).toMatchObject(responseExpected);
  });

  it('should return an object with fields property string, when fields is aported in query param', () => {
    let req = {};
    req.query = { fields: '%20-_id' };
    const responseExpected = {
      filters: {},
      skip: undefined,
      limit: undefined,
      sort: undefined,
      fields: req.query.fields,
    };

    const result = assingSearchParameters(req);
    expect(result.fields).toStrictEqual(req.query.fields);
    expect(result).toMatchObject(responseExpected);
  });
});
