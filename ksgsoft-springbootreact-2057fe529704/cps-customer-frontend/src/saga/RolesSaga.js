
import API from '../service/RestApi';
import {refreshRolesSuccess} from "../redux/AuthRedux";
import {put, call} from 'redux-saga/effects';

//TODO - Do real api call.
export default function * refreshRoles(action) {
  const response = yield call(API.getRoles);
  if (response.ok && response.data){
    yield put(refreshRolesSuccess(response.data));
  }
}
