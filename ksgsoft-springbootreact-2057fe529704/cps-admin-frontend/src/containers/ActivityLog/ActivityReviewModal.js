import React from 'react'
import PropTypes from 'prop-types';
import {withAuthApiLoadingNotification} from "../../components/HOC/withLoadingAndNotification";
import {Modal, ModalHeader, ModalBody} from "reactstrap";
import addInputGenerator from '../Account/addInput';


class ActivityReviewModal extends React.Component{
  static propTypes = {
    reviews: PropTypes.shape({
      verb: PropTypes.string.isRequired,
      mod: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      username: PropTypes.string,
      destination_node_name: PropTypes.string,
      source_node_name: PropTypes.string,
    }),
    isOpen: PropTypes.bool,
    toggle: PropTypes.bool
  };
  constructor(props){
    super(props);
    this.addInput = addInputGenerator('activity-review-');
  }
  render () {
    const {reviews} = this.props;
    return <Modal className="modal-lg" isOpen={this.props.isOpen}>
      {/*Close Button*/}
      <ModalHeader toggle={this.props.toggle}>Activity Log Review</ModalHeader>
      <ModalBody>
        {this.addInput("command", "Command", "text", reviews.verb + "-" + reviews.mod, "", undefined, true)}
        {this.addInput("message", "Message Content", "textarea", reviews.data, "", undefined, true)}
        {this.addInput("username", "Username", "text", reviews.username, "", undefined, true)}
        {this.addInput("destNodeName", "Destination Node Name", "text", reviews.destination_node_name, "", undefined, true)}
        {this.addInput("srcNodeName", "Source Node Name", "text", reviews.source_node_name, "", undefined, true)}
      </ModalBody>
    </Modal>
  }
}

export default withAuthApiLoadingNotification(ActivityReviewModal)
