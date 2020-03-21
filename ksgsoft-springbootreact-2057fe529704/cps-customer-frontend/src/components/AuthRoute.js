import React from 'react'
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import withSuspense from '../components/HOC/withSuspense';


class AuthRoute extends React.Component {
  static propTypes = {
    component: PropTypes.elementType.isRequired,
    exact: PropTypes.bool,
    path: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };

  static defaultProps = {
    exact: false
  };

  render() {
    const WrappedComponent = this.props.component;
    const checkPaths = ['/login', '/register'];
    const renderRedirect = this.props.authenticated ? checkPaths.includes(this.props.path) : !checkPaths.includes(this.props.path);
    const redirectUrl = this.props.authenticated ? '/dashboard' : '/login';

    return (
        <Route exact={this.props.exact}
               path={this.props.path}
               key = {this.props.key}
               name = {this.props.name}
               render={ () => (renderRedirect ? <Redirect to={redirectUrl}/> : <WrappedComponent />)
               }
        />
    )
  }
}

export default withSuspense(connect(
  (state) => ({ authenticated: state.auth.isAuthenticated || false})   // StateToProps
)(AuthRoute))
