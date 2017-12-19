# redux-simple-form

A redux [duck](https://github.com/erikras/ducks-modular-redux) to manage your form state in the store. 

## Motvation

Sometimes you need to save form state after the component unmount or  another component must watch changes in the form state.

Also you have to be able to run validations in order to submit the form.

This duck is an abtraction wich provides useful methods to change a value, clear the field, run validations and handle the form submition.

## Simple usage

```bash
$ yarn add redux-simple-form
```
```javascript
import { combineReducers } from 'redux';
import createFormReducer from 'redux-simple-form';

const fields = [
  'email',
  { name: 'age', optional: true },
];

const simpleForm = createFormReducer('simpleForm', fields);

export default combineReducers({
  simpleForm,
});
```
This creates a reducer which initial state looks like 
```javascript
{
  simpleForm: {
    email: {
      value: '',
      error: null,
      touched: false,
      valid: false,
      optional: false
    },
    age: { 
      value: '',
      error: null,
      touched: false,
      valid: false,
      optional: true
    }
  }
}
```
Now you can do stuff
```javascript
import { setFieldValue, clearField, runValidator, submitForm } from 'readux-simple-form';

store.dispatch(setFieldValue('simpleForm')('email', 'ivanwolf15@gmail.com');

/* new shape
  email: {
    value: 'ivanwolf15@gmail.com',
    error: null,
    touched: true,
    valid: false,
    optional: false
  }
*/
```

## API

### createFormReducer
**(formName:string, fields: []) => Reducer**

Main function, create a new redux reducer.
The formName **must** be equal to the key wich stores this part of the state. Creates an slice for each item in the array passed as second argument. 

### setFieldValue
**(formName) => (fieldName, value) => Action**

Dispatch this action in order to change the value of fieldName in the formName form. Returns an object action.
```javascript
{
  type: SET_FIELD_VALUE,
  payload: {
    value,
  },
  meta: {
    formName,
    fieldName,
  },
}
```

### clearField
**(formName) => (fieldName) => Action**

Dispatch this action in order to reset fieldName in the formName form. Returns an object action.
```javascript
{
  type: CLEAR_FIELD,
  meta: {
    formName,
    fieldName,
  },
}
```

### runValidator
**(formName, selector?) => (fieldName, validator) => Action**

This thunk validates the field found in the global state using the selector if one is provided `selector(getState())[formName]` or `getState()[formName]`. 

To determine if the field is valid a validator function must be provided. This function can be a promise based (to do async validation) or a simple function wich returns an error string when the field has errors or empty string when the field is valid.

#### validator
**(value: String) => Error:String || Empty:String'**
Example
```javascript
const validator = value => (
  !value ? "Field can't be empty" : ''
);
```
#### selector
**(state: Object) => subState:Object**
Example
```javascript
const selector = state => state.some.nesting
```

### submitForm
**(formNAme) => (onSubmit, onError) => null**

Calls the function onSubmit when all no optionals fields are valid. The fields values and dispatch function are passed as arguments to onSubmit callback. If there existe at least one error, onError is called with an error object and the dispatch function.

## Contribute
This project is under development. Pull request and ideas are welcome.

## License
MIT