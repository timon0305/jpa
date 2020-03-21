import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  CardFooter,
} from 'reactstrap';
import {
  fix_num, mod, multi_conversion,
  timeout,
  verb
} from "../../../service/numberSearch";
import {connect} from 'react-redux'
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {error_customer_record_message} from "../../../service/error_message";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
// import storage from "../../../service/storage";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;

class MCP extends Component {
  constructor(props) {
    super(props);
    this.state = {nums: "", desc: '', mail: '', message: '', loading: false, datas: [], display: false, date: '', template: '',};
  }

  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  submit = async () => {
    this.setState({display: false});
    if (this.state.nums === "") {
      this.setState({message: "Please input Numbers."});
      return false;
    }

    let message = multi_conversion(this.props.somos.id, this.props.somos.ro, fix_num(this.state.nums), this.state.date, this.state.template);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      let message = new MgiMessage(res.data.message);
      let errors = message.value("ERRV");
      let err_message = "";
      if (errors && errors.length) {
        for (let i = 0; i < errors.length; i++) {
          let error = errors[i].ERRV.split(",");
          err_message += error[2] + ":  " + error_customer_record_message(error[0])+ "\n";
        }
        this.setState({message: err_message});
        return false;
      }
      this.setState({display: true});
    }
  };

  clear =() => {
    this.setState({
      message: '',
      ro: '',
      nums: '',
      desc: '',
      mail: '',
      display: false
    })
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Multiple Conversion to Pointer Records</strong></Label>
        <Row className="mt-3">
          <Col xs="6">
            <Card>
              <CardHeader>
                Multi Dial Numbers
              </CardHeader>
              <CardBody className="row">
                <Col xs="3" className="text-right">
                  <Label>Dial Numbers:</Label>
                </Col>
                <Col xs="5">
                  <textarea className="form-control" name="nums" id="nums" rows="15"
                            onChange={(ev) => this.handleChange(ev)}/>
                </Col>
                <Col xs="4">
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardHeader>Conversion Info</CardHeader>
              <CardBody>
                <FormGroup row>
                  <Col xs="4" className="text-right">
                    <Label>Template Name:</Label>
                  </Col>
                  <Col xs="4">
                    <Input type="text" name="template" onChange={(ev) => this.handleChange(ev)}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="4" className="text-right">
                    <Label>Start Eff.Date/Time:</Label>
                  </Col>
                  <Col xs="4">
                    <Input type="text" name="date" onChange={(ev)=> this.handleChange(ev)}/>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Request Information
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Request Description:</Label>
                  <Input type="text" id="desc" name="desc" onChange={(ev) => this.handleChange(ev)} className="col-6"/>
                  <Label>E-mail Address:</Label>
                  <Input type="text" id="mail" name="mail" onChange={(ev) => this.handleChange(ev)} className="col-6"/>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Card>
          <CardBody className="row">
            <Col xs="2" className="text-right">
              Message:
            </Col>
            <Col xs="10">
              <Input type="textarea" name="message" value={this.state.message}/>
            </Col>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs="6" className="text-left">
                <Button size="md" color="primary" onClick={this.submit} className="text-left">Submit</Button>
              </Col>
              <Col xs="6" className="text-right">
                <Button size="md" color="danger" onClick={this.clear} className="text-right">Clear</Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(MCP));
