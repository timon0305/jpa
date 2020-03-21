import {createAction, createActions, handleActions} from 'redux-actions';
import Actions from '../constants/ReduxActionTypes'
import produce from 'immer';

// Define actions and reducers
const login = createAction(Actions.LOGIN,
  (username, password, rememberme) => ({username, password, rememberme})
);

const {logout,loginSuccess, loginFailed, refreshToken, refreshTokenSuccess, refreshRolesStart, refreshRolesSuccess, profileUpdated} =
  createActions({}, Actions.LOGOUT, Actions.LOGIN_SUCCESS, Actions.LOGIN_FAILED, Actions.REFRESH_TOKEN, Actions.REFRESH_TOKEN_SUCCESS, Actions.REFRESH_ROLES, Actions.REFRESH_ROLES_SUCCESS, Actions.PROFILE_UPDATED);


const reducer = handleActions(
  {
    [Actions.LOGIN] : (state, action) => ({isLoggingIn: true, isAuthenticated:false}),
    [Actions.LOGIN_SUCCESS] : (state, {payload}) => ({isLoggingIn: false, ...payload.toState()}),
    [Actions.LOGIN_FAILED] : (state, action) => ({isLoggingIn: false, isAuthenticated: false}),
    [Actions.LOGOUT] : (state, action) => ({isLoggingIn: false, isAuthenticated: false}),
    [Actions.REFRESH_TOKEN] : undefined,
    [Actions.REFRESH_TOKEN_SUCCESS] : (state, {payload}) => ({...state, ...payload.toState()}),
    [Actions.REFRESH_ROLES] : (state, _) => (state),
    [Actions.REFRESH_ROLES_SUCCESS]: (state, {payload}) =>
      (produce(state, s => {
        s.profile.roles = payload
      })),
    // Currently support firstName & lastName update support
    [Actions.PROFILE_UPDATED]: (state, {payload: {firstName, lastName}}) => (
      produce(state, s => {
        s.profile.firstName = firstName;
        s.profile.lastName = lastName;
      })
    )
  }, {isLoggingIn: false, isAuthenticated: false}
);

const selector = (state) => (state.auth);

export {
  login,
  logout,
  loginSuccess,
  loginFailed,
  refreshToken,
  refreshTokenSuccess,
  refreshRolesStart,
  refreshRolesSuccess,
  profileUpdated,
  reducer,
  selector,
}
