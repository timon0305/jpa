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
import {fix_num, mod, query_number, reserve_to_spare, timeout, verb} from "../../../service/numberSearch";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
import {Type} from "../../../constants/Notifications";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class NumberQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_setting: 300,
      startDate: moment(),
      loading: false,
      num: null,
      query: [],
      isValid: true,
      isRo: true,
      isEt: true,
      isUntil: true,
      isNcon: true,
      isCtel: true,
      isNotes: true,
      isNum: true,
      ro: "",
      status: "",
      ed: "",
      et: "",
      lact: "",
      until: "",
      ncon: "",
      ctel: "",
      notes: "",
      isResult: false,
      isState: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  toggle = () => {
    this.setState({collapse: !this.state.collapse});
  };

  toggle_setting = () => {
    this.setState({collapse_setting: !this.state.collapse_setting});
  };

  toggleLarge = () => {
    this.setState({
      large: !this.state.large,
    });
  };
  handle = (date) => {
    this.setState({
      startDate: date
    });
  };

  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  queryNumber = async () => {
    this.setState({isResult: false});
    if (this.state.num === null){this.setState({isNum: false});return false;
    } else {this.setState({isNum: true});}
    let message = query_number(this.props.somos.id, this.props.somos.ro, fix_num(this.state.num));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': mod, 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message){
      console.log(res.data.message);
      let data = new MgiMessage(res.data.message);
      this.setState({
        loading: false,
        ro: data.value("CRO")[0],
        status: data.value("STAT")[0],
        ed: data.value("SE")[0],
        et: data.value("ET")[0],
        lact: data.value("LACT")[0],
        ncon: data.value("NCON")[0],
        ctel: data.value("CTEL")[0],
        notes: data.value("NOTES")[0],
        until: data.value("DU")[0],
        isResult: true,
      });

      if (this.state.status === "RESERVE") {
        this.setState({isNcon: false});
        this.setState({isCtel: false});
        this.setState({isNotes: false});
        this.setState({isRo: false});
        this.setState({isUntil: false});
      }
    }
  };
  cancel = () => {
    this.setState({isResult: false});
    this.setState({num: null});
  };
  updateQuery = async () => {
    console.log(this.state.status);
    if (this.state.status !== "SPARE") {
      this.props.showNotification(Type.WARNING, "Please select 'SPARE' status!");
      return false;
    }
    let message = reserve_to_spare(this.props.somos.id, this.props.somos.ro, fix_num(this.state.num));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'NSC', 'message': message, 'timeout': timeout});
    console.log(res.data.message);
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      if (message.value("ERR")[0]) {
        this.props.showNotification(Type.WARNING, "Failed spare reserved number");
        return false;
      }
      this.setState({
        isNcon: true, isCtel: true, isNotes: true, isRo: true, isUntil: true, ro: "",
        ncon: "", ctel: "", notes: "", until: "", lact: "", ed: "", et: "", isState: true
      });
    }
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Number Query and Update</strong></Label>
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
                    <Input type="text" name="num" id="num" onChange={(ev)=> this.handleChange(ev)} value={this.state.num}/>
                    {!this.state.isNum ?
                      <FormText><p style={{color: 'red'}}>Starting Toll Free Number: Must be 10 digits</p></FormText> : ""}
                    <Button size="md" color="primary" className="mt-3" onClick={this.queryNumber}>Retrieve</Button>
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
                    {this.state.isResult &&
                    <div>
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
                              <Input type="text" id="ed" name="ed" autoComplete="text" disabled={this.state.isValid}
                                     onChange={(ev) => this.handleChange(ev)} value={this.state.ed}/>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="lact">Last Active :</Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="text" id="lact" name="lact" autoComplete="text" disabled={this.state.isValid}
                                     onChange={(ev) => this.handleChange(ev)} value={this.state.lact}/>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="status">Status : </Label>
                            </Col>
                            <Col xs="12" md="8">
                              {this.state.status === "RESERVE" ?
                                <Input type="select" id="status" name="status" autoComplete="text" onChange={(ev) => this.handleChange(ev)} disabled={this.state.isState} value={this.state.status}>
                                  <option value="RESERVE">RESERVE</option>
                                  <option value="SPARE">SPARE</option>
                                </Input>
                              :
                                <Input type="text" id="status" name="status" autoComplete="text"
                                       disabled={this.state.isValid} onChange={(ev) => this.handleChange(ev)} value={this.state.status}/>
                              }
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="until">Disconnect Until : </Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="text" id="until" name="until" autoComplete="text"
                                     disabled={this.state.isUntil} onChange={(ev) => this.handleChange(ev)}
                                     value={this.state.until}/>
                            </Col>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <div style={{backgroundColor: '#a3a3a3', borderRadius: 5}}>
                        <Label className="ml-2"><strong style={{fontSize: 20}}>Contact Information</strong></Label>
                      </div>
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
                      <Button size="md" color="primary" className="mr-2" onClick={this.updateQuery} disabled={this.state.isNcon}>Save</Button>
                      <Button size="md" color="danger" onClick={this.cancel}>Cancel</Button>
                    </div>
                    }
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

export default connect(
  (state) => ({somos: state.auth.profile.somos})
)(withLoadingAndNotification(NumberQuery));
