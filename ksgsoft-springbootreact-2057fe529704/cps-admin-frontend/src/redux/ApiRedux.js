import {createAction, handleAction} from 'redux-actions'
import Actions from '../constants/ReduxActionTypes'

// Example of calling api
/**
 let callAction = action(API.createRole, req, (result) => {
    // Process result here
  });
 this.props.dispatch(callAction);

 // API is needed as first parameter to set correct authentication token.
 **/

const callApi = createAction(
  Actions.CALL_API,
  (method, callback, ...args) => ({method, callback, args})
);

const reducer = handleAction(Actions.CALL_API, undefined, {});

export {
  callApi,
  reducer,
}


