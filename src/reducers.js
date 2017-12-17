import { combineReducers } from 'redux';
import {
  SET_FIELD_VALUE,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  CLEAR_FIELD,
} from './types';

export const createInitalState = (optional = false) => ({
  value: '',
  error: null,
  touched: false,
  valid: false,
  optional,
});


/* state is the initialState created above */
export const createFieldReducer = (fieldName, initialState) => {
  const value = (state = initialState.value, action) => {
    switch (action.type) {
      case SET_FIELD_VALUE:
        return action.payload.value;
      case CLEAR_FIELD:
        return '';
      default:
        return state;
    }
  };

  const error = (state = initialState.error, action) => {
    switch (action.type) {
      case VALIDATION_ERROR:
        return action.error;
      case CLEAR_FIELD:
      case VALIDATION_SUCCESS:
      case SET_FIELD_VALUE:
        return null;
      default:
        return state;
    }
  };

  const touched = (state = initialState.touched, action) => {
    switch (action.type) {
      case SET_FIELD_VALUE:
        return true;
      case CLEAR_FIELD:
        return false;
      default:
        return state;
    }
  };

  const optional = (state = initialState.optional, action) => state;

  const valid = (state = initialState.valid, action) => {
    switch (action.type) {
      case VALIDATION_SUCCESS:
        return true;
      case VALIDATION_ERROR:
        return false;
      case CLEAR_FIELD:
        return false;
      default:
        return state;
    }
  };

  return (state, action) => {
    if (action.meta && action.meta.fieldName !== fieldName) return state;
    return combineReducers({
      value,
      error,
      touched,
      valid,
      optional,
    })(state, action);
  };
};

/*
const fields = [
  'name',
  'gender',
  {
    name: 'age',
    optional: true,
  },
]
*/

const createFormReducer = (formName, fields) => {
  const reducers = {};
  const initalState = {};

  fields.forEach((key) => {
    if (typeof key === 'string') {
      initalState[key] = createInitalState();
      reducers[key] = createFieldReducer(key, createInitalState());
    } else {
      initalState[key.name] = createInitalState(key.optional);
      reducers[key.name] = createFieldReducer(key.name, createInitalState(key.optional));
    }
  });

  return (state, action) => {
    if (action.meta && formName !== action.meta.formName) return state;
    return combineReducers(reducers)(state, action);
  };
};

export default createFormReducer;
