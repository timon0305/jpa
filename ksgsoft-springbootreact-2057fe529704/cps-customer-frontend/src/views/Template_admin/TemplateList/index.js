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
  Collapse,
  FormText, Modal, ModalHeader, ModalBody

} from 'reactstrap';
import {connect} from 'react-redux'
import {Loader} from 'react-overlay-loader';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import '../../../scss/react-table.css'
import {
  verb,
  timeout,
  template_list,
  temp, state_value, approval_type,
} from '../../../service/template'
import Cookies from 'universal-cookie';
import {error_customer_query_message} from "../../../service/error_message";
import RestApi from "../../../service/RestApi";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";

const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
let name = '';
class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_setting: 300,
      display: true,
      data: [],
      entity: "",
      template: "",
      isEntity: true,
      isTemplate: true,
      large: false,
      lists: [],
      tem: '',
      message: '',
      ed: '',
      et: '',
      isResult: false,
      datas: [],
      checked: false,
    };
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }

  toggle_setting() {
    this.setState({collapse_setting: !this.state.collapse_setting});
  }

  /* Retrieve Template
  * request params: entity or template name
  * */
  retrieve_template = async () => {
    this.setState({display: false, isResult: false});
    if (this.state.entity === "" && this.state.template === "") {
      toast.warn("Please input entity or template name");
      return false;
    }
    //Get the MGI message for retrieving.
    let message = template_list(this.props.somos.id, this.props.somos.ro, this.state.entity, this.state.template);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRL', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      //Pull need data from converted message.
      let datas = message.value(["TMPLTNM", "DESCRIP", "ED", "ET"]);
      let data = [];
      let params = {};
      for (let i = 0; i < datas.length; i++) {
        if (this.state.template) {
          if (this.state.template === datas[i].TMPLTNM.trim()) {
            data = [];
            params = {
              'template_name': datas[i].TMPLTNM,
              'description': datas[i].DESCRIP,
              'date': datas[i].ED + " " + datas[i].ET
            };
            data.push(params);
          }
        } else {
          params = {
            'template_name': datas[i].TMPLTNM,
            'description': datas[i].DESCRIP,
            'date': datas[i].ED + " " + datas[i].ET
          };
          data.push(params);
        }
      }
      this.setState({data: data, isResult: true});
    }
  };

  //Get the input value on change event
  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  //Display modal.
  handle = async (template) => {
    //Display Loading and Modal.
    this.setState({large: !this.state.large, message: ''});
    //Get the MGI message for retrieving.
    let message = template_list(this.props.somos.id, this.props.somos.ro, this.state.entity, template);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRL', 'message': message, 'timeout': timeout});
    let data = [], params = {};
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      let datas = message.value(["TMPLTNM","ED","ET"]);
      for (let i = 0; i< datas.length; i++) {
        if (template.trim() === datas[i].TMPLTNM.trim()) {
          params = {
            'template_name': datas[i].TMPLTNM.trim(),
            'date': datas[i].ED + " " + datas[i].ET
          };
          data.push(params);
        }
      }
      let result = [];
      for (let i = 0; i<data.length; i++) {
        message = temp(this.props.somos.id, this.props.somos.ro, data[i].template_name, data[i].date);
        let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRV', 'message': message, 'timeout': timeout});
        if (res.ok && res.data && res.data.message) {
          let message = new MgiMessage(res.data.message);
          let datas = message.value(["ED", "ET", "STAT", "APP"]);
          result.push(datas);
          this.setState({
            lists: datas,
            tem: message.value("TMPLTNM")[0],
            ed: message.value("ED")[0],
            et: message.value("ET")[0],
            message: error_customer_query_message(message.value("ERR")[0]),
          })
        }
      }
      this.setState({datas: result});
    }
  };

  closeModal = () => {
    this.setState({large: false});
  };

  /*
  * Set cookie
  * @params: template, ed, et
  * */
  set_cookie = () => {
    const cookies = new Cookies();
    cookies.set("template", this.state.tem);
    cookies.set("ed", this.state.ed);
    cookies.set("et", this.state.et);
  };

  //Go TAD
  tad = () => {
    if (this.state.checked) {
      this.set_cookie();
      this.props.navigate('/template_admin/template_data');
    } else {
      toast.warn("Please select template!")
    }
  };

  //Go LAD
  lad = () => {
    if (this.state.checked) {
      this.set_cookie();
      this.props.history.push('/customer_admin/LAD');
    } else {
      toast.warn("Please select template");
    }
  };
  //Go CPR
  cpr = () => {
    if (this.state.checked) {
      this.set_cookie();
      this.props.history.push('/customer_admin/CPR');
    } else {
      toast.warn("Please select template");
    }
  };
  //Get params when event happen in input radio
  onChange = (evt) => {
    if (evt.target.checked) {
      let date = evt.target.id.split(" ");
      this.setState({
        checked: evt.target.checked,
        ed: date[0],
        et: date[1]
      });
    }
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Template Record List</strong></Label>
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
                    <FormGroup row>
                      <Col xs="12" md="6">
                        <Label>Entity</Label>
                        <Input type="text" name="entity" id="entity" onChange={(ev) => this.handleChange(ev)}/>
                        {!this.state.isEntity ?
                          <FormText><p style={{color: 'red'}}>Enter only 2 character Entity ID and Optional.</p>
                          </FormText> : ""}
                      </Col>
                      <Col xs="12" md="6">
                        <Label>Starting Template Name</Label>
                        <Input type="text" name="template" id="template" onChange={(ev) => this.handleChange(ev)}/>
                        {!this.state.isTemplate ?
                          <FormText><p style={{color: 'red'}}>Template Name: Must start with `*', then a valid 2
                            character Entity ID, followed by 1-12 alphanumerics. Must be 4-15 characters wide. Dashes
                            are optional in the 4th-15th character positions.</p>
                          </FormText> : ""}
                      </Col>
                    </FormGroup>
                    <Button size="md" color="primary" className="mt-3"
                            onClick={this.retrieve_template}>Retrieve</Button>
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
                    <table className="table table-responsive-lg">
                      <thead>
                      <tr>
                        <th>Template Name</th>
                        <th>Template Description</th>
                        <th>Effective Date/Time</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.data.map(value => {
                          if (name === '' || name !== value.template_name) {
                            name = value.template_name;
                            return <tr onDoubleClick={() => this.handle(value.template_name)}>
                              <td>{value.template_name}</td>
                              <td>{value.description}</td>
                              <td>{value.date}</td>
                            </tr>
                          }
                        }
                      )}
                      </tbody>
                    </table>
                    }
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
            <Modal isOpen={this.state.large} toggle={this.closeModal}
                   className={'modal-lg ' + this.props.className}>
              <ModalHeader toggle={this.closeModal}>
                Template Record Selection
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs="3">Template Name:</Col>
                  <Col xs="3"><Input type="text" id="tem" name="tem" className="form-control-sm" value={this.state.tem}
                                     onChange={(ev) => this.handleChange(ev)}/></Col>
                  {/*<Col xs="3"><Button color="primary" size="sm" onClick={this.retrieve_template}>Retrieve</Button></Col>*/}
                </Row>
                <Card className="mt-3">
                  <CardHeader>Template Record List</CardHeader>
                  <CardBody>
                    <Card>
                      <CardBody>
                        <table style={{width: '100%'}}>
                          <thead>
                          <tr>
                            <th style={{width: '10%'}}/>
                            <th>Eff.Date</th>
                            <th>Time</th>
                            <th>CR Status</th>
                            <th>Approval</th>
                            <th>Components</th>
                          </tr>
                          </thead>
                          <tbody className="mt-2">
                          {this.state.datas.map((e) => {
                            return <tr style={{borderWidth: 1, borderStyle: 'solid', borderColor: '#c8ced3'}}>
                              <td><input type="radio" className="form-control-sm" style={{marginLeft: 15}} onChange={(evt) => this.onChange(evt)} id={e[0].ED + " " + e[0].ET} name="template"/></td>
                              <td>{e[0].ED}</td>
                              <td>{e[0].ET}</td>
                              <td>{state_value(e[0].STAT.toString())}</td>
                              <td>{approval_type(e[0].APP)}</td>
                              <td/>
                            </tr>
                          })}
                          </tbody>
                        </table>
                      </CardBody>
                    </Card>
                    <FormGroup row className="mt-2 ml-4">
                      <Button size="sm" color="primary" className="mr-5" onClick={this.tad}>TAD</Button>
                      <Button size="sm" color="primary" className="mr-5" onClick={this.cpr}>CPR</Button>
                      <Button size="sm" color="primary" className="mr-5" onClick={this.lad}>LAD</Button>
                      <Button size="sm" color="primary" className="mr-5">Transfer</Button>
                      <Button size="sm" color="primary" className="mr-5">Delete</Button>
                    </FormGroup>
                    <Card>
                      <CardBody>
                        <Row>
                          <Col xs="2"><Label className="text-right">Message:</Label></Col>
                          <Col xs="10"><Input type="textarea" id="message" name="message" value={this.state.message}/></Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </CardBody>
                </Card>
              </ModalBody>
            </Modal>
          </Col>
        </Row>
        <ToastContainer hideProgressBar autoClose={1000}/>
      </div>
    );
  }
}

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(TemplateList));
