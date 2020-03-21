import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody, CardHeader, Col, FormGroup, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {AppSwitch} from "@coreui/react";
import ModalFormFooter from "../../components/Card/ModalFormFooter";
import addInputGen from '../Account/addInput';
import validator from "validator";
const defaultSms = {id: 0, remoteAddr:"", port: "", srcNodeName: "", destNodeName: "", active: false};

class SmsEditModal extends React.Component {
  static propTypes = {
    sms: PropTypes.shape({
      id: PropTypes.string.isRequired,
      remoteAddr: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired,
      srcNodeName: PropTypes.string.isRequired,
      destNodeName: PropTypes.string.isRequired,
      active: PropTypes.bool,

      remoteAddrError: PropTypes.string,
      portError: PropTypes.string,
    }),
    toggle: PropTypes.func,
    handleChange: PropTypes.func,
    resetForm: PropTypes.func,
    updateHandler: PropTypes.func,
    isEditable:PropTypes.bool,
    ...Modal.propTypes
  };

  static defaultProps = {
    isEditable: true
  };

  addInput = addInputGen('somos-');

  constructor(props){
    super(props);
  }

  render(){
    return(
      <Modal className="modal-lg" isOpen={this.props.isOpen}>
        {/*Close Button*/}
        <ModalHeader toggle={this.props.toggle}>{this.props.isEditable ? (this.props.sms.remoteAddr ? "Edit SOMOS Connection" : "Create a New SOMOS Connection") : "View SOMOS Connection"}</ModalHeader>
        <ModalBody>
          <Card>
            <CardHeader>
              <strong>SMS Connection Information</strong>
            </CardHeader>
            <CardBody>
              {this.addInput('remoteAddr', 'Server Address', 'email', this.props.sms.remoteAddr, this.handleChange('remoteAddr'), this.props.sms.remoteAddrError, !this.props.isEditable)}
              {this.addInput('port', 'Port', 'number', this.props.sms.port, this.handleChange('port'), this.props.sms.portError, !this.props.isEditable)}
              {this.addInput('srcNodeName', 'Source', 'text', this.props.sms.srcNodeName, this.handleChange('srcNodeName'), "", !this.props.isEditable)}
              {this.addInput('destNodeName', 'Destination', 'text', this.props.sms.destNodeName, this.handleChange('destNodeName'), "", !this.props.isEditable)}
              <FormGroup row>
                <Col sm="3"><Label htmlFor="active">Active</Label></Col>
                <Col xs="12" sm="9">
                  <AppSwitch variant={'3d'} outline={'alt'} color={'primary'} checked={this.props.sms.active} name="active" onClick={this.handleChange('active')} disabled={!this.props.isEditable}/>
                </Col>
              </FormGroup>
            </CardBody>
          </Card>
        </ModalBody>
        {this.props.isEditable && <ModalFormFooter updateHandler={this.updateHandler} resetHandler={this.resetForm}/>}
      </Modal>
    )
  }

  resetForm = () => {
    this.props.resetForm(defaultSms);
  };

  handleChange = (key) => {
    return (evt) => {
      if (key === "active") this.props.handleChange({[key]: evt.target.checked});
      else this.props.handleChange({[key]: evt.target.value, [key + 'Error'] : ''});
    }
  };

  updateHandler = () => {
    const remoteAddr = this.props.sms.remoteAddr;
    const remoteAddrError = validator.isIP(remoteAddr) ? "" : "Not a server address";
    if (remoteAddrError) {
      this.props.handleChange({remoteAddrError});
      return;
    }

    const port = this.props.sms.port;
    if (isNaN(port)){
      const portError = "Not an valid port";
      this.props.handleChange({portError});
    }
    this.props.handleChange({remoteAddrError});
    this.props.updateHandler(this.props.sms.id);
  };
}

export default SmsEditModal;
