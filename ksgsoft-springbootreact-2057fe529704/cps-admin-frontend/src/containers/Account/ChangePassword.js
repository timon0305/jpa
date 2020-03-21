import React, {Fragment} from 'react';
import {Card, CardBody, CardHeader, Form, Collapse} from 'reactstrap';
import addInputGenerator from "./addInput";
import CardFormFooter from "../../components/Card/CardFormFooter";
import {withApiCallAndNotification} from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from "../../components/Card/CollapsibleCardHeader";
import PropTypes from "prop-types";

class ChangePassword extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      old: PropTypes.string,
      new : PropTypes.string,
      confirm: PropTypes.string,
      oldError:PropTypes.string,
      newError:PropTypes.string,
      confirmError:PropTypes.string
    }).isRequired,
    hasFooter: PropTypes.bool,
    inModal:PropTypes.bool,   // Whether this component is in Modal or Not.
    isCollapsible: PropTypes.bool,
    showOldPassword:PropTypes.bool, // Show old password?
    resetHandler: PropTypes.func,
    updateHandler: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    hasFooter: false,
    inModal:false,
    isCollapsible: false,
    showOldPassword: false
  };

  constructor(props) {
    super(props);

    // Add input function
    this.addInput = addInputGenerator('password-');
    this.state = {isCollapsed: false}
  }

  render() {
    const Header = cardHeader(!this.props.inModal, this.props.isCollapsible);
    const data = this.props.data;
    return (
      <Card>
        <Header toggle={() => this.setState({isCollapsed:!this.state.isCollapsed})}
                isCollapsed = {this.state.isCollapsed}>{this.props.showOldPassword ? 'Change Password' : 'Password'}</Header>
        <Collapse isOpen={!this.state.isCollapsed}>
        <CardBody>
          <Form action="" method="post" className="form-horizontal">
            {this.props.showOldPassword ? this.addInput("old_password", "Old Password", "password", data.old, this.handleChange('old'), data.oldError) : undefined}
            {this.addInput("new_password", "New Password", "password", data && data.new, this.handleChange('new'), data && data.newError, this.props.disabled)}
            {this.addInput("confirm_password", "Confirm Password", "password", data && data.confirm, this.handleChange('confirm'), data && data.confirmError, this.props.disabled)}
          </Form>
        </CardBody>
        </Collapse>
        {this.props.hasFooter ? (<CardFormFooter updateHandler={this.update} resetHandler={this.reset}/>) : undefined}
      </Card>
    )
  }

  handleChange = (key) => {
    if (this.props.handleChange){
      return evt => this.props.handleChange({[key]: evt.target.value, [key+'Error']:''})
    }
  };

  reset = () => {
    this.props.resetHandler();
  };

  update = () => {
    // TODO Validation Check.
    this.props.updateHandler(this.props.data);
  }
}

export default withApiCallAndNotification(ChangePassword)
