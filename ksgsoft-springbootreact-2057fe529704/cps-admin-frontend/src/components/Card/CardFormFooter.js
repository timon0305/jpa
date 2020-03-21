import React from 'react';
import {Button} from "reactstrap";
import PropTypes from 'prop-types';
import CardFooter from "reactstrap/es/CardFooter";


export default class CardFormFooter extends React.Component {
  static propTypes = {
    updateHandler: PropTypes.func,
    resetHandler: PropTypes.func
  };

  render(){
    return(
      <CardFooter className="text-right">
        <Button type="reset" size="md" color="danger" onClick={this.props.resetHandler}><i
          className="fa fa-refresh"/> Reset</Button> &nbsp;&nbsp;
        <Button type="submit" size="md" color="primary" className="mr-2" onClick={this.props.updateHandler}><i
          className="fa fa-dot-circle-o"/> Update</Button>
      </CardFooter>
    )
  }
}

