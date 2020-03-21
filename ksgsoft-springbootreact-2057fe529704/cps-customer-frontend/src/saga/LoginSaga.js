import {put, delay, call} from 'redux-saga/effects';
import API from '../service/RestApi';
import Credentials from "../service/Credentials";
import {Type as NotificationType} from '../constants/Notifications';
import {loginSuccess, loginFailed} from "../redux/AuthRedux";
import {showNotification} from "../redux/NotificationRedux";
export default function * login(action){
  const {username, password, rememberme} = action.payload;
  const api = API.instance();

  yield delay(200);

  const response = yield call(API.login, api, username, password);

  if (response.ok && response.data) {
    yield put(showNotification(NotificationType.SUCCESS, "Login Success"));

    // Delay 500ms.
    yield delay(500);

    // Dispatch login success message
    const cred = Credentials.fromResponse(response.data);

    // Delete refresh token if remember me is not ticked.
    if (!rememberme)
      cred.refresh = undefined;

    yield put(loginSuccess(Credentials.fromResponse(response.data)));

  } else {
    const message = (response.data && response.data.message) ||
      (!response.ok && (((response.status && response.status + " : ") || "") + response.problem));

    // Dispatch login fail.
    yield put(showNotification(NotificationType.ERROR, message));

    // Dispatch login failed action
    yield put(loginFailed());
  }
}
