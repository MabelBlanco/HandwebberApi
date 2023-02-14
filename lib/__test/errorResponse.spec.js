'use strict';

const createHttpError = require('http-errors');
const errorResponser = require('../errorResponseConfigure');

describe('errorResponse suite tests', () => {
  it('should return an object containing status and message when a createHttpError is passed', () => {
    const error = createHttpError(404, 'page not found');
    const errorExample = {
      status: error.status,
      message: error.message,
    };
    const errorObject = errorResponser(error);
    expect.assertions(1);
    expect(errorObject).toStrictEqual(errorExample);
  });

  it('should return an object containing status and message when an object with this configuration is passed', () => {
    const errorExample = {
      status: 500,
      message: 'Internal Server Error',
    };
    const errorObject = errorResponser(errorExample);
    expect.assertions(1);
    expect(errorObject).toStrictEqual(errorExample);
  });

  it('should return an object containing status:500 and message "Internal Server Error" when nothing is passed', () => {
    const errorExample = {
      status: 500,
      message: 'Internal Server Error',
    };
    const errorObject = errorResponser();
    expect.assertions(1);
    expect(errorObject).toStrictEqual(errorExample);
  });
});
