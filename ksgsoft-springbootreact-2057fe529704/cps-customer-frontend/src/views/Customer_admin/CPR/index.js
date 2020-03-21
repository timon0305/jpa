import React, {Component} from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Label,
  Row,
} from 'reactstrap';
import api from "../../../service/api";
import {Loader} from 'react-overlay-loader';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import "react-datepicker/dist/react-datepicker.css";
import {verb, timeout} from "../../../service/customer";
import {error_customer_query_message} from "../../../service/error_message";
import {approval_type, state_value, temp} from "../../../service/template";
import Cookies from 'universal-cookie';
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";


const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;


class CPR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activeTab: '1',
      num: "",
      sfed: '',
      ed: "",
      et: '',
      ro: '',
      approval: '',
      last: '',
      prev_user: '',
      by: '',
      action: '',
      message: '',
      isDate: true,
      retrieve: false,
      update: false,
      save: false,
      partial_save: false,
      copy: false,
      transfer: false,
      delete: false,
      cpr: false,
      lad: false,
      rec: false,
      disable: false,
      large: false,
      ed_origin: "",
      et_origin: '',
      ed_copy: '',
      et_copy: '',
      gridType: Array(10).fill(''),
      gridData: Array(7).fill(Array(10).fill('')),
      iec: [],
      iac: [],
      timezone: '',
      ds: '',
    };
  }

  componentDidMount = () => {
    const cookies = new Cookies();
    let template = cookies.get("template");
    let ed = cookies.get("ed");
    let et = cookies.get("et");
    if (template && ed && et) {
      cookies.remove("template");
      cookies.remove("ed");
      cookies.remove("et");
      this.setState({template: template});
      this.setState({sfed: ed + " " + et});
      this.retrieve_template(template, ed + " " + et);
    }
  };

  handle(event) {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);

    console.log(this.state.action);
    setTimeout(() => {
      if (this.state.action === "N") {
        this.setState({isDate: false});
      } else {
        this.setState({isDate: true});
      }
    }, 200);
  }

  handleChange = (ev) => {
    let name = ev.target.name.split("_");
    let newArray = this.state.gridType.map(function (arr) {
      return arr.slice();
    });
    newArray[name[1]] = ev.target.value;
    this.setState({gridType: newArray});
  };

  handleValue = (ev) => {
    console.log(ev.target.value);
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridData.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[0];
    let col = indexes[1];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridData: newArray});
  };

  retrieve_template = (template, sfed) => {
    let message = temp(template, sfed);
    console.log(message);
    this.setState({loading: true});
    api.sendNew({
      'verb': verb,
      'mod': 'CRV',
      'message': message,
      'timeout': timeout
    }).then(res => {
      this.setState({loading: false});
      const message = new MgiMessage(res.data.message);
      console.log(res.data.message);
      let error = message.value("ERR");
      this.setState({
        ro: message.value("CRO")[0],
        sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()),
        approval: approval_type(message.value("APP")[0]),
        message: error_customer_query_message(error[0]),
        ed_origin: message.value("ED")[0],
        et_origin: message.value("ET")[0],
        timezone: message.value("Z")[0],
        ds: message.value("DS")[0],
      });

      let iec = message.value("IEC")[0].split(",");
      let iac = message.value("IAC")[0].split(",");
      let iecs = [];
      let iacs = [];
      for (let i = 1; i< iec.length; i++) {
        iecs.push(iec[i]);
      }
      for (let i = 1; i<iac.length; i++) {
        iacs.push(iac[i]);
      }
      let types = message.value("NODE")[0];
      types = types.split(",");
      let newArray = this.state.gridType.map(function (arr) {
        return arr.slice();
      });
      for (let i=1; i< types.length; i++) {
        newArray[i-1] = types[i];
      }
      this.setState({
        gridType: newArray,
        iec: iecs,
        iac: iacs
      });
      let datas = message.value("V");
      let newDatas = this.state.gridData.map(function (arr) {
        return arr.slice();
      });
      for (let i = 0; i<datas.length;i++) {
        let data = datas[i].split(",");
        for (let j = 0; j<data.length ; j++) {
          newDatas[j][i] = data[j];
        }
      }
      this.setState({gridData: newDatas});
    }).catch(err => {
      this.setState({loading: false});
      console.log(err);
      toast.warn("Server Connection Error!");
    })
  };

  updateCpr = () => {
  };
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  toggleLarge = () => {
    this.setState({large: !this.state.large});
  };

  insertCprCell = () => {
    let newArray = this.state.gridData.map(function (arr) {return arr.slice();});
    newArray.push(Array(10).fill(""));
    this.setState({gridData: newArray})
  };

  deleteCprCell = () => {
    let newArray = this.state.gridData.map(function (arr) {return arr.slice();});
    newArray.splice(this.state.gridData.length -1, 1);
    this.setState({gridData: newArray})
  };


  render() {
    return (
      <div className="animated fadeIn mt-1">
        <Label className="ml-1"><strong style={{fontSize: 25}}>Call Processing</strong></Label>
        <Row>
          <Col xs="12">
            <Card>
              <div className="mt-3 mb-1 ml-4 mr-4 border"
                   style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Row className="mt-2 ml-4 mr-4">
                  <Col xs="12" md="6" className="row">
                    <p className="col-5 font-weight-bold">Dial#/Template Name *:</p>
                    <Input className="col-4 form-control-sm" type="text" name="template" id="template"
                           onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                  </Col>
                  <Col xs="12" md="6" className="row">
                    <Label className="col-5 ">Eff.Date/Time/Status</Label>
                    <Input className="col-4 form-control-sm" type="text" name="sfed" id="sfed"
                           onChange={(ev) => this.handle(ev)}
                           value={this.state.sfed} disabled={this.state.disable}/>
                  </Col>
                </Row>
              </div>
              <div className="mb-1 ml-4 mr-4 border"
                   style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Row className="mb-1 ml-4 mr-4 mt-2">
                  <Col xs="12" md="3" className="row">
                    <Label className="col-6 font-weight-bold text-right">Resp Org:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="ro" id="ro"
                           onChange={(ev) => this.handle(ev)} value={this.state.ro} disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="3" className="row">
                    <Label className="col-6 text-right">Approval:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="approval" id="approval"
                           onChange={(ev) => this.handle(ev)} value={this.state.approval}
                           disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">Last:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="last" id="last"
                           onChange={(ev) => this.handle(ev)} value={this.state.last}
                           disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">Prev User:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="prev_user" id="prev_user"
                           onChange={(ev) => this.handle(ev)} value={this.state.prev_user}
                           disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">By:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="by" id="by"
                           onChange={(ev) => this.handle(ev)} value={this.state.by}
                           disabled={this.state.disable}/>
                  </Col>
                </Row>
              </div>

              <div className="mb-1 ml-4 mr-4 mt-1 mb-1 border"
                   style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Col xs="12" md="8" className="row mr-4 ml-4 mt-2 mb-2">
                  <Label className="col-2 font-weight-bold">Section:</Label>
                  <Input className="col-2 form-control-sm" type="select" name="section" id="section"
                         onChange={(ev) => this.handle(ev)}>
                    <option>Main</option>
                    <option>Sub</option>
                  </Input>
                  <Button size="sm" color="primary" className="ml-4">Add Section</Button>
                  <Button size="sm" color="primary" className="ml-4">Delete Section</Button>
                </Col>
                <Col xs="12" className="mt-2 mb-1">
                  <table className="table-bordered">
                    <thead>
                    <tr>
                      {this.state.gridType.map((value) => {
                        if (value === "TI")
                          value = "Time";
                        else if (value === "DT")
                          value = "Date";
                        else if (value === "DA")
                          value = "Day";
                        else if (value === "LT")
                          value = "LATA";
                        else if (value === "ST")
                          value = "State";
                        else if (value === "AC")
                          value = "Area Code";
                        else if (value === "NX")
                          value = "NXX";
                        else if (value === "SW")
                          value = "Switch";
                        else if (value === "PC")
                          value = "Percent";
                        else if (value === "CA")
                          value = "Carrier";
                        else if (value === "AN")
                          value = "Announcement";
                        else if (value === "TE")
                          value = "Terminate";
                        else if (value === "SD")
                          value = "6-digit";
                        else if (value === "TD")
                          value = "10-digit";
                        else if (value === "GT")
                          value = "Go to";
                        else if (!value)
                          value = "<select>";
                        return (
                          <th className="text-center">{value}</th>
                        )
                      })}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      {this.state.gridType.map((value, i) => {
                        return (
                          <td>
                            <Input type="select" name={'type_' + i} className="form-control-sm" value={value}
                                   onChange={(ev) => this.handleChange(ev)}>
                              <option>select</option>
                              <option value="TI">Time</option>
                              <option value="DT">Date</option>
                              <option value="DA">Day</option>
                              <option value="LT">LATA</option>
                              <option value="ST">State</option>
                              <option value="AC">Area Code</option>
                              <option value="NX">NXX</option>
                              <option value="SW">Switch</option>
                              <option value="PC">Percent</option>
                              <option value="CA">Carrier</option>
                              <option value="AN">Announcement</option>
                              <option value="TE">Terminate</option>
                              <option value="SD">6-digit</option>
                              <option value="TD">10-digit</option>
                              <option value="GT">Go to</option>
                            </Input>
                          </td>
                        )
                      })}
                    </tr>
                    {
                      this.state.gridData.map((datas, k) => {
                        return (
                          <tr>
                            {
                              datas.map((data, g) => {
                                return (
                                  <td><Input type="text" className="form-control-sm" name={k + "_" + g}
                                             value={data} onChange={(ev) => this.handleValue(ev)}/></td>
                                )
                              })
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div className="mt-2">
                    <Button size="sm" color="primary" onClick={this.insertCprCell}>Insert Cell</Button>
                    <Button size="sm" color="primary" onClick={this.deleteCprCell} className="ml-3">Delete Cell</Button>
                  </div>
                </Col>
              </div>
              <Row>
                <Col xs="12">
                  <div className="mb-1 ml-4 mr-4 border"
                       style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '##f0f3f5'}}>
                    <div className="ml-4 mr-4 mt-2 mb-2 row">
                      <Col xs="3" className="row">
                        <Col xs="6">IntraLATA Carrier:</Col>
                        <Col xs="6"><Input type="select" className="form-control-sm">
                          {this.state.iac.map(value => {
                            return <option value={value}>{value}</option>
                          })}
                        </Input></Col>
                      </Col>
                      <Col xs="3" className="row">
                        <Col xs="6">InterLATA Carrier:</Col>
                        <Col xs="6"><Input type="select" className="form-control-sm">
                          {this.state.iec.map(value => {
                            return <option value={value}>{value}</option>
                          })}
                        </Input></Col>
                      </Col>
                      <Col xs="3" className="row">
                        <Col xs="6">Time Zone:</Col>
                        <Col xs="6"><Input type="select"
                                           className="form-control-sm" value={this.state.timezone}>
                          <option/>
                          <option value="C">Central</option>
                          <option value="A">Atlantic</option>
                          <option value="B">Bering</option>
                          <option value="E">Eastern</option>
                          <option value="H">Hawaiian-Aleutian</option>
                          <option value="M">Mountain</option>
                          <option value="N">Newfoundland</option>
                          <option value="P">Pacific</option>
                          <option value="Y">Alaska</option>
                        </Input>
                        </Col>
                      </Col>
                      <Col xs="3" className="row">
                        <Col xs="6" className="text-right"><Input type="checkbox" checked={this.state.ds === "Y"}/></Col>
                        <Col xs="6">Daylight Savings</Col>
                      </Col>
                    </div>

                  </div>
                </Col>
              </Row>
              <Card className="ml-4 mr-4">
                <div className="row mt-2 mb-2">
                  <Label className="col-2 text-right">Message:</Label>
                  <Input className="col-8" type="textarea" name="message" id="message"
                         onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                </div>
              </Card>
              <div className="ml-4 mr-4 mb-2">
                <Row>
                  <Col xs="12">
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.retrieve}
                            onClick={() => this.retrieve_template(this.state.template)}>Retrieve</Button>
                    <Button size="md" color="primary" className="mr-4"
                            disabled={this.state.update} onClick={this.updateCpr}>Update</Button>
                    <Button size="md" color="primary" className="mr-4"
                            disabled={this.state.save} onClick={this.saveCad}>Save</Button>
                    <Button size="md" color="primary" className="mr-4"
                            disabled={this.state.copy} onClick={this.toggleLarge}>Copy</Button>
                    <Button size="md" color="primary" className="mr-4"
                            disabled={this.state.transfer}>Transfer</Button>
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.delete}>Delete</Button>
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.delete}>Other</Button>
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.delete}>CAD/TAD</Button>
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.lad}>LAD</Button>
                    <Button size="md" color="primary" className="mr-4" disabled={this.state.lad}>REC/TEC</Button>
                    <Button size="md" color="primary" className="mr-4">Clear</Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withLoadingAndNotification(CPR);
