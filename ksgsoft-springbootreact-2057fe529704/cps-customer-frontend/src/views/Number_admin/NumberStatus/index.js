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
  Fade,
  Collapse, FormText,
} from 'reactstrap';
import moment from "moment";
import {connect} from 'react-redux'
import "react-datepicker/dist/react-datepicker.css";
import {mod, query_number, number_status, timeout, verb, fix_num} from "../../../service/numberSearch";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {error_number_status_message} from "../../../service/error_message";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
import {Type} from "../../../constants/Notifications";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;

class NumberStatus extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.state = {
      collapse: true, collapse_setting: true, fadeIn: true, fadeIn_setting: true, timeout: 300, timeout_setting: 300, startDate: moment(), loading: false, num: null, query: [], isValid: true, isRo: false,
      isEt: false, isUntil: false, isNcon: false, isCtel: false, isNotes: false, isNum: true, ro: "", status: "", ed: "", until: "", ncon: "", ctel: "", notes: "", isResult: false, isState: false,
    };
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }

  toggle_setting() {
    this.setState({collapse_setting: !this.state.collapse_setting});
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }
  handle(date) {
    this.setState({
      startDate: date
    });
  }

  handleChange = (event) =>{
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  queryNumber = async () => {
    this.setState({isResult: false, ro: '', ncon: '', ctel: '', notes: '', ed: '', et: '', status: '', until: ''});
    let num = this.state.num;
    if (num === null) {
      this.setState({isNum: false});
      return false;
    } else {
      this.setState({isNum: true});
    }
    let message = query_number(this.props.somos.id, this.props.somos.ro, fix_num(num));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': mod, 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      const message = new MgiMessage(res.data.message);
      this.setState({
        loading: false,
        ro: message.value("CRO")[0],
        status: message.value("STAT")[0].trim(),
        ed: message.value("SE")[0],
        et: message.value("ET")[0],
        ncon: message.value("NCON")[0],
        ctel: message.value("CTEL")[0],
        notes: message.value("NOTES")[0],
        until: message.value("RU")[0],
      });

      if (message.value("ERR")[0]) {
        this.props.showNotification(Type.WARNING, error_number_status_message(message.value("ERR")[0]));
        return false;
      }

      if (this.state.status === "RESERVE") {
        this.setState({isNcon: false});
        this.setState({isCtel: false});
        this.setState({isNotes: false});
        this.setState({isRo: false});
        this.setState({isUntil: false});
      } else if (this.state.status === "SPARE") {
        this.props.showNotification(Type.WARNING, "The Number is spare");
      }
      this.setState({isResult: true});
    }
  };

  updateQuery = async () => {
    console.log(this.state.status);
    this.setState({isResult: false, ro: '', ncon: '', ctel: '', notes: '', ed: '', et: '', until: ''});
    let message = number_status(this.props.somos.id, this.props.somos.ro, fix_num(this.state.num), this.state.ro, this.state.ncon, this.state.ctel, this.state.notes, this.state.until, this.state.status);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'NSC', 'message': message, 'timeout': timeout});
    console.log(res.data.message);
    if (res.ok && res.data && res.data.message) {
      const message = new MgiMessage(res.data.message);
      message.value("ERR")[0] &&this.props.showNotification(Type.WARNING, error_number_status_message(message.value("ERR")[0]));
    }
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Number Status Change</strong></Label>
        <Row className="mt-3">
          <Col xs="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <strong style={{fontSize: 20}}>Retrieve</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle.bind(this)}><i
                      className={this.state.collapse ? "icon-arrow-up" : "icon-arrow-down"}/></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Label>Toll-Free Number *</Label>
                    <Input type="textarea" name="num" id="num" onChange={(ev)=> this.handleChange(ev)} value={this.state.num}/>
                    {!this.state.isNum ?
                      <FormText><p style={{color: 'red'}}>Please input toll free number</p></FormText> : ""}
                    <div className="mt-3">
                      <FormGroup row>
                        <Col xs="12" md="6">
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="ro">Resp Org : </Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="text" id="ro" name="ro" autoComplete="text" disabled={this.state.isRo}
                                     onChange={(ev) => this.handleChange(ev)} value={this.state.ro}/>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="ed">Effective Date :</Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="text" id="ed" name="ed" autoComplete="text"
                                     onChange={(ev) => this.handleChange(ev)} value={this.state.ed}/>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="status">Status : </Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input type="select" id="status" name="status" autoComplete="text" onChange={(ev) => this.handleChange(ev)} disabled={this.state.isState} value={this.state.status}>
                                  <option/>
                                  <option value="RESERVE">RESERVE</option>
                                  <option value="SPARE">SPARE</option>
                                </Input>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="until">Reserved Until : </Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="text" id="until" name="until" autoComplete="text"
                                     disabled={this.state.isUntil} onChange={(ev) => this.handleChange(ev)}
                                     value={this.state.until}/>
                            </Col>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row className="mt-3">
                        <Col xs="12" md="6">
                          <Label htmlFor="ncon">Contact Name : </Label>
                          <Input type="text" id="ncon" name="ncon" autoComplete="text" disabled={this.state.isNcon}
                                 onChange={(ev) => this.handleChange(ev)} value={this.state.ncon}/>
                        </Col>
                        <Col xs="12" md="6">
                          <Label htmlFor="ctel">Contact Number : </Label>
                          <Input type="number" id="ctel" name="ctel" autoComplete="text" disabled={this.state.isCtel}
                                 onChange={(ev) => this.handleChange(ev)} value={this.state.ctel}/>
                        </Col>
                        <Col className="mt-3">
                          <Label htmlFor="notes">Notes</Label>
                          <Input type="textarea" name="notes" id="notes" rows="5" disabled={this.state.isNotes}
                                 onChange={(ev) => this.handleChange(ev)} value={this.state.notes}/>
                        </Col>
                      </FormGroup>
                      <Button size="md" color="primary" className="mr-2" onClick={this.queryNumber}>Retrieve</Button>
                      <Button size="md" color="primary" className="mr-2" onClick={this.updateQuery}>Update</Button>
                    </div>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
          <Col xs="12">
            <Fade timeout={this.state.timeout_setting} in={this.state.fadeIn_setting}>
              <Card>
                <CardHeader>
                  <strong style={{fontSize: 20}}>Result</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle_setting.bind(this)}><i
                      className={this.state.collapse_setting ? "icon-arrow-up" : "icon-arrow-down"}/></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse_setting} id="collapseExample">
                  <CardBody>

                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(NumberStatus));
