import React, {Component} from 'react'
import {Button, Col, Input, Modal, ModalHeader, Row} from "reactstrap";
import PropTypes from "prop-types";
import ModalBody from "reactstrap/es/ModalBody";
import Label from "reactstrap/es/Label";
import ModalFooter from "reactstrap/es/ModalFooter";

class RenameModal extends Component {
  static propTypes = {
    data: PropTypes.string,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    handler: PropTypes.func,
    rename: PropTypes.func,
    ...Modal.propTypes,
  };

  static defaultProps = {
    isEditable: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal className="modal-md" isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.props.toggle}>Rename Rate Deck</ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="3"><Label>Rate Deck:</Label></Col>
            <Col lg="9">
              <Input type="text" value={this.props.data} onChange={this.handleChange} className="form-control-sm"/>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" color="primary" onClick={this.rename}>Rename</Button>
        </ModalFooter>
      </Modal>
    );
  }

  handleChange = (ev) => {
    this.props.handler(ev.target.value);
  }

  rename = () => {
    this.props.rename();
  }
}

export default RenameModal
