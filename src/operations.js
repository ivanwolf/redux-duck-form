import * as actions from './actions';

/* extract values from fileds */
const values = (fields) => {
  const values = {};
  Object.keys(fields).forEach((key) => {
    values[key] = fields[key].value;
  });
  return values;
};

/* extract errors from fields */
const erros = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    errors[key] = fields[key].error;
  });
  return errors;
};


const setFieldValue = actions.setFieldValue;

/* Receive two functions similar interface as promises */
export const submitForm = (formName, selector = null) => (onSubmit, onError) => (
  (dispatch, getState) => {
    if (selector && typeof selector !== 'function') {
      throw new Error('selector expected to be a function');
    }
    try {
      const fields = selector ? selector(getState())[formName] : getState()[formName];
    } catch (err) {
      throw new Error(`There is no reducer called ${formName}`);
    }
    onSubmit(values(fields));
  }
)

