import React from 'react'
import Card from "reactstrap/es/Card";
import CardBody from "reactstrap/es/CardBody";
import {Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Collapse} from "reactstrap";
import {withApiCallAndNotification} from "../../components/HOC/withLoadingAndNotification";
import CardFormFooter from "../../components/Card/CardFormFooter";
import {cardHeader} from "../../components/Card/CollapsibleCardHeader";
import PropTypes from "prop-types";
import validator from "validator";

class EditIP extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),
    hasFooter: PropTypes.bool,
    inModal: PropTypes.bool,
    isCollapsible: PropTypes.bool,
    updateHandler: PropTypes.func,
    handleChange: PropTypes.func,
    resetHandler: PropTypes.func,
    addIp: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    hasFooter: false,
    inModal:false,
    isCollapsible: false
  };

  constructor(props) {
    super(props);
    this.state = {
      ip: '',
      ipError:'',
      isCollapsed: false,
    };

    this.Header = cardHeader(!props.inModal, props.isCollapsible)
  }

  render() {
    const ips = this.props.data;
    return (
      <Card>
        <this.Header isCollapsed={this.state.isCollapsed}
                     toggle={() => {this.setState({isCollapsed:!this.state.isCollapsed})}}>Allowed IPs</this.Header>
        <Collapse isOpen={!this.state.isCollapsed}>
          <CardBody>
            <Form action="" method="post" className="form-horizontal">
              <Label htmlFor="ip_address">Your Public IP is 0:0:0:0:0:0:0:1</Label>
              <ul>
                {ips.map((ip) => {
                    return <li>{ip} {!this.props.disabled && <a color="link" onClick={() => this.removeIp(ip)}><i
                      className="fa fa-times"/></a>}</li>;
                  }
                )}
              </ul>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="ip_address">IP Address: </Label>
                </Col>
                <Col xs="12" md="9">
                  <InputGroup>
                    <Input type="email" id="ip" name="ip" placeholder="IP Address"
                           onChange={this.handleChange} value={this.state.ip} className="form-control" disabled={this.props.disabled}/>
                    <InputGroupAddon addonType="append">
                      <Button type="button" color="primary" onClick={this.addIp} disabled={this.props.disabled}>ADD</Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {this.state.ipError && <div className="invalid-feedback d-block">{this.state.ipError}</div> }
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Collapse>
        {this.props.hasFooter ? (<CardFormFooter resetHandler={this.reset} updateHandler={this.update}/>) : undefined}
      </Card>
    );
  }


  reset = () => {
    this.setState({ip:''});
    this.props.resetHandler()
  };

  update = () => {
    this.props.updateHandler(this.props.data);
  };

  handleChange = (v) => {
    this.setState({ip: v.target.value, ipError:''})
  };

  addIp = () => {
    const ip = this.state.ip;
    const ipError = validator.isIP(ip) ? "" : "Not an IP address";
    this.setState({ipError: ipError});
    if (!ipError) {
      if (!this.props.data.includes(ip)){
        this.props.addIp(ip);
      }
    }
  };

  removeIp = (ip) => {
    if (this.props.removeIp) {
      this.props.removeIp(ip);
    }
  };
}

export default withApiCallAndNotification(EditIP)
