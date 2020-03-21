import axios from 'axios';
import qs from 'qs';

const apiUrl = process.env.REACT_APP_API_POINT;

const numberSearch = (data) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url: apiUrl + "api/v1/somos/send",
  };
  return axios(options);
};

const sendNew = (data) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data),
    url: apiUrl + "api/v1/somos/send_new",
  };
  return axios(options);
};


export default {
  numberSearch,
  sendNew,
}


