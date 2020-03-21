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
  Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import api from "../../../service/api";
import {Loader} from 'react-overlay-loader';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import "react-datepicker/dist/react-datepicker.css";
import {verb, timeout} from "../../../service/customer";
import {error_customer_query_message, error_customer_record_message} from "../../../service/error_message";
import classnames from "classnames";
import {approval_type,  state_value, temp, validLAD,} from "../../../service/template";
// import storage from "../../../service/storage";
import Cookies from 'universal-cookie';
import moment from "moment/moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";


const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;


class LAD extends Component {
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
      message: '',
      isDate: false,
      isArea: false,
      isLATA: false,
      isNXX: false,
      isState: false,
      isTel: false,
      isSD: false,
      isTD: false,
      isTime: false,
      retrieve: false,
      update: false,
      save: false,
      copy: false,
      transfer: false,
      delete: false,
      cpr: false,
      rec: false,
      revert: true,
      disable: false,
      large: false,
      ed_origin: "",
      et_origin: '',
      ed_copy: moment(),
      et_copy: moment(),
      ed_delete: moment(),
      et_delete: moment(),
      ac: [],
      dt: [],
      lata: [],
      nxx: [],
      state: [],
      tel: [],
      time: [],
      td: [],
      sd: [],
      gridArea: Array(5).fill(Array(11).fill('')),
      gridDate: Array(5).fill(Array(11).fill('')),
      gridLATA: Array(5).fill(Array(11).fill('')),
      gridNXX: Array(5).fill(Array(11).fill('')),
      gridState: Array(5).fill(Array(11).fill('')),
      gridTel: Array(5).fill(Array(11).fill('')),
      gridTime: Array(5).fill(Array(11).fill('')),
      gridTD: Array(5).fill(Array(11).fill('')),
      gridSD: Array(5).fill(Array(11).fill('')),
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
  }

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
      let values = message.value(["TYPE","DEF","LBL"]);
      let ro = message.value("CRO");
      let error = message.value("ERR");
      console.log(error);
      this.setState({
        ro: message.value("CRO")[0],
        sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()),
        approval: approval_type(message.value("APP")[0]),
        message: error_customer_query_message(error[0]),
        ed_origin: message.value("ED")[0],
        et_origin: message.value("ET")[0]
      });
      console.log(ro);
      let lts = []; let lt = []; let acs = []; let ac = [];let dts = []; let dt = [];let sts = []; let st = [];let nxs = [];
      let nx = [];let tis = []; let ti = [];let sds = []; let sd = [];let tds = []; let td = [];let tes = []; let te = [];

      for (let i = 0; i<values.length; i++) {
        let value = values[i];
        if (value.TYPE === "LT") {
          lt.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            lt.push(defs[j]);
          }
          lts.push(lt);
          lt = [];
        } else if (value.TYPE === "SD") {
          sd.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            sd.push(defs[j]);
          }
          sds.push(sd);
          sd = [];
        }else if (value.TYPE === "AC") {
          ac.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            ac.push(defs[j]);
          }
          acs.push(ac);
          ac = [];
        }else if (value.TYPE === "DT") {
          dt.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            dt.push(defs[j]);
          }
          dts.push(dt);
          dt = [];
        }else if (value.TYPE === "ST") {
          st.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            st.push(defs[j]);
          }
          sts.push(st);
          st = [];
        }else if (value.TYPE === "NX") {
          nx.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            nx.push(defs[i]);
          }
          nxs.push(nx);
          nx = [];
        }else if (value.TYPE === "TI") {
          ti.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            ti.push(defs[i]);
          }
          tis.push(ti);
          ti = [];
        }else if (value.TYPE === "TD") {
          td.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            td.push(defs[j]);
          }
          tds.push(td);
          td = [];
        }else if (value.TYPE === "TE") {
          te.push(value.LBL);
          let defs = value.DEF.split(",");
          for (let j = 1; j<defs.length; j++) {
            te.push(defs[j]);
          }
          tes.push(te);
          te = [];
        }
      }

      if (lts && lts.length) {
        let newArray = this.state.gridLATA.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< lts.length ; i++) {
          for (let j = 0; j<lts[i].length; j++) {
            newArray[i][j] = lts[i][j];
          }
        }
        this.setState({gridLATA: newArray, isLATA: true});
      }
      if (sds && sds.length) {
        let newArray = this.state.gridSD.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< sds.length ; i++) {
          for (let j = 0; j<sds[i].length; j++) {
            newArray[i][j] = sds[i][j];
          }
        }
        this.setState({gridSD: newArray, isSD: true});
      }
      if (acs && acs.length) {
        let newArray = this.state.gridArea.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< lts.length ; i++) {
          for (let j = 0; j<lts[i].length; j++) {
            newArray[i][j] = lts[i][j];
          }
        }
        this.setState({gridArea: newArray, isArea: true});
      }
      if (dts && dts.length) {
        let newArray = this.state.gridData.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< dts.length ; i++) {
          for (let j = 0; j<dts[i].length; j++) {
            newArray[i][j] = dts[i][j];
          }
        }
        this.setState({gridData: newArray, isDate: true});
      }
      if (sts && sts.length) {
        let newArray = this.state.gridState.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< sts.length ; i++) {
          for (let j = 0; j<sts[i].length; j++) {
            newArray[i][j] = sts[i][j];
          }
        }
        this.setState({gridState: newArray, isState: true});
      }
      if (nxs && nxs.length) {
        let newArray = this.state.gridNXX.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< nxs.length ; i++) {
          for (let j = 0; j<nxs[i].length; j++) {
            newArray[i][j] = nxs[i][j];
          }
        }
        this.setState({gridNXX: newArray, isNXX: true});
      }
      if (tis && tis.length) {
        let newArray = this.state.gridTime.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< tis.length ; i++) {
          for (let j = 0; j<tis[i].length; j++) {
            newArray[i][j] = tis[i][j];
          }
        }
        this.setState({gridTime: newArray, isTime: true});
      }
      if (tds && tds.length) {
        let newArray = this.state.gridTD.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< tds.length ; i++) {
          for (let j = 0; j<tds[i].length; j++) {
            newArray[i][j] = tds[i][j];
          }
        }
        this.setState({gridTD: newArray, isTD: true});
      }
      if (tes && tes.length) {
        let newArray = this.state.gridTel.map(function (arr) {
          return arr.slice();
        });
        for (let i = 0; i< tes.length ; i++) {
          for (let j = 0; j<tes[i].length; j++) {
            newArray[i][j] = tes[i][j];
          }
        }
        this.setState({gridTel: newArray, isTel: true});
      }

    }).catch(err => {
      this.setState({loading: false});
      console.log(err);
    })
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

  handleAreaChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridArea.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridArea: newArray});
  };

  handleDateChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridDate.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridDate: newArray});
  };

  handleLATAChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridLATA.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridLATA: newArray});
  };

  handleNXXChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridNXX.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridNXX: newArray});
  };

  handleStateChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridState.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridState: newArray});
  };

  handleTelChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridTel.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridTel: newArray});
  };

  handleTimeChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridTime.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridTime: newArray});
  };

  handleTdChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridTD.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridTD: newArray});
  };

  handleSdChange = (ev) => {
    let indexes = ev.target.name.split("_");
    let newArray = this.state.gridSD.map(function (arr) {
      return arr.slice();
    });
    let row = indexes[1];
    let col = indexes[2];
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
    this.setState({gridSD: newArray});
  };

  updateLAD = () => {

  };

  copy_lad = () => {

  }

  goCpr = () => {
    const cook = new Cookies();
    cook.set("template", this.state.template);
    this.props.history.push('/customer_admin/cpr');
  };

  copyDate = (date) => {
    this.setState({ed_copy: date})
  };

  copyTime = (time) => {
    this.setState({et_copy: time});
  }

  deleteDate = (date) => {
    this.setState({ed_delete: date})
  }

  deleteTime = (time) => {
    this.setState({et_delete: time})
  }

  insertCell = (type) => {
    if (type === "AC") {
      let newArray = this.state.gridArea.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridArea: newArray})
    } else if (type === "DT") {
      let newArray = this.state.gridDate.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridDate: newArray})
    } else if (type === "LT") {
      let newArray = this.state.gridLATA.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridLATA: newArray})
    } else if (type === "TD") {
      let newArray = this.state.gridTD.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridTD: newArray})
    } else if (type === "SD") {
      let newArray = this.state.gridSD.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridSD: newArray})
    } else if (type === "NX") {
      let newArray = this.state.gridNXX.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridNXX: newArray})
    } else if (type === "TI") {
      let newArray = this.state.gridTime.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridTime: newArray})
    } else if (type === "TL") {
      let newArray = this.state.gridTel.map(function (arr) {return arr.slice()});
      newArray.push(Array(11).fill(""));
      this.setState({gridTel: newArray})
    } else if (type === "ST") {
      let newArray = this.state.gridState.map(function (arr) {return arr.slice();});
      newArray.push(Array(11).fill(""));
      this.setState({gridState: newArray})
    }
  };

  deleteCell = (type) => {
    if (type === "AC") {
      let newArray = this.state.gridArea.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridArea.length -1, 1);
      this.setState({gridArea: newArray})
    } else if (type === "TI") {
      let newArray = this.state.gridTime.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridTime.length -1, 1);
      this.setState({gridTime: newArray})
    } else if (type === "TD") {
      let newArray = this.state.gridTD.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridTD.length -1, 1);
      this.setState({gridTD: newArray})
    } else if (type === "SD") {
      let newArray = this.state.gridSD.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridSD.length -1, 1);
      this.setState({gridSD: newArray})
    } else if (type === "TL") {
      let newArray = this.state.gridTel.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridTel.length -1, 1);
      this.setState({gridTel: newArray})
    } else if (type === "ST") {
      let newArray = this.state.gridState.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridState.length -1, 1);
      this.setState({gridState: newArray})
    } else if (type === "NX") {
      let newArray = this.state.gridNXX.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridNXX.length -1, 1);
      this.setState({gridNXX: newArray})
    } else if (type === "DT") {
      let newArray = this.state.gridDate.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridDate.length -1, 1);
      this.setState({gridDate: newArray})
    } else if (type === "LT") {
      let newArray = this.state.gridLATA.map(function (arr) {return arr.slice();});
      newArray.splice(this.state.gridLATA.length -1, 1);
      this.setState({gridLATA: newArray})
    }
  }

  render() {
    return (
      <div className="animated fadeIn mt-1">
        <Label className="ml-1"><strong style={{fontSize: 25}}>Label Definition</strong></Label>
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
                <div className="ml-2 mr-2 mt-1 mb-1">
                  <Nav tabs className="custom">
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '1'})}
                        onClick={() => {
                          this.toggle('1');
                        }}
                      >
                        Area Code {this.state.isArea && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '2'})}
                        onClick={() => {
                          this.toggle('2');
                        }}
                      >
                        Date {this.state.isDate && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '3'})}
                        onClick={() => {
                          this.toggle('3');
                        }}
                      >
                        LATA {this.state.isLATA && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '4'})}
                        onClick={() => {
                          this.toggle('4');
                        }}
                      >
                        NXX {this.state.isNXX && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '5'})}
                        onClick={() => {
                          this.toggle('5');
                        }}
                      >
                        State {this.state.isState && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '6'})}
                        onClick={() => {
                          this.toggle('6');
                        }}
                      >
                        Tel# {this.state.isTel && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '7'})}
                        onClick={() => {
                          this.toggle('7');
                        }}
                      >
                        Time {this.state.isTime && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '8'})}
                        onClick={() => {
                          this.toggle('8');
                        }}
                      >
                        10-digit# {this.state.isTD && "*"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({active: this.state.activeTab === '9'})}
                        onClick={() => {
                          this.toggle('9');
                        }}
                      >
                        6-digit# {this.state.isSD && "*"}
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridArea.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"AC_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleAreaChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("AC")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("AC")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridDate.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"DT_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleDateChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("DT")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("DT")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridLATA.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"LT_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleLATAChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("LT")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("LT")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="4">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridNXX.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"NX_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleNXXChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("NX")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("NX")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="5">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridState.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"ST_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleStateChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("ST")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("ST")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="6">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridTel.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"TL_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleTelChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("TL")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("TL")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="7">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridTime.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"TI_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleTimeChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("TI")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("TI")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="8">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridTD.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"TD_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleTdChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("TD")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("TD")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                    <TabPane tabId="9">
                      <table className="table-bordered">
                        <thead>
                        <tr>
                          <th style={{width: '13%'}}>Label</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                          <th>Definition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.gridSD.map((value, i) => {
                            return (
                              <tr>
                                {
                                  value.map((element, j) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={"SD_" + i + "_" + j}
                                                 value={element} onChange={(ev) => this.handleSdChange(ev)}/></td>)
                                  })
                                }
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={() => this.insertCell("SD")}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={() => this.deleteCell("SD")} className="ml-3">Delete Cell</Button>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </div>

              <Card className="ml-4 mr-4">
                <div className="row mt-2 mb-2">
                  <Label className="col-2 text-right">Message:</Label>
                  <Input className="col-8" type="textarea" name="message" id="message"
                         onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                </div>
              </Card>
              <FormGroup row className="ml-4 mr-5">
                <Button size="md" color="primary" className="mr-4" disabled={this.state.retrieve}
                        onClick={() => this.retrieve_template(this.state.template)}>Retrieve</Button>
                <Button size="md" color="primary" className="mr-4"
                        disabled={this.state.update} onClick={this.updateLAD}>Update</Button>
                <Button size="md" color="primary" className="mr-4"
                        disabled={this.state.save} onClick={this.saveLAD}>Save</Button>
                <Button size="md" color="primary" className="mr-4"
                        disabled={this.state.copy} onClick={this.toggleLarge}>Copy</Button>
                <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                       className={'modal-lg ' + this.props.className}>
                  <ModalHeader toggle={this.toggleLarge}>Copy LAD</ModalHeader>
                  <ModalBody>
                    <FormGroup row>
                      <Col xs="6">
                        <Card>
                          <CardHeader>Source LAD</CardHeader>
                          <CardBody>
                            <Label htmlFor="ed_origin">Effective Date </Label>
                            <Input type="text" name="ed_origin" id="ed_origin" value={this.state.ed_origin}
                                   disabled/>
                            <Label htmlFor="et_origin">Effective Time</Label>
                            <Input type="text" name="et_origin" id="et_origin" value={this.state.et_origin}
                                   disabled/>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs="6">
                        <Card>
                          <CardHeader>Target LAD</CardHeader>
                          <CardBody>
                            <Label htmlFor="ed_copy">Effective Date </Label>
                            <div>
                              <DatePicker
                                placeholderText="MM/DD/YYYY"
                                selected={this.state.ed_copy}
                                onChange={this.copyDate}
                                className="form-control"
                                showDisabledMonthNavigation
                              />
                            </div>

                            <Label htmlFor="et_copy">Effective Time</Label>
                            <div>
                              <DatePicker
                                selected={this.state.et_copy}
                                onChange={this.copyTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm A"
                                timeCaption="Time"
                                className="form-control"
                                showDisabledMonthNavigation
                              />
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit" size="md" color="primary" className="mr-2"
                            onClick={this.copy_lad}> Copy</Button>
                    <Button type="reset" size="md" color="danger" onClick={this.toggleLarge}> Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button size="md" color="primary" className="mr-4"
                        disabled={this.state.transfer}>Transfer</Button>
                <Button size="md" color="primary" className="mr-4" disabled={this.state.delete}>Delete</Button>
                <Button size="md" color="primary" className="mr-4" disabled={this.state.delete}>CAD/TAD</Button>
                <Button size="md" color="primary" className="mr-4" disabled={this.state.lad} onClick={this.goCpr}>CPR</Button>
                <Button size="md" color="primary" className="mr-4" disabled={this.state.lad}>REC/TEC</Button>
                <Button size="md" color="primary" className="mr-4">Clear</Button>
              </FormGroup>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withLoadingAndNotification(LAD);
