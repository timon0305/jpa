const actionTypes = {
  // AUTHENTICATION RELATED.
  LOGIN: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN: 'REFRESH_TOKEN_START',
  REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
  PROFILE_UPDATED:'PROFILE_UPDATED',

  REFRESH_ROLES_SUCCESS: 'REFRESH_ROLES_SUCCESS',

  // GENERIC API CALLING
  CALL_API: 'CALL_API',

  // IN-APP NOTIFICATION
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',

  // LOADING INDICATOR
  SHOW_LOADING: 'SHOW_LOADING',
  HIDE_LOADING: 'HIDE_LOADING',
  RESET_LOADING: 'RESET_LOADING',
};

export default actionTypes;