import React, {Component} from 'react'
import {Col, Modal, ModalHeader, Row} from "reactstrap";
import PropTypes from "prop-types";
import ModalBody from "reactstrap/es/ModalBody";
import MainInfo from "../Account/MainInfo";
import AdditionalInfo from "../Account/Additional";
import EditIP from "../Account/EditIP";
import ChangePassword from "../Account/ChangePassword";
import ModalFormFooter from "../../components/Card/ModalFormFooter";

class EditUserModal extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      main: PropTypes.object,
      additional: PropTypes.object,
      ip: PropTypes.object,
      password: PropTypes.object,
    }),
    isOpen: PropTypes.bool,
    isEditable: PropTypes.bool,
    updateHandler: PropTypes.func.isRequired,
    resetHandler: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleRoleChange: PropTypes.func,
    addIp: PropTypes.func.isRequired,
    removeIp: PropTypes.func.isRequired,
    toggle: PropTypes.func,
    disabled: PropTypes.bool,
    hasFooter: PropTypes.bool,
    updateMainHandler: PropTypes.func,
    updateIpsHandler: PropTypes.func,
    updateAdditionalHandler: PropTypes.func,
    updatePasswordHandler: PropTypes.func,
    resetMainHandler: PropTypes.func,
    resetIpsHandler: PropTypes.func,
    resetAdditionalHandler: PropTypes.func,
    resetPasswordHandler: PropTypes.func,
    ...Modal.propTypes,
  };

  static defaultProps = {
    isEditable: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    // When editing existing user, should update one by one.
    const isExistingUserEditing = this.props.isEditable && this.props.user && this.props.user.id;
    const user = this.props.user;
    const title = isExistingUserEditing ? "Update" : "Add";
    return (
      <Modal className="modal-xl" isOpen={this.props.isOpen}>
        {/*Close Button*/}
        <ModalHeader toggle={this.props.toggle}>{this.props.isEditable ? (this.props.hasFooter ? "Edit User" : "Create a new User") : "View User"}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="12" lg="6">
              <MainInfo data={user.main}  hasFooter={this.props.hasFooter} inModal handleChange={this.handleChange('main')} handleRoleChange={this.handleRoleChange} isRoleEditable disabled={this.props.disabled} resetHandler={this.resetMainForm} updateHandler={this.updateMainForm}/>
              <EditIP data={user.ips}  hasFooter={this.props.hasFooter} inModal addIp={this.addIp} removeIp={this.removeIp} disabled={this.props.disabled} resetHandler={this.resetIPForm} updateHandler={this.updateIPForm}/>
            </Col>
            <Col xs="12" lg="6">
              <ChangePassword data={user.password} hasFooter={this.props.hasFooter} handleChange={this.handleChange('password')} inModal disabled={this.props.disabled} resetHandler={this.resetPassword}
                              updateHandler={this.updatePassword}/>
              <AdditionalInfo data={user.additional} hasFooter={this.props.hasFooter} handleChange={this.handleChange('additional')} inModal disabled={this.props.disabled} resetHandler={this.resetAddForm}
                              updateHandler={this.updateAddForm}/>
            </Col>
          </Row>
        </ModalBody>

        {/*Only show modal footer when in editable mode*/}
        {!this.props.hasFooter ? (this.props.isEditable ? <ModalFormFooter resetHandler={() => {}} updateHandler={this.updateHandler} updateTitle={title}/> : undefined):undefined}
      </Modal>
    );
  }
  updateMainForm = () => {
    this.props.updateMainHandler();
  };
  updateIPForm = () => {
    this.props.updateIpsHandler();
  };

  updatePassword = () => {
    this.props.updatePasswordHandler();
  };

  updateAddForm = () => {
    this.props.updateAdditionalHandler();
  };

  resetMainForm = () => {
    this.props.resetMainHandler();
  };

  resetIPForm = () => {
    this.props.resetIpsHandler();
  };

  resetAddForm = () => {
    this.props.resetAdditionalHandler();
  };

  resetPassword = () => {
    this.props.resetPasswordHandler();
  };
  handleChange = (key) => {
    return (obj) => {
      this.props.handleChange({[key]: obj});
    };
  };

  handleRoleChange = (evt) => {
    this.props.handleRoleChange(evt);
  };

  addIp = (ip) => {
    this.props.addIp(ip);
  };

  removeIp = (ip) => {
    this.props.removeIp(ip);
  };

  updateHandler = () => {
    this.props.updateHandler(this.props.user.id);
  }

}

export default EditUserModal
