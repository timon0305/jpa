import React, {Component} from 'react';
import {Button, Card, CardBody, CardGroup, Col, Container, FormFeedback, FormGroup, Input, Label, Row} from 'reactstrap';
import ReCaptcha from 'react-recaptcha'
import {connect} from "react-redux";
import {showNotification} from "../../redux/NotificationRedux"
import {Type as NotificationType} from '../../constants/Notifications';
import {login} from "../../redux/AuthRedux";

import Loader from "../../components/Loader";
import "../../components/Loader/style.css"


function onChange(value) {
  console.log("Captcha value:", value);
}
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVerified: true,
      username: null,
      password: null,
      remember: false,
      isUsername: true,
      isPassword: true,
      isActive: false
    };
  }

  onloadCallback = () => {
    console.log("captcha is successfully");
  };

  verifyCallback = (response) => {
    if (response) {
      this.setState({
        isVerified: true
      })
    }
  };

  handleSubscribe = () => {
    if (this.state.username === null) {
      this.setState({isUsername: false});
      return false;
    } else {
      this.setState({isUsername: true})
    }

    if (this.state.password === null) {
      this.setState({isPassword: false});
      return false;
    } else {
      this.setState({isPassword: true})
    }

    if (!this.state.isVerified) {
      this.props.toast(NotificationType.WARNING, "Please verify that you are a human!");
    } else {
      this.props.login(this.state.username, this.state.password);
    }
  };

  handleKeyPress = (ev) => {
    if (ev.key === "Enter") {
      this.handleSubscribe();
    }
  };

  render() {
    return (
      <div className="app align-items-center" style={{height: 10}}>
        {this.props.isLoggingIn && <Loader fullPage loading/> }
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md="5">
              <img src='assets/img/logo.png' alt="dipvtel" width={'77%'} className="ml-5"/>
              <CardGroup className="mt-1">
                <Card className="p-4">
                  <CardBody>
                    <Label>Username</Label>
                    <Input type="text" onChange={(evt) => {this.setState({username: evt.target.value})}} invalid={!this.state.isUsername} onKeyPress={this.handleKeyPress}/>
                    {!this.state.isUsername ? <FormFeedback>Please input your username</FormFeedback> : ""}
                    <Label className="mt-4">Password</Label>
                    <Input type="password" onChange={(evt) => {this.setState({password: evt.target.value})}} invalid={!this.state.isPassword} onKeyPress={this.handleKeyPress}/>
                    {!this.state.isPassword ? <FormFeedback>Please input your password</FormFeedback> : ""}
                    {/*<div className="text-center" style={{marginTop: 20, marginLeft: 25}}>
                      <ReCaptcha
                        render="explicit"
                        sitekey="6LfEqngUAAAAADtqVhY2IKUQl0lKbL-In_AWPPe8"
                        onloadCallback={this.onloadCallback}
                        verifyCallback={this.verifyCallback}
                        theme="light"
                        type="image"
                        onChange={onChange}
                      />
                    </div>*/}
                    <Row className="mt-4">
                      <Col xs="6">
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" onChange={(evt) => {this.setState({remember: evt.target.checked})}}/> Remember me
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button size="md" color="primary" onClick={this.handleSubscribe}><strong className="text-white">Sign In</strong></Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>

      </div>
    );
  }
}

export default connect(
  (state) => ({
    isLoggingIn: state.auth.isLoggingIn || false
  }),
  (dispatch) => ({
    toast:(type, message) => dispatch(showNotification(type, message)),
    login:(username, password) => dispatch(login(username, password))
  }))(Login);
