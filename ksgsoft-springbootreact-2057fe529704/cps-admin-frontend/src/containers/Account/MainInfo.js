import React from 'react'
import {Card, Col, Collapse, Form, FormGroup, Label, Input} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";
import CardFormFooter from "../../components/Card/CardFormFooter";
import addInputGenerator from './addInput';
import {cardHeader} from "../../components/Card/CollapsibleCardHeader";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import validator from 'validator';

class MainInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      username: PropTypes.string,
      role: PropTypes.string,
      roleId: PropTypes.number,
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      emailError:PropTypes.string,
      usernameError: PropTypes.string,
      firstNameError: PropTypes.string,
      lastNameError: PropTypes.string,

    }).isRequired,
    hasFooter: PropTypes.bool, // Whether this component has Footer.
    inModal:PropTypes.bool,   // Whether this component is in Modal or Not.
    isCollapsible: PropTypes.bool,
    handleChange: PropTypes.func,
    handleRoleChange: PropTypes.func,
    updateHandler:PropTypes.func,
    resetHandler:PropTypes.func,
    disabled: PropTypes.bool,
    isRoleEditable:PropTypes.bool,
  };

  static defaultProps = {
    hasFooter: false,
    inModal:false,
    isCollapsible: false,
    isRoleEditable: false
  };

  constructor(props) {
    super(props);

    this.state = {isCollapsed: false};
    // Add input function
    // (name, label, type, value, handleChange, validate='', disabled=false)
    this.addInput = addInputGenerator('main-info-');
    this.Header = cardHeader(!this.props.inModal, this.props.isCollapsible)
  }

  render() {
    const data = this.props.data;
    console.log(data);
    let roles = this.props.roles;
    for (let i = 0; i< roles.length; i++) {
      let obj = roles[i];
      if (obj.name === "ROLE_SUPER_ADMIN"){
        roles.splice(i, 1);
      }
    }
    return(
      <Card>
        <this.Header isCollapsed = {this.state.isCollapsed}
                     toggle={() => {this.setState({isCollapsed: !this.state.isCollapsed})}}>Main Information</this.Header>
        <Collapse isOpen={!this.state.isCollapsed}>
          <CardBody>
            <Form action="" method="post" className="form-horizontal">
              {this.addInput("username", "Username", "text", data.username, this.handleChange('username'), data.usernameError, this.props.disabled)}
              <FormGroup row>
                <Col sm="3">
                  <Label htmlFor="roleId">Role: </Label>
                </Col>
                <Col xs="12" sm="9">
                  {!this.props.isRoleEditable? (<Label htmlFor="roleId"><strong>{data.role}</strong></Label>) :
                    (<Input type="select" name="roleId" id="main-info-roleId" onChange={this.handleRoleChange} defaultValue={data.roleId} disabled={this.props.disabled}>
                      {roles.map(({id, name}) => (<option value={id}>{name}</option>))}
                    </Input>)
                  }
                </Col>
              </FormGroup>
              {this.addInput("email", "Email", "email", data.email, this.handleChange('email'), data.emailError, this.props.disabled)}
              {this.addInput("first_name", "First Name", "text",data.firstName, this.handleChange('firstName'), data.firstNameError, this.props.disabled)}
              {this.addInput("last_name", "Last Name", "text", data.lastName, this.handleChange('lastName'), data.lastNameError, this.props.disabled)}
            </Form>
          </CardBody>
        </Collapse>
        {this.props.hasFooter ? <CardFormFooter resetHandler={this.reset} updateHandler={this.update}/> : undefined}
      </Card>
    )
  }

  handleChange = (key) => {
    return (evt) => {
      if (this.props.handleChange) {
        this.props.handleChange({[key]: evt.target.value});
      }
    };
  };

  handleRoleChange = (evt) => {
    if (this.props.handleRoleChange) {
      this.props.handleRoleChange(evt);
    }
  };

  reset = () => {
    this.props.resetHandler();
  };

  update = () => {
    const email = this.props.data.email;
    const emailError = !email || validator.isEmail(email) ? "" : "Not an email address";
    this.props.handleChange({emailError});
    if (!emailError)
      this.props.updateHandler(this.props.data);
  };
}

export default connect(
  state => ({
    roles: state.auth.profile.roles
  })
)(MainInfo)
