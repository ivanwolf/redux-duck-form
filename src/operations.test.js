import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as operations from './operations';
import { validationError, validationSuccess } from './actions';
import createFormReducer, { createInitalState } from './reducers';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Validate field', () => {
  const formName = 'loginForm';
  const fieldName = 'email';

  const fields = ['email'];
  const reducer = createFormReducer(formName, fields);
  const initialState = {
    [formName]: {
      [fieldName]: createInitalState(),
    },
  };

  describe('Promise based validor', () => {
    it('should dispatch VALIDATION_ERROR on reject promise', async () => {
      const errorMsg = 'Validation errror message';

      const store = mockStore(initialState);
      const validator = () => Promise.reject(errorMsg); // Simulate a bad value

      await store.dispatch(operations.validateField(formName)(fieldName, validator));

      const expectedAction = validationError(formName)(fieldName, errorMsg);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });

    it('should dispatch VALIDATION_SUCCESS on resolve promise', async () => {
      const store = mockStore(initialState);
      const validator = () => Promise.resolve(); // Simualte a good validation

      await store.dispatch(operations.validateField(formName)(fieldName, validator));

      const expectedAction = validationSuccess(formName)(fieldName);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });
  });

  describe('Non promise validator', () => {
    it('should dispatch VALIDATION_ERROR when validator returns a string', () => {
      const errorMsg = 'Validation errror message';
      const store = mockStore(initialState);
      const validator = () => errorMsg;
      store.dispatch(operations.validateField(formName)(fieldName, validator));
      const expectedAction = validationError(formName)(fieldName, errorMsg);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });

    it('should dispatch VALIDATION_SUCCESS when validator returs empty string', () => {
      const store = mockStore(initialState);
      const validator = () => '';
      store.dispatch(operations.validateField(formName)(fieldName, validator));
      const expectedAction = validationSuccess(formName)(fieldName);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });
  });
});
