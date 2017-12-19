import createFormReducer, {
  runValidator,
  setFieldValue,
  submitForm,
  clearField,
} from '../src';

import * as actions from '../src/actions';
import * as operations from '../src/operations';
import mainFunction from '../src/reducers';

describe('Exported functions', () => {
  it('should export createFormReducer as default', () => {
    expect(createFormReducer).toBe(mainFunction);
  })
  it('should export clearField, setFieldValue from actions', () => {
    expect(setFieldValue).toBe(actions.setFieldValue);
    expect(clearField).toBe(actions.clearField);
  });
  it('should export runValidator, submitForm from operations', () => {
    expect(runValidator).toBe(operations.runValidator);
    expect(submitForm).toBe(operations.submitForm);
  });
});

