/* eslint no-undef: 0 */
import * as actions from '../src/actions';
import * as types from '../src/types';

describe('Action creators', () => {
  const formName = 'loginForm';
  const fieldName = 'email';
  const error = 'Email already token';
  const value = 'iiwolf@uc.cl';
  it('it should create an action to set field value from given form', () => {
    const action = {
      type: types.SET_FIELD_VALUE,
      payload: {
        value,
      },
      meta: {
        formName,
        fieldName,
      },
    };
    expect(actions.setFieldValue(formName)(fieldName, value)).toEqual(action);
  });

  it('it should create an action to succesfuly validate a field', () => {
    const action = {
      type: types.VALIDATION_SUCCESS,
      meta: {
        formName,
        fieldName,
      },
    };
    expect(actions.validationSuccess(formName)(fieldName)).toEqual(action);
  });

  it('it should create an action to reject a field', () => {
    const action = {
      type: types.VALIDATION_ERROR,
      meta: {
        formName,
        fieldName,
      },
      error,
    };
    expect(actions.validationError(formName)(fieldName, error)).toEqual(action);
  });

  it('it should create an action to to clear a field', () => {
    const action = {
      type: types.CLEAR_FIELD,
      meta: {
        formName,
        fieldName,
      },
    };
    expect(actions.clearField(formName)(fieldName)).toEqual(action);
  });
});
