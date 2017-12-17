import * as actions from './actions';
import createFormReducer, { createInitalState, createFieldReducer } from './reducers';

const fields = [
  'email',
  {
    name: 'age',
    optional: true,
  },
];

const formName = 'loginForm';
const fieldName = 'email';
const loginForm = createFormReducer(formName, fields);
const emailReducer = createFieldReducer(fieldName, createInitalState());

describe('Form reducer', () => {
  const state = {
    email: createInitalState(),
    age: createInitalState(true),
  };
  it('shoulf have initial state', () => {
    expect(loginForm(undefined, {})).toEqual(state);
  });

  it('should not change when form name do not match', () => {
    const action = actions.setFieldValue('registerForm')('gender', 'female');
    const nextState = {
      email: createInitalState(),
      age: createInitalState(true),
    };
    expect(loginForm(state, action)).toEqual(nextState);
  });
});


describe('Field reducer', () => {
  const state = createInitalState();

  it('should have initial state', () => {
    expect(emailReducer(undefined, {})).toEqual(createInitalState());
  });

  it('should not change if fieldname do not match', () => {
    const action = actions.setFieldValue(formName)('age', '23');
    const nextState = createInitalState();
    expect(emailReducer(state, action)).toEqual(nextState);
  });

  it('should handle SET_FIELD_VALUE', () => {
    const value = 'iiwolf@uc.cl';
    const action = actions.setFieldValue(formName)(fieldName, 'iiwolf@uc.cl');
    const nextState = Object.assign({}, state, {
      value,
      touched: true,
      error: null,
    });
    expect(emailReducer(state, action)).toEqual(nextState);
  });

  it('should handle CLEAR_FIELD', () => {
    const action = actions.clearField(formName)(fieldName);
    const nextState = Object.assign({}, state, {
      value: '',
      touched: false,
      error: null,
      valid: false,
    });
    expect(emailReducer(state, action)).toEqual(nextState);
  });

  it('should handle VALIDATION_SUCCESS', () => {
    const action = actions.validationSuccess(formName)(fieldName);
    const nextState = Object.assign({}, state, {
      error: null,
      valid: true,
    });
    expect(emailReducer(state, action)).toEqual(nextState);
  });

  it('shoulf handle VALIDATION_ERROR', () => {
    const error = 'Email already token';
    const action = actions.validationError(formName)(fieldName, error);
    const nextState = Object.assign({}, state, {
      error,
      valid: false,
    });
    expect(emailReducer(state, action)).toEqual(nextState);
  });
});
