import apisauce from 'apisauce';
import qs from 'qs'

const instance = (baseURL = process.env.REACT_APP_API_POINT) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  return apisauce.create({
    // base URL is read from the "constructor"
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 30000

  });
};

// Define api functions.

//login
const login = (api, username, password) => api.post('/session/login', {username, password});
const refreshToken = (api, token) => api.post('/session/refresh', {refreshToken: token});

const sendRequestNew = (api, req) => api.post('/somos/send_new', qs.stringify(req), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
const getReservedNumberList = (api, req) => api.post('/somos/reserved_numbers', req);

export default{instance, login, refreshToken, sendRequestNew, getReservedNumberList}

