import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Fade,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from 'reactstrap';
import {
  customer_create,
  mod_customer,
  mod_reserve,
  search_reserve_numbers,
  search_reserve_ten_numbers,
  timeout,
  verb
} from "../../../service/oneClick";
import {connect} from 'react-redux'
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {error_customer_record_message, error_message} from "../../../service/error_message";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {fix_num, mod} from "../../../service/numberSearch";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class OneClick extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.handle = this.handle.bind(this);


    this.state = {
      tooltipOpen: [false, false],
      collapse: true,
      collapse_note: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_note: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_note: 300,
      timeout_setting: 300,
      large: false,
      loading: false,
      isNxx: true,
      isLine: true,
      isNum: true,
      isQt: true,
      num: null,
      npa: "npa",
      nxx: null,
      line: null,
      quantity: "1",
      cont: false,
      ncon: "KEELE,RICKY",
      ctel: "8887673300",
      template: null,
      line_num: null,
      service_order: null,
      timezone: "C",
      ed: null,
      et: null,
      now: false,
      reserved_number: null,
      lns: null,
      isEd: true,
      active_number: null,
      isResult: false,
      isService: true,
      isEt: true,
      startDate: moment(),
      nums: [],
      isLns: true,
      isTemplate: true,
    };
  }

  toggle_tip(i) {
    const newArray = this.state.tooltipOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      tooltipOpen: newArray,
    });
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }
  togglenote() {
    this.setState({collapse_note: !this.state.collapse_note});
  }
  toggle_setting() {
    this.setState({collapse_setting: !this.state.collapse_setting});
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }
  handleChange(event) {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);

    let num = this.state.num;
    setTimeout(() => {
      if (num !== null && num !== "") {
        this.setState({valid: true});
        this.setState({line: null});
        this.setState({nxx: null});
        this.setState({npa: null});
        this.setState({quantity: "1"});
        this.setState({display: false});
      }
      if (num === "")
        this.setState({valid: false});
    }, 200)
  }
  handle(date) {
    this.setState({
      startDate: date
    });
  }
  activate = async () => {
    this.setState({isResult: false});
    let num = this.state.num;
    let qt = this.state.quantity;
    let npa = this.state.npa;
    let nxx = this.state.nxx;
    let cont = this.state.cont;
    let line = this.state.line;
    let reserve_message;
    if (this.state.template === null) {
      this.setState({isTemplate: false});
      return false;
    }  else {
      this.setState({isTemplate: true})
    }
    if (this.state.service_order === null) {
      this.setState({isService: false});
      return false;
    } else {
      this.setState({isService: true});
    }

    if (this.state.et === null && !this.state.now) {
      this.setState({isEt: false});
      return false;
    } else {
      this.setState({isEt: true});
    }
    if (this.state.startDate === null) {
      this.setState({idEd: false});
      return false;
    } else {
      this.setState({isEd: true});
    }

    if (this.state.lns === null) {
      this.setState({isLns: false});
      return false;
    } else {
      this.setState({isLns: true});
    }
    if (num === null || num === "") {
      reserve_message = search_reserve_numbers(this.props.somos.id, this.props.somos.ro, qt, npa, nxx, line, num, cont, this.state.ncon, this.state.ctel, this.state.notes);
    } else {
      reserve_message = search_reserve_ten_numbers(this.props.somos.id, this.props.somos.ro, fix_num(num), this.state.ncon, this.state.ctel, this.state.notes)
    }
    console.log(reserve_message);
    const res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': mod, 'message': reserve_message, 'timeout': timeout});
    console.log(res);
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      const message = new MgiMessage(res.data.message);
      const num = message.value("NUM")[0];
      this.setState({reserved_number: num.substring(0, 3) + "-" + num.substring(3, 6) + "-" + num.substring(6, 10)});
      let customer_message = customer_create(this.props.somos.id, this.props.somos.ro, fix_num(this.state.reserved_number), this.state.startDate.format("MM/DD/YYYY").toString(), this.state.et, this.state.ctel, this.state.ncon, this.state.template, this.state.timezone, this.state.now, this.state.service_order, this.state.lns);
      const res1 = await this.props.callApi2(RestApi.sendRequestNew, {'mod': mod_customer, 'message': customer_message, 'timeout': timeout});
      if (res1.ok && res1.data && res1.data.message) {
        let message = new MgiMessage(res1.data.message);
        if (message.value("ERR")[0]) {
          const errMsg = error_customer_record_message(message.value("ERR")[0].toString());
          toast.warn(errMsg);
          return false;
        }
        this.setState({
          active_number: message.value("NUM")[0].substring(0, 3)+ "-" + message.value("NUM")[0].substring(3, 6) + "-" + message.value("NUM")[0].substring(6, 10),
          isResult: true
        })
      }
    }
  };

  reset = () => {
    window.location.reload();
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>One Click Activate</strong></Label>
        <Row className="mt-3">
          <Col xs="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <strong>Search</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle.bind(this)}><i
                      className={this.state.collapse ? "icon-arrow-up" : "icon-arrow-down"}/></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <FormGroup row>
                      <Col xs="12" md="4">
                        <Row>
                          <Col md="3">
                            <Label htmlFor="quantity">Quantity *: </Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="number" id="quantity" name="quantity" autoComplete="text"
                                   defaultValue={this.state.quantity}
                                   onChange={(value) => this.handleChange(value)} disabled={this.state.valid}/>
                            {!this.state.isQt ?
                              <FormText><p style={{color: 'red'}}>Starting Quantity: Must be between 1 and 10.</p>
                              </FormText> : ""}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="12" md="4">
                        <Row className="ml-5">
                          <Input type="checkbox" id="cont" name="cont" onChange={(evt) => {
                            this.setState({cont: evt.target.checked})
                          }}/>
                          <Label htmlFor="cont">Consecutive</Label>
                        </Row>
                      </Col>
                      <Col xs="12" md="4">
                        <Button size="lg" color="link" onClick={this.toggleLarge}><i className="fa fa-phone-square"
                                                                                     style={{fontSize: 25}}/> Contact
                          Information *</Button>
                        <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                               className={'modal-lg ' + this.props.className}>
                          <ModalHeader toggle={this.toggleLarge}>Contact Information</ModalHeader>
                          <ModalBody>
                            <FormGroup row>
                              <Col xs="6">
                                <Label htmlFor="ncon">Contact Name * </Label>
                                <Input type="text" name="ncon" id="ncon"
                                       onChange={(value) => this.handleChange(value)} value={this.state.ncon}/>
                              </Col>
                              <Col xs="6">
                                <Label htmlFor="ctel">Contact Number * </Label>
                                <Input type="text" name="ctel" id="ctel"
                                       onChange={(value) => this.handleChange(value)} value={this.state.ctel}/>
                              </Col>
                            </FormGroup>
                            <Row>
                              <Col xs="12">
                                <Input type="textarea" name="notes" id="notes" rows="5"
                                       placeholder="Number or Mask Entry"
                                       onChange={(value) => this.handleChange(value)}/>
                              </Col>
                            </Row>
                            <Label htmlFor="default_setting" className="ml-sm-4 mt-2">
                              <Input type="checkbox" name="default_setting" id="default_setting"/>
                              Change default contact information
                            </Label>
                          </ModalBody>
                          <ModalFooter>
                            <Button type="submit" size="md" color="primary" className="mr-2"
                                    onClick={this.toggleLarge}> Save</Button>
                            <Button type="reset" size="md" color="danger" onClick={this.toggleLarge}> Cancel</Button>
                          </ModalFooter>
                        </Modal>
                      </Col>
                    </FormGroup>
                    <Row className="mb-3">
                      <Col xs="12">
                        <Input type="textarea" name="num" id="num" rows="5"
                               placeholder="Number or Mask Entry" onChange={(value) => this.handleChange(value)}/>
                        {/*{!this.state.isNum ? <FormText><strong style={{color: 'red'}}>Number or Mask Entry: Allows 10 alphanumerics, '*', '&' and dashes.</strong></FormText> : ""}*/}
                      </Col>

                    </Row>
                    <Fade timeout={this.state.timeout_note} in={this.state.fadeIn_note}>
                      <Card className="mt-3">
                        <CardHeader>
                          <strong>Advanced Search</strong>
                          <div className="card-header-actions">
                            <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                               onClick={this.togglenote.bind(this)}><i
                              className={this.state.collapse_note ? "icon-arrow-up" : "icon-arrow-down"}/></a>
                          </div>
                        </CardHeader>
                        <Collapse isOpen={this.state.collapse_note} id="collapseExample">
                          <CardBody>
                            <FormGroup row>
                              <Col xs="12" md="4">
                                <Input type="select" name="npa" id="npa" onChange={(value) => this.handleChange(value)}
                                       disabled={this.state.valid} value={this.state.npa === null ? "" : this.state.npa}>
                                  <option value="npa">Toll-Free NPA</option>
                                  <option value="800">800</option>
                                  <option value="833">833</option>
                                  <option value="844">844</option>
                                  <option value="855">855</option>
                                  <option value="866">866</option>
                                  <option value="877">877</option>
                                  <option value="888">888</option>
                                </Input>
                              </Col>
                              <Col xs="12" md="4">
                                <Input type="text" name="nxx" id="nxx" autoComplete="text" placeholder="Starting NXX"
                                       onChange={(value) => this.handleChange(value)} disabled={this.state.valid} value={this.state.nxx === null ? "" : this.state.nxx}/>
                                {!this.state.isNxx ?
                                  <FormText><p style={{color: 'red'}}>Starting NXX: Must be three numerics.</p>
                                  </FormText> : ""}
                              </Col>
                              <Col xs="12" md="4">
                                <Input type="text" name="line" id="line" autoComplete="text" placeholder="Starting line"
                                       onChange={(value) => this.handleChange(value)} disabled={this.state.valid} value={this.state.line === null ? "" : this.state.line}/>
                                {!this.state.isLine ?
                                  <FormText><p style={{color: 'red'}}>Starting LINE: Must be four numerics.</p>
                                  </FormText> : ""}
                              </Col>
                            </FormGroup>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                    <Card>
                      <CardHeader>
                        <strong>One Click Activate</strong>
                      </CardHeader>
                      <CardBody>
                        <FormGroup row>
                          <Col xs="12" md="6">
                            <Label htmlFor="template">Template *</Label>
                            <Row>
                              <Col xs="11">
                                <Input type="text" name="template" id="template"
                                       onChange={(ev) => this.handleChange(ev)}/>
                                {!this.state.isTemplate ?
                                  <FormText><p style={{color: 'red'}}>Please input valid Template</p>
                                  </FormText> : ""}
                              </Col>
                              <Col xs="1">
                                <i className="fa fa-exclamation-circle fa-fw size-3" id="tollfree_tooltip"
                                   style={{fontSize: 25}}/>
                                <Tooltip placement="top" isOpen={this.state.tooltipOpen[1]} autohide={false}
                                         target="tollfree_tooltip" toggle={() => {
                                  this.toggle_tip(1);
                                }}>
                                  The selected Template Record must be in an Active status and valid in the Toll-Free
                                  Number Registry prior to utilizing this feature. If an Invalid Template Record was
                                  found during processing, the first TFN will be in an Invalid status and up to 9 TFNs
                                  will be in a Reserved status for a request. Any remaining TFNs in the request will not
                                  be processed.
                                </Tooltip>
                              </Col>
                            </Row>
                          </Col>

                        </FormGroup>

                        <FormGroup row>
                          <Col xs="12" md="6">
                            <Label htmlFor="service_order">Service Order *</Label>
                            <Input type="text" name="service_order" id="service_order" onChange={(ev)=>this.handleChange(ev)}/>
                            {!this.state.isService ?
                              <FormText><p style={{color: 'red'}}>Please input valid service order</p>
                              </FormText> : ""}
                          </Col>
                          <Col xs="12" md="6">
                            <Label htmlFor="timezone">Time Zone</Label>
                            <Input type="select" name="timezone" id="timezone" onChange={(ev)=> this.handleChange(ev)}>
                              <option value="C">Central (C)</option>
                              <option value="A">Atlantic (A)</option>
                              <option value="B">Bering (B)</option>
                              <option value="E">Eastern (E)</option>
                              <option value="H">Hawaiian-Aleutian (H)</option>
                              <option value="M">Mountain (M)</option>
                              <option value="N">Newfoundland (N)</option>
                              <option value="P">Pacific (P)</option>
                              <option value="Y">Alaska (Y)</option>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs="12" md="4">
                            <Label htmlFor="lns">Number of Lines *</Label>
                            <Input type="text" name="lns" id="lns" onChange={(ev) => this.handleChange(ev)}/>
                            {!this.state.isLns ?
                              <FormText><p style={{color: 'red'}}>Please input only 4 digits</p>
                              </FormText> : ""}
                          </Col>
                          <Col xs="12" md="2">
                            <Label htmlFor="effective_date">Effective Date *</Label>
                            {/*<Input id="ed" name="ed" type="text" onChange={(ev)=>this.handleChange(ev)} placeholder="MM/DD/YYYY"/>*/}
                            <div>
                            <DatePicker
                              placeholderText="MM/DD/YYYY"
                              selected={this.state.startDate}
                              onChange={this.handle}
                              className="form-control"
                            />
                            </div>
                            {!this.state.isEd ?
                              <FormText><p style={{color: 'red'}}>Please input effective date</p></FormText> : ""}
                          </Col>
                          <Col xs="12" md="6">
                            <Row>
                              <Col xs="10">
                                <Label htmlFor="et">Effective Time</Label>
                                <Input type="text" name="et" id="et" placeholder="HH:MM AM/PM" onChange={(ev)=>this.handleChange(ev)}/>
                                {!this.state.isEt ?
                                  <FormText><p style={{color: 'red'}}>Please input or check the effective time</p>
                                  </FormText> : ""}
                              </Col>
                              <Col xs="2">
                                <Label htmlFor="now">Now</Label>
                                <Input type="checkbox" name="now" id="now" className="form-control ml-2" onChange={(ev) => this.setState({now: ev.target.checked})}/>
                              </Col>
                            </Row>
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </CardBody>
                  <CardFooter>
                    <Row>
                      <Col xs="6">
                        <Button size="md" color="primary" className="mr-2" onClick={this.activate}>Search,Reserve & Activate</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button size="md" color="danger" onClick={this.reset}>Reset</Button>
                      </Col>
                    </Row>
                  </CardFooter>
                </Collapse>
              </Card>
            </Fade>
          </Col>
          <Col xs="12">
            <Fade timeout={this.state.timeout_setting} in={this.state.fadeIn_setting}>
              <Card>
                <CardHeader>
                  <strong>Result</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle_setting.bind(this)}><i
                      className={this.state.collapse_setting ? "icon-arrow-up" : "icon-arrow-down"}/></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse_setting} id="collapseExample">
                  <CardBody>
                    {this.state.isResult &&
                    <table className="table table-bordered" style={{width: '100%'}}>
                      <thead>
                      <tr>
                        <th className="text-center">Toll Free Number</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Message</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td className="text-center">{this.state.active_number}</td>
                        <td>
                          <div className="row">
                            <div className="col-4"><i className="fa fa-check-circle-o"
                                                      style={{fontSize: 25, color: "green"}}/></div>
                            <div className="col-8">PENDING</div>
                          </div>
                        </td>
                        <td className="text-center">Success one click activation</td>
                      </tr>
                      </tbody>
                    </table>
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

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(OneClick));
