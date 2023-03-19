'use strict';

const createHttpError = require('http-errors');
// const {
//   authUserActionsMiddleware,
//   authEditControl,
//   error,
// } = require('../authUserActionsMiddleware');
// jest.mock('../authUserActionsMiddleware', () => {
//   const originalModule = jest.requireActual('../authUserActionsMiddleware');

//   return {
//     ...originalModule,
//     authEditControl: jest.fn(),
//   };
// });
const auth = require('../authUserActionsMiddleware');
const { authUserActionsMiddleware, error } = auth;
jest.spyOn(auth, 'authEditControl');

describe('authUserActionsMiddleware function test', () => {
  const requriment = {
    params: { id: 'prueba' },
    userId: 'prueba',
    baseUrl: '/api/users',
  };
  const action = jest.fn();
  const actionNext = jest.fn();

  it("should returns normaly if url is '/api/users' and req.userId === req.params.id", async () => {
    const response = await authUserActionsMiddleware(action)(
      requriment,
      null,
      actionNext
    );
    expect(actionNext).toHaveBeenCalled();
  });

  it("should returns error if url is '/api/users' and req.userId !== req.params.id", async () => {
    const req2 = { ...requriment, userId: 'otra cosa' };

    const response = await authUserActionsMiddleware(action)(
      req2,
      null,
      actionNext
    );
    expect.assertions(1);
    expect(actionNext).toHaveBeenCalledWith(error());
  });

  it("should call authEditControl if url is not '/api/users' and method===PUT || DELETE", async () => {
    const req2 = { ...requriment, baseUrl: 'cosa', method: 'PUT' };
    console.log(req2);

    //const spy = jest.spyOn(authEditControl, '');
    console.log(auth.authEditControl);

    const response = await authUserActionsMiddleware(action)(
      req2,
      null,
      actionNext
    );
    //expect.assertions(2);
    // expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith(req2, action);
    expect(auth.authEditControl).toHaveBeenCalled();
  });
});
