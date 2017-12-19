import { validationSuccess, validationError } from './actions';

export { setFieldValue } from './actions';

/* extract values from fileds */
const values = (fields) => {
  const val = {};
  Object.keys(fields).forEach((key) => {
    val[key] = fields[key].value;
  });
  return val;
};

/* extract errors from fields */
const errors = (fields) => {
  const err = {};
  Object.keys(fields).forEach((key) => {
    err[key] = fields[key].error;
  });
  return err;
};

/* extract ${formName}'s fields from global state using a selector */
const getFields = (formName, selector, getState) => {
  if (selector && typeof selector !== 'function') {
    throw new Error('selector expected to be a function');
  }
  try {
    return selector ? selector(getState())[formName] : getState()[formName];
  } catch (err) {
    throw new Error(`There is no reducer called ${formName}`);
  }
};

const getValue = (fields, fieldName) => {
  const { value } = fields[fieldName];
  if (value !== undefined) return value;
  throw new Error(`Form has no ${fieldName} field`);
};


/**
 * Receive two functions onSubmit, onError, similar interface as promises.
 * Check if the form is valid (based on previus validation)
 * onSubmit function is called with the values and dispatch as arguments
 * onError function is called with the errors and dispatch as arguments
*/
export const submitForm = (formName, selector = null) => (onSubmit, onError) => (
  (dispatch, getState) => {
    const fields = getFields(formName, selector, getState);

    const validForm = Object.values(fields).reduce((valid, field) => (
      valid && (field.opional || field.valid)
    ), true);

    if (validForm) onSubmit(values(fields), dispatch);
    else onError(errors(fields), dispatch);
  }
);

export const validateField = (formName, selector = null) => (fieldName, validator) => (
  (dispatch, getState) => {
    const fields = getFields(formName, selector, getState);
    const value = getValue(fields, fieldName);
    const validationResult = validator(value);
    try {
      return validationResult
        .then(() => {
          dispatch(validationSuccess(formName)(fieldName));
        })
        .catch((error) => {
          dispatch(validationError(formName)(fieldName, error));
        });
    } catch (err) {
      if (validationResult) {
        dispatch(validationError(formName)(fieldName, validationResult));
      } else {
        dispatch(validationSuccess(formName)(fieldName));
      }
    }
  }
);

