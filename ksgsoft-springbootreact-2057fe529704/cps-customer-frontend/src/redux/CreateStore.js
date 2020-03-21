import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import Credentials from '../service/Credentials';
import {createBrowserHistory} from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();


export default (rootReducer, rootSaga) => {
  const middleware = [];
  const enhancers = [];


  // Push router middleware
  middleware.push(routerMiddleware(history));


  // Saga Middleware
  const sagaMiddleWare = createSagaMiddleware();

  // Push saga middleware
  middleware.push(sagaMiddleWare);

  // Assemble Middleware
  enhancers.push(applyMiddleware(...middleware));

  // Create Store
  const store = createStore(
    rootReducer(history), {
      auth: Credentials.fromStorage().toState()
  },
    compose(...enhancers)
  );

  // Kickoff root saga
  const sagasManager = sagaMiddleWare.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleWare
  }
}
