import React, {Component} from 'react'
import {Button, Col, Input, Label, Modal, ModalFooter, ModalHeader, Row, ModalBody} from "reactstrap";
import PropTypes from "prop-types";

class DeleteModal extends Component {
  static propTypes = {
    data: PropTypes.string,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    handler: PropTypes.func,
    delete: PropTypes.func,
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
        <ModalHeader toggle={this.props.toggle}>Delete Rate Deck</ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="3"><Label>Rate Deck:</Label></Col>
            <Col lg="9">
              <Input type="text" value={this.props.data} onChange={this.handleChange} className="form-control-sm"/>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" color="primary" onClick={this.delete}>Delete</Button>
        </ModalFooter>
      </Modal>
    );
  }

  handleChange = (ev) => {
    this.props.handler(ev.target.value);
  };

  delete = () => {
    this.props.delete()
  };
}

export default DeleteModal
