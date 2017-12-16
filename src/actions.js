import * as types from './types';

const setFieldValue = formName => (fieldName, value) => ({
  type: types.SET_FIELD_VALUE,
  payload: {
    value,
  },
  meta: {
    formName,
    fieldName,
  },
});

const validationError = formName => (fieldName, error) => ({
  type: VALIDATION_ERROR,
  meta: {
    formName,
    fieldName,
  },
  error,
});

const clearField = formName => fieldName => ({
  type: types.CLEAR_FIELD,
  meta: {
    formName,
    fieldName,
  },
});

export {
  setFieldValue,
  validationError,
  clearField,
};
