import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import './App.scss';
// Containers
import AuthRoute from './components/AuthRoute';

import {history} from './redux/CreateStore';
import {ConnectedRouter} from 'connected-react-router';
import {ToastContainer, toast} from "react-toastify";
import {connect} from "react-redux";
import 'react-toastify/dist/ReactToastify.min.css'

const Layout = React.lazy(() => import('./views/Layout/Layout'));
const Login = React.lazy(() => import('./views/Login/Login'));


class App extends Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.notification.created !== prevProps.notification.created) {
      const message = this.props.notification.message;
      toast(message, { type: this.props.notification.type, position: this.props.notification.position});
    }
  }

  render() {
    return (
      <>
        <ConnectedRouter history={history}>
          <Switch>
            <AuthRoute exact path="/login" name="Login Page" component={Login} key="login"/>
            <AuthRoute path="/" name="Home" component={Layout} key="home"/>
          </Switch>
        </ConnectedRouter>
        <ToastContainer autoClose={2000} hideProgressBar/>
      </>
    );
  }
}

export default connect((state) => ({notification: state.notification}))(App);
