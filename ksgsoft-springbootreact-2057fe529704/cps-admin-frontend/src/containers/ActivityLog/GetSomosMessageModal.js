import React from 'react'
import PropTypes from 'prop-types';
import {withAuthApiLoadingNotification} from "../../components/HOC/withLoadingAndNotification";
import {Modal, ModalHeader, ModalBody} from "reactstrap";
import addInputGenerator from '../Account/addInput';


class GetSomosMessageModal extends React.Component{
  static propTypes = {
    req: PropTypes.string,
    data: PropTypes.shape({
      upl: PropTypes.string.isRequired,
      transportHeader: PropTypes.shape({
        destNodeName: PropTypes.string,
        srcNodeName: PropTypes.string,
      }),
      uplHeader: PropTypes.shape({
        drc: PropTypes.string,
      })
    }),
    isOpen: PropTypes.bool,
    toggle: PropTypes.bool
  };
  constructor(props){
    super(props);
    this.addInput = addInputGenerator('somos-message-');
  }
  render () {
    const {data} = this.props;
    return <Modal className="modal-lg" isOpen={this.props.isOpen}>
      {/*Close Button*/}
      <ModalHeader toggle={this.props.toggle}>{this.props.req === "REQ" ? "Response Message" : this.props.req === "RSP" ? "Request Message": ""}</ModalHeader>
      <ModalBody>
        {this.addInput("message", "Message Content", "textarea", data.upl && data.upl, "", undefined, true)}
        {this.addInput("destNodeName", "Destination Node Name", "text", data.transportHeader && data.transportHeader.destNodeName, "", undefined, true)}
        {this.addInput("srcNodeName", "Source Node Name", "text", data.transportHeader && data.transportHeader.srcNodeName, "", undefined, true)}
      </ModalBody>
    </Modal>
  }
}

export default withAuthApiLoadingNotification(GetSomosMessageModal)
