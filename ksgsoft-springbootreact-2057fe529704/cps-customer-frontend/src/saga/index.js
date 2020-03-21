import {all, call, take, takeLatest,takeEvery, put} from 'redux-saga/effects';
import API from '../service/RestApi';
import Actions from '../constants/ReduxActionTypes';
import authHook from './AuthHookSaga';
import login from './LoginSaga';
import callApi from './ApiSaga';
import refreshRoles from './RolesSaga';
import {LOCATION_CHANGE} from 'connected-react-router'
import {resetLoading} from '../redux/LoadingIndicatorRedux';
const api = API.instance();

function * logger(){
  while(true){
    const action = yield take('*');
    console.log(action);
  }
}

let previousRoute = undefined;
function * resetLoaderSaga(action){
  const {payload:{location:{pathname}}} = action;
  if (previousRoute !== pathname){
    yield put(resetLoading());
  }
  previousRoute = pathname;
}

// Root Saga
export default function * root () {
  yield all([
    // Authorization Hook
    call(authHook),

    // Login
    takeLatest(Actions.LOGIN, login),

    // use callApi saga for api call redux.
    takeEvery(Actions.CALL_API, callApi, api),

    //call(logger),

    // Whenever location changes, trigger reset loader action.
    takeLatest(LOCATION_CHANGE, resetLoaderSaga),

    //takeLatest(Actions.REFRESH_ROLES, refreshRoles)
  ])
}
