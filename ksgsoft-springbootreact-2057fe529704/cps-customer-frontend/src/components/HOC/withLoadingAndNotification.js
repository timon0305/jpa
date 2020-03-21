// Loading And Notification enhance
import React from 'react';
import Loader from "../Loader";
import {connect} from "react-redux";
import {Position} from "../../constants/Notifications";
import {showNotification} from "../../redux/NotificationRedux";
import {callApi} from "../../redux/ApiRedux";
import '../../components/Loader/style.css';
import {push} from 'connected-react-router';

export default function withLoadingAndNotification(WrappedComponent) {
  const component = (props) => (
    <div className="animated fadeIn">
      {props.loading && <Loader fullPage loading/>}
      <WrappedComponent {...props}/>
    </div>
  );

  // Return connected component
  return connect(
    (state) => ({loading: (state.loadingIndicator.counter > 0) }),
    (dispatch) => ({
      //showLoading: () => dispatch(showLoading()),     // Usually not used because call api all handles this.
      //hideLoading: () => dispatch(hideLoading()),     // Usually not used because call api all handles this.
      showNotification: (type, message, position = Position.TOP_RIGHT) => dispatch(showNotification(type, message, position)),
      callApi: (method, callback, ...args) => dispatch(callApi(method, callback, ...args)),   // Callback based
      // Promise based
      callApi2: (method, ...args) => new Promise((resolve, _) => {
        dispatch(callApi(method, resolve, ...args))
      }),
      // Move the other component
      navigate: (url) => dispatch(push(url))
    })
  )(component)
}

export function withAuthApiLoadingNotification(WrappedComponent) {
  return connect(
    state => ({auth: {privileges: state.auth.privileges, profile:state.auth.profile} })
  )(withLoadingAndNotification(WrappedComponent));
}

// Only shows loading overlay
export function withLoadingOverlay(WrappedComponent) {
  const component = (props) => (
    <div className="animated fadeIn">
      {props.loading && <Loader fullPage loading/>}
      <WrappedComponent {...props}/>
    </div>
  );
  return connect(
    (state) => ({loading: (state.loadingIndicator.counter > 0) }))(component)
}

// General sub components which use api call and show notification message
export function withApiCallAndNotification(WrappedComponent) {
  return connect(undefined, (dispatch) => ({
    //showLoading: () => dispatch(showLoading()),     // Usually not used because call api all handles this.
    //hideLoading: () => dispatch(hideLoading()),     // Usually not used because call api all handles this.
    showNotification: (type, message, position = Position.TOP_RIGHT) => dispatch(showNotification(type, message, position)),
    callApi: (method, callback, ...args) => dispatch(callApi(method, callback, ...args)),   // Callback based
    // Promise based
    callApi2: (method, ...args) => new Promise((resolve, _) => {
      dispatch(callApi(method, resolve, ...args))
    })
  }))(WrappedComponent);
}
