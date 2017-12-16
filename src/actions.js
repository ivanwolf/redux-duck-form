import * as types from './types';

const setFieldValue = formName => (fieldName, value) => ({
  type: types.SET_FIELD_VALUE,
  payload: {
    formName,
    fieldName,
    value,
  },
});

const validationError = formName => (fieldName, error) => ({
  type: VALIDATION_ERROR,
  payload: {
    formName,
    fieldName,
    error,
  },
});

const clearField = formName => fieldName => ({
  type: types.CLEAR_FIELD,
  payload: {
    formName,
    fieldName,
  },
});

export {
  setFieldValue,
  validationError,
  clearField,
};
