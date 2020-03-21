import React from 'react'
import {cardHeader} from "../Card/CollapsibleCardHeader";
import {Card, Collapse} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";

const Header = cardHeader(true, true);

export default function withCard(title, WrappedComponent){
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isOpen: true }
    }

    toggle = () => {
      this.setState({isOpen: !this.state.isOpen});
    };

    render(){
      return (
        <Card>
          <Header toggle={this.toggle} isCollapsed={!this.state.isOpen}>{title}</Header>
          <Collapse isOpen={this.state.isOpen}>
            <CardBody>
              <WrappedComponent {...this.props}/>
            </CardBody>
          </Collapse>
        </Card>
      )
    }
  }
}
