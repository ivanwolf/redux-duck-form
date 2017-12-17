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
const erros = (fields) => {
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
  const value = fields[fieldName];
  if (value !== undefined) return value;
  throw new Error(`Form has no ${fieldName} field`);
};


/* Receive two functions similar interface as promises */
export const submitForm = (formName, selector = null) => (onSubmit, onError) => (
  (dispatch, getState) => {
    const fields = getFields(formName, selector, getState);

    const validForm = Object.values(fields).reduce((valid, field) => (
      valid && (field.opional || field.valid)
    ), true);

    if (validForm) onSubmit(values(fields));
    else onError(values(fields));
  }
);

export const validateField = (formName, selector = null) => (fieldName, validator) => (
  async (dispatch, getState) => {
    const fields = getFields(formName, selector, getState);
    const value = getValue(fields, fieldName);
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) {
        dispatch(validationError(formName)(fieldName, error));
      } else {
        dispatch(validationSuccess(formName)(fieldName));
      }
    } else if (typeof validator.then === 'function') {
      try {
        await validator(value);
        dispatch(validationSuccess(formName)(fieldName));
      } catch (err) {
        dispatch(validationError(formName)(fieldName, err));
      }
    }
  }
);

