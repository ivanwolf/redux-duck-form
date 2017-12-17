import {
  SET_FIELD_VALUE,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  CLEAR_FIELD,
} from './types';

const setFieldValue = formName => (fieldName, value) => ({
  type: SET_FIELD_VALUE,
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

const validationSuccess = formName => fieldName => ({
  type: VALIDATION_SUCCESS,
  meta: {
    formName,
    fieldName,
  },
});

const clearField = formName => fieldName => ({
  type: CLEAR_FIELD,
  meta: {
    formName,
    fieldName,
  },
});

export {
  setFieldValue,
  validationError,
  validationSuccess,
  clearField,
};
