import {put, select, take} from 'redux-saga/effects';
import Actions from '../constants/ReduxActionTypes';
import {resetLoading} from "../redux/LoadingIndicatorRedux";
import Credentials from '../service/Credentials';
import {selector as authStateSelector} from '../redux/AuthRedux';

export default function * authHook(){
  while(true){
    const {type, payload } = yield take([Actions.LOGIN_SUCCESS, Actions.LOGOUT, Actions.REFRESH_TOKEN_SUCCESS]);
    try {
      if (type === Actions.LOGIN_SUCCESS) {
        // Payload is credential object in login_success action
        payload.save2Storage();

        // Change route with push action
        // No need to push, because AuthRoute component will automatically redirect.
        // yield put(push('/'));

      } else if (type === Actions.LOGOUT) {
        // Clear credentials storage
        Credentials.clearStorage();

        // Reset loading flag
        yield put(resetLoading());

        // Redirect to login url.
        // No need to push, because AuthRoute component will automatically redirect.
        // yield put(push('/login'));
      } else if (type === Actions.REFRESH_TOKEN_SUCCESS) {
        // Load auth state from store
        const authState = yield select(authStateSelector);

        // Save state to storage
        Credentials.fromState(authState).save2Storage();
      }
    }catch(e){}
  }
}
