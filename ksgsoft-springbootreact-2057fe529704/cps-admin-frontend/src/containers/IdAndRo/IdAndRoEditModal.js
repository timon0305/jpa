import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody, CardHeader, Modal, ModalBody, ModalHeader} from "reactstrap";
import ModalFormFooter from "../../components/Card/ModalFormFooter";
import addInputGen from '../Account/addInput';


class IdAndRoEditModal extends React.Component {
  static propTypes = {
    idAndRo: PropTypes.shape({
      id: PropTypes.number,
      somos_id: PropTypes.string.isRequired,
      ro: PropTypes.string.isRequired
    }),
    handleChange: PropTypes.func,
    resetHandler: PropTypes.func,
    updateHandler: PropTypes.func,
    ...Modal.propTypes,
  };
  constructor(props){
    super(props);
  }
  addInput = addInputGen('idAndRo-');

  render(){
    return(
      <Modal className="modal-lg" isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.props.toggle}>Edit Id and Ro</ModalHeader>
        <ModalBody>
          <Card>
            <CardHeader>
              <strong>Id and Ro Management</strong>
            </CardHeader>
            <CardBody>
                {this.addInput('somos_id', 'ID', 'text', this.props.idAndRo.somos_id, this.handleChange('somos_id'))}
                {this.addInput('ro', 'RO', 'text', this.props.idAndRo.ro, this.handleChange('ro'))}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFormFooter updateHandler={this.updateForm} resetHandler={this.resetForm}/>
      </Modal>
    )
  }

  resetForm = () => {
    this.props.resetHandler();
  };

  handleChange = (key) => {
    return (evt) => {
      this.props.handleChange({[key]: evt.target.value});
    }
  };

  updateForm = () => {
    this.props.updateHandler(this.props.idAndRo.id);
  }
}

export default IdAndRoEditModal;
