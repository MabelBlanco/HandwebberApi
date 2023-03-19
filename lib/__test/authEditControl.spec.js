'use strict';

const createHttpError = require('http-errors');
const { authEditControl } = require('../authUserActionsMiddleware');

describe('authEditControl function tests', () => {
  const requriment = {
    params: { id: 'identificador' },
    userId: 'prueba',
    baseUrl: '/api/users',
  };
  const actionAccepted = jest.fn().mockResolvedValue('prueba');
  const actionAcceptedDifferent = jest.fn().mockResolvedValue('otra-cosa');
  const actionRejected = jest.fn().mockRejectedValue('otra-cosa');

  it('should return true if the action returns the same value that requeriment.userId', async () => {
    const response = await authEditControl(requriment, actionAccepted);
    expect.assertions(1);
    expect(response).toBeTruthy();
  });

  it('should return false if the action returns a different value that requeriment.userId', async () => {
    const response = await authEditControl(requriment, actionAcceptedDifferent);
    expect.assertions(1);
    expect(response).toBeFalsy();
  });

  it("should return error if there's any problem with the function passed to control the owner", async () => {
    try {
      const response = await authEditControl(requriment, actionRejected);
    } catch (error) {
      expect.assertions(3);
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
      expect(error.message).toBe('Error server authenticating user property');
    }
  });
});
