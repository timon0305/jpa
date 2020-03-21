import React from 'react';
import PropTypes from "prop-types";
import {Button} from "reactstrap";
import ModalFooter from "reactstrap/es/ModalFooter";

export default class ModalFormFooter extends React.Component {
  static propTypes = {
    updateHandler: PropTypes.func,
    resetHandler: PropTypes.func,
    updateTitle: PropTypes.string
  };

  static defaultProps = {
    updateTitle: "Update"
  };


  render(){
    return(
      <ModalFooter>
        <Button type="reset" size="md" color="danger" onClick={this.props.resetHandler}>
          <i className="fa fa-refresh"/> Reset</Button>
        <Button type="submit" size="md" color="primary" className="mr-2"  onClick={this.props.updateHandler}>
          <i className="fa fa-dot-circle-o"/> {this.props.updateTitle}</Button>
      </ModalFooter>
    )
  }
}
