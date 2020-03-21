import {combineReducers} from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../saga/'
import { connectRouter } from 'connected-react-router'


export const reducers = (history) =>  combineReducers({
  router: connectRouter(history),
  api: require("./ApiRedux").reducer,
  loadingIndicator: require("./LoadingIndicatorRedux").reducer,
  notification: require('./NotificationRedux').reducer,
  auth: require('./AuthRedux').reducer,
});

export default () => {
  let { store, sagasManager, sagaMiddleware } = configureStore(reducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers(require('./CreateStore').history);
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../saga/').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      })
    })
  }
  return store;
}
