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
  fix_num,
  multi_resp_change,
  timeout,
  verb
} from "../../../service/numberSearch";
import {connect} from 'react-redux'
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {error_mro_message} from "../../../service/error_message";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;

class MRO extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nums: "",
      ro: '',
      desc: '',
      mail: '',
      message: '',
      loading: false
    };
  }

  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  submit = async () => {
    if (this.state.nums === "") {
      this.setState({message: "Please input Numbers."});
      return false;
    }
    if (this.state.ro === "") {
      this.setState({message: "Please input Resp Org"});
      return false;
    }
    let message = multi_resp_change(this.props.somos.id, this.props.somos.ro, this.state.ro, fix_num(this.state.nums));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'MRO', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      console.log(message.value("ERRV")[0]);
      if (message.value("ERRV")[0]) {
        let errors = message.value("ERRV");
        let error_message = "";
        let error = [];
        for (let i = 0; i < errors.length; i++) {
          error = errors[i].split(",");
          error_message += error[2] + ":     " + error_mro_message(error[0]) + "\n";
        }
        this.setState({message: error_message});
      } else {
        this.setState({message: "Successfully Change Resp Org!"});
      }
    }
  };

  clear =() => {
    this.setState({
      message: '',
      ro: '',
      nums: '',
      desc: '',
      mail: ''
    })
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Multi Dial Number Resp Org Change</strong></Label>
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
              </CardBody>
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardHeader>
                Resp Org Details
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="2"/>
                  <Col xs="4">
                    <Label>New Resp Org:</Label>
                  </Col>
                  <Col xs="4">
                    <Input type="text" name="ro" id="ro" onChange={(ev) => this.handleChange(ev)}/>
                  </Col>
                  <Col xs="2"/>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Request Description
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

export default connect((state)=> ({somos: state.auth.profile.somos}))(withLoadingAndNotification(MRO));
