import {call, put, race, take, select, fork, cancel} from 'redux-saga/effects';
import {showLoading, hideLoading} from "../redux/LoadingIndicatorRedux";
import {Type as NotificationType} from '../constants/Notifications';
import {showNotification} from "../redux/NotificationRedux";
import {selector as authStateSelector} from '../redux/AuthRedux';
import {logout, refreshTokenSuccess} from '../redux/AuthRedux';
import Credentials from "../service/Credentials";
import API from '../service/RestApi';
import Actions from '../constants/ReduxActionTypes';

/**
 APISAUCE response documentation
 The responses are promise-based, so you'll need to handle things in a .then() function.
 The promised is always resolved with a response object.
 Even if there was a problem with the request! This is one of the goals of this library. It ensures sane calling code without having to handle .catch and have 2 separate flows.

 A response will always have these 2 properties:

 ok      - Boolean - True if the status code is in the 200's; false otherwise.
 problem - String  - One of 6 different values (see below - problem codes)

 If the request made it to the server and got a response of any kind, response will also have these properties:

 data     - Object - this is probably the thing you're after.
 status   - Number - the HTTP response code
 headers  - Object - the HTTP response headers
 config   - Object - the `axios` config object used to make the request
 duration - Number - the number of milliseconds it took to run this request

 Sometimes on different platforms you need access to the original axios error that was thrown:
 originalError - Error - the error that axios threw in case you need more info
 */

/**
 * Refresh Token
 * @param api
 * @param refreshToken
 * @returns {IterableIterator<*>}
 */
function * refreshToken(api, refreshToken) {
  // Call refresh api.
  const response = yield call(API.refreshToken, API.instance(), refreshToken);
  if (response.ok && response.data){
    const cred = Credentials.fromResponse(response.data);

    // Dispatch refresh token success action
    yield put(refreshTokenSuccess(cred));

  } else {
    // Trigger logout action.
    yield put(logout());
  }
}

/**
 * Call API SAGA
 * @param api
 * @param action
 * @returns {IterableIterator<*>}
 */
// Call api saga
export default function * callApi(api, action){
  /**
   * Make this always call callback of action payload, to use PROMISE pattern in action dispatcher functions
   */

    // This will be set to true when callback is called.
  let callbackCalledWithResponse = false;
  let apiCallback = action.payload.callback;

  try {
    // Select from state

    // Get Credentials from Store

    const cred = Credentials.fromState(yield select(authStateSelector));

    // Define action types that can stop api loading.
    const authActionsTypes = [Actions.LOGIN, Actions.LOGIN_SUCCESS, Actions.LOGIN_FAILED, Actions.LOGOUT];

    if (cred.isTokenValid()) {
      // Show loading indicator
      yield put(showLoading());

      // Set api header.
      api.setHeader('Authorization', 'Bearer ' + cred.token);

    } else if (cred.isRefreshTokenValid()) {

      // Show loading indicator
      yield put(showLoading());

      // fork refresh token
      const task = yield fork(refreshToken, api, cred.refresh);   // And don't cancel the task.

      // Listen for several actions dispatched...
      const {type, payload} = yield take([...authActionsTypes, Actions.RESET_LOADING, Actions.REFRESH_TOKEN_SUCCESS]);

      if (authActionsTypes.includes(type)) {
        // when logout action is dispatched, cancel refresh task.
        yield cancel(task);
        yield put(hideLoading());
        return;
      } else if (type === Actions.RESET_LOADING) {
        // User moved into another screen, so cancel loading.
        // Still wait for LOGOUT action or REFRESH_TOKEN_SUCCESS action. When one of them are dispatched, no need to continue api calling.
        yield take([...authActionsTypes, Actions.REFRESH_TOKEN_SUCCESS]);
        return;
      } else if (type === Actions.REFRESH_TOKEN_SUCCESS){
        // Get access token again. And this seems to be a valid token.
        api.setHeader('Authorization', 'Bearer ' + payload.token);
      }
    } else {

      // Dispatch logout action
      yield put(logout());

      // Display Session has expired.
      yield put(showNotification(NotificationType.ERROR, "Session Expired"));

      return;
    }

    const {method, args} = action.payload;

    const {cancelcall, response } = yield race({
      response: call(method, api, ...args),
      cancelcall: take([...authActionsTypes, Actions.RESET_LOADING]),   // When reset indicator is called, it means container UI has changed and should not call hideIndicator.
    });

    if (!response) return;

    // Only dispatch hideIndicator action when response is arrived from api call.
    yield put(hideLoading());

    // Let UI Perform updates.
    callbackCalledWithResponse = true;  // Set to true.
    apiCallback(response);

    // When unauthorized error occurred, logout.
    if (response.status === 401) {
      yield put(logout());

      // Display Session has expired.
      yield put(showNotification(NotificationType.ERROR, "Session Expired"));
      return;
    }

    // Process response and display notification message
    // Message generation logic
    let message = (response.data && response.data.msg) ||
      (!response.ok && (((response.status && response.status + " : ") || "") + response.problem));

    if (message) {
      const notificationType = response.ok ? NotificationType.SUCCESS : NotificationType.ERROR;
      if (response.ok) {
        message = ' ✓ ' + message;
      } else {
        message = ' ✗ ' + message;
      }

      // Dispatch show notification action
      yield put(showNotification(notificationType, message));
    }
  }finally {
    // When callback is not called, then call
    if (!callbackCalledWithResponse) {
      // Simulate like apisauce
      apiCallback({ok: false, problem: 'CANCEL_ERROR'})
    }
  }
}
