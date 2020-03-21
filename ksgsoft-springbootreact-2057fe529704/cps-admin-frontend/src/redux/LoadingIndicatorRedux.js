/**
 * Reducer for api loading indicator
 * state : { counter : counter}
 * if counter > 0 : show indicator
 * if counter == 0 : hide indicator
 */

import {createActions, handleAction, combineActions} from 'redux-actions'
import Actions from '../constants/ReduxActionTypes'

// Define actions
const {showLoading, hideLoading, resetLoading} = createActions({
  [Actions.SHOW_LOADING]: () => 1, // Increase loading indicator show count
  [Actions.HIDE_LOADING]: () => -1,   // Decrease loading indicator show count.
  [Actions.RESET_LOADING]: () => -10000000       // Reset indicator
});

const reducer = handleAction(combineActions(showLoading, hideLoading, resetLoading), {
  // Increase or decrease counter
  next: (state, {type, payload}) => ({...state, counter: Math.max(state.counter + payload, 0)}),
  throw: state => ({ ...state, counter: 0})
}, {counter: 0});

export {showLoading, hideLoading, resetLoading, reducer};
