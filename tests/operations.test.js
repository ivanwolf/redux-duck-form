/* eslint no-undef: 0 */
import { combineReducers } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { runValidator, submitForm, setFieldValue, getFields } from '../src/operations';
import { validationError, validationSuccess } from '../src/actions';
import createFormReducer, { createInitalState } from '../src/reducers';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const formName = 'loginForm';
const fieldName = 'email';
const otherFieldName = 'gender';

describe('getFields', () => {
  const initialState = {
    some: {
      nesting: {
        [formName]: {
          [fieldName]: createInitalState(),
          [otherFieldName]: createInitalState(),
        },
      },
    },
  };
  it('should be able to use a selector', () => {
    const store = mockStore(initialState);
    const selector = state => state.some.nesting;
    expect(getFields(formName, selector, store.getState)).toEqual({
      [fieldName]: createInitalState(),
      [otherFieldName]: createInitalState(),
    });
  });
  it('throw error if reducer is not found', () => {
    const store = mockStore(initialState);
    const selector = state => state.some;
    try {
      getFields(formName, selector, store.getState);
    } catch (err) {
      expect(err).toEqual(new Error(`There is no reducer called ${formName}`));
    }
  });
});

describe('Submit form', () => {
  const initialState = {
    [formName]: {
      [fieldName]: createInitalState(),
      [otherFieldName]: createInitalState(),
    },
  };
  const reducer = combineReducers({
    [formName]: createFormReducer(formName, [fieldName, otherFieldName]),
  });

  const acceptValidator = () => Promise.resolve();
  const rejectValidator = () => 'Email already token';

  describe('All fields are valid', () => {
    const onSubmit = jest.fn();
    const onError = jest.fn();
    let store;
    beforeEach(async () => {
      /* Create a correct form state */
      const prevStore = mockStore(initialState);
      prevStore.dispatch(setFieldValue(formName)(fieldName, 'ivan@uc.cl'));
      await prevStore.dispatch(runValidator(formName, null)(fieldName, acceptValidator));
      prevStore.dispatch(setFieldValue(formName)(otherFieldName, 'male'));
      await prevStore.dispatch(runValidator(formName, null)(otherFieldName, acceptValidator));
      const acceptState = prevStore.getActions().reduce(reducer, initialState);
      // console.log(acceptState);
      store = mockStore(acceptState);
    });

    it('should call onSubmit', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onSubmit).toBeCalled();
    });
    it('should not call onError', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onError).not.toBeCalled();
    });
    it('should pass values as first argument', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onSubmit).toBeCalledWith({
        [fieldName]: 'ivan@uc.cl',
        [otherFieldName]: 'male',
      });
    });
  });
  describe('Al least one field is not valid', () => {
    let store;
    const onSubmit = jest.fn();
    const onError = jest.fn();
    beforeEach(async () => {
      /* Create an incorrect form state */
      const prevStore = mockStore(initialState);
      prevStore.dispatch(setFieldValue(formName)(fieldName, 'ivan@uc.cl'));
      await prevStore.dispatch(runValidator(formName, null)(fieldName, rejectValidator));
      prevStore.dispatch(setFieldValue(formName)(otherFieldName, 'male'));
      await prevStore.dispatch(runValidator(formName, null)(otherFieldName, acceptValidator));
      const acceptState = prevStore.getActions().reduce(reducer, initialState);
      store = mockStore(acceptState);
    });
    it('should call onError', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onError).toBeCalled();
    });
    it('should not call onSubmit', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onSubmit).not.toBeCalled();
    });
    it('should pass errors as first argument', () => {
      store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(onError).toBeCalledWith({
        [fieldName]: 'Email already token',
        [otherFieldName]: null,
      });
    });
  });
  describe('No field has been touched', () => {
    it('should dispatch VALIDATION_ERROR on required fields', async () => {
      const store = mockStore(initialState);
      const requiredMessage = 'This field is required';
      const expectedActions = [
        validationError(formName)(fieldName, requiredMessage),
        validationError(formName)(otherFieldName, requiredMessage),
      ];
      const onSubmit = jest.fn();
      const onError = jest.fn();
      await store.dispatch(submitForm(formName)(onSubmit, onError));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Validate field', () => {
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

      await store.dispatch(runValidator(formName)(fieldName, validator));

      const expectedAction = validationError(formName)(fieldName, errorMsg);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });

    it('should dispatch VALIDATION_SUCCESS on resolve promise', async () => {
      const store = mockStore(initialState);
      const validator = () => Promise.resolve(); // Simualte a good validation

      await store.dispatch(runValidator(formName)(fieldName, validator));

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
      store.dispatch(runValidator(formName)(fieldName, validator));
      const expectedAction = validationError(formName)(fieldName, errorMsg);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });

    it('should dispatch VALIDATION_SUCCESS when validator returs empty string', () => {
      const store = mockStore(initialState);
      const validator = () => '';
      store.dispatch(runValidator(formName)(fieldName, validator));
      const expectedAction = validationSuccess(formName)(fieldName);
      const actions = store.getActions();
      expect(actions).toEqual([expectedAction]);
    });
  });
});

