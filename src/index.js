import createFormReducer from './reducers';
import * as simpleFormTypes from './types';
import * as simpleFormActions from './actions';
import * as simpleFormOperations from './operations';

export {
  simpleFormActions,
  simpleFormOperations,
  simpleFormTypes,
};

export default createFormReducer;
