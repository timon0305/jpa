import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from 'react-redux'
import {ToastContainer, toast} from "react-toastify";
import mutate from 'immer'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {verb, timeout} from "../../../service/customer";
import {error_customer_query_message, error_template_query_message} from "../../../service/error_message";
import classnames from "classnames";
import {approval_type, copyTad, create_template, deleteTad, disconnect_template, state_value, temp, template_list, validLAD} from "../../../service/template";
import Cookies from 'universal-cookie';
import _ from 'lodash';
import {delete_cell, fixed_date, handle_change, handle_lad, handle_value_cpr, insert_cell, push_cpr} from "../../../utils";
import RestApi from "../../../service/RestApi";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
let origin_sfed = '';
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class TAD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, activeTab: '1', template: "", isTem: false, sfed: '', ed: "", et: '', ro: '', approval: '', last: '', prev_user: '', by: '', action: 'N', ddt: '', agent: '', directory: '',
      dau: '', tem_id: '', dat: '', list_name: '', list_address: '', ncon: '', ctel: '', notes: '', description: '', network: '', state: '', npa: '', lata: '', tel: '', label: '', iec: '', iac: '',
      lns: '', line: '', message: '', isDate: false, retrieve: false, update: true, copy: true, transfer: true, delete: true, cpr: false, lad: false,
      rec: false, revert: true, disable: false, large: false, ed_origin: "", et_origin: '', toggle_delete: false, isLad: false, isCpr: false, timezone: '', ds: '', isTran: false,
      gridArea: Array(7).fill(Array(11).fill('')), gridDate: Array(7).fill(Array(11).fill('')), gridLATA: Array(7).fill(Array(11).fill('')), gridNXX: Array(7).fill(Array(11).fill('')),
      gridState: Array(7).fill(Array(11).fill('')), gridTel: Array(7).fill(Array(11).fill('')), gridTime: Array(7).fill(Array(11).fill('')), gridTD: Array(7).fill(Array(11).fill('')),
      gridSD: Array(7).fill(Array(11).fill('')), gridType: Array(10).fill(''), gridData: Array(5).fill(Array(10).fill('')), iec_array: [], iac_array: [], dates: [], val: '',
      copy_template: '', copy_cr: false, copy_lad: false, copy_cpr: false, is_cpr: false, is_lad: false, is_cr: false,
      copy_now: false, transfer_now: false, delete_now: false, copy_sfed: null, transfer_sfed: null, delete_sfed: null, disconnect_sfed: '',
    };

    this.initialState = mutate(this.state, (r) => {});
  }
  componentDidMount = () => {
    const cookies = new Cookies();
    let template = cookies.get("template");
    let ed = cookies.get("ed");
    let et = cookies.get("et");
    if (template && ed && et) {
      this.setState({template: template, ed: ed, et: et});
      cookies.remove("template");
      cookies.remove("ed");
      cookies.remove("et");
      this.getTemplateRecord(template, ed + " " + et);
    }
  };
  //get template record with sefd.
  getTemplateRecord = async (template, sfed) => {
    let message = temp(this.props.somos.id, this.props.somos.ro, template, sfed);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRV', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      const message = new MgiMessage(res.data.message);
      console.log(res.data.message);
      message.value("ERR")[0]
        ? this.setState({disable: false, action: "N", message: error_customer_query_message(message.value("ERR")[0])})
        : message.value("ERR1")[0] ? this.setState({message: error_customer_query_message(message.value("ERR1")[0])}) : this.setState({message: "TAD retrieved successfully!", disable: true, action: "C", update: false, copy: true});
      console.log(state_value(message.value("STAT")[0].toString()));
      if (state_value(message.value("STAT")[0].toString())  === "ACTIVE") {
        this.setState({copy: false, update: true, transfer: true, delete: true})
      } else {
        this.setState({copy: false, update: true, transfer: false, delete: false})
      }

      let iec = "", iac="", net = "";
      // Remove the first element in array
      if (message.value("IEC")[0]) {iec = message.value("IEC")[0].split(",");iec = iec.splice(1, iec.length - 1);}
      if (message.value("IAC")[0]) {iac = message.value("IAC")[0].split(",");iac = iac.splice(1, iac.length - 1);}
      if (message.value("ANET")[0]) {net = message.value("ANET")[0].split(",");net = net.splice(1, net.length - 1);}

      message.value("NODE")[0] ? this.setState({is_cpr: false}) : this.setState({is_cpr: true});
      message.value("CNT12")[0] ? this.setState({is_lad: false}) : this.setState({is_lad: true});
      let lts = [], acs = [], dts = [], sts = [], nxs = [], tis = [], sds = [], tds = [], tel = [];
      //Push the data in 2 dimentional array for LAD.
      let values = message.value(["TYPE", "DEF", "LBL"]);
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        if (value.TYPE === "LT") {lts = push_cpr(lts, value);
        } else if (value.TYPE === "SD") {sds = push_cpr(sds, value);
        } else if (value.TYPE === "AC") {acs = push_cpr(acs, value);
        } else if (value.TYPE === "DT") {dts = push_cpr(dts, value);
        } else if (value.TYPE === "ST") {sts = push_cpr(sts, value);
        } else if (value.TYPE === "NX") {nxs = push_cpr(nxs, value);
        } else if (value.TYPE === "TI") {tis = push_cpr(tis, value);
        } else if (value.TYPE === "TD") {tds = push_cpr(tds, value);
        } else if (value.TYPE === "TE") {tel = push_cpr(tel, value);
        }
      }
      if (lts && lts.length) {this.setState({gridLATA: lts, isLATA: true});}
      if (sds && sds.length) {this.setState({gridSD: sds, isSD: true});}
      if (acs && acs.length) {this.setState({gridArea: acs, isArea: true});}
      if (dts && dts.length) {this.setState({gridData: dts, isDate: true});}
      if (sts && sts.length) {this.setState({gridState: sts, isState: true});}
      if (nxs && nxs.length) {this.setState({gridNXX: nxs, isNXX: true});}
      if (tis && tis.length) {this.setState({gridTime: tis, isTime: true});}
      if (tds && tds.length) {this.setState({gridTD: tds, isTD: true});}
      if (tel && tel.length) {this.setState({gridTel: tel, isTel: true});}
      let types = message.value("NODE")[0];
      let datas = message.value("V");
      let newArray = this.state.gridType.map(function (arr) {return arr.slice();});
      let newDatas = this.state.gridData.map(function (arr) {return arr.slice();});
      if (types && datas) {
        types = types.split(",");
        for (let i = 1; i < types.length; i++) {
          newArray[i - 1] = types[i];
        }
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i].split(",");
          for (let j = 0; j < data.length; j++) {
            newDatas[j][i] = data[j];
          }
        }
      }
      let dates = this.state.dates;
      if (dates === []) {
        dates.push(message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()));
        this.setState({dates: dates});
      } else if (dates.length === 1) {
        let newDate = [];
        newDate.push(message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()));
        this.setState({dates: newDate});
      }
      this.setState({ncon: message.value("NCON")[0], ctel: message.value("CTEL")[0], ro: message.value("CRO")[0], approval: approval_type(message.value("APP")[0]),
        tem_id: message.value("TMPLTID")[0], template: message.value("TMPLTNM")[0], copy_template: message.value("TMPLTNM")[0], description: message.value("DESCRIP")[0],
        sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()), notes: message.value("NOTE")[0],
        network: net.toString(), message: error_customer_query_message(message.value("ERR")[0]), line: message.value("LNS")[0], iec: iec.toString(), iac: iac.toString(),
        iec_array: iec, iac_array: iac, ed_origin: message.value("ED")[0], et_origin: message.value("ET")[0], timezone: message.value("Z")[0], ds: message.value("DS")[0],
        gridType: newArray, gridData: newDatas});
      origin_sfed = message.value("ED")[0] + " " + message.value("ET")[0];
    }
  };

  //Retrieve template
  retrieve_template = async (template, sfed) => {
    if (sfed === "") {
      let message = template_list(this.props.somos.id, this.props.somos.ro, "", template);
      console.log(message);
      let data = [], params = {};
      let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRL', 'message': message, 'timeout': timeout});
      if (res.ok && res.data && res.data.message) {
        let sf = [];
        //Convert response message to MGI message
        let message = new MgiMessage(res.data.message);
        let datas = message.value(["TMPLTNM","ED","ET"]);
        for (let i = 0; i< datas.length; i++) {
          if (template.trim() === datas[i].TMPLTNM.trim()) {
            params = {'template_name': datas[i].TMPLTNM.trim(),
              'date': datas[i].ED + " " + datas[i].ET};
            data.push(params);
          }
        }
        if (data.length === 1) {
          this.getTemplateRecord(template, data[0].date);
          this.setState({copy: false, update: true})
        } else if (data.length === 0) {
          this.setState({message: "Such template it doesn't exist! please create template here", loading: false, action: "N", disable: false, update: false})
        } else {
          for (let i = 0; i<data.length; i++) {
            message = temp(this.props.somos.id, this.props.somos.ro, data[i].template_name, data[i].date);
            let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRV', 'message': message, 'timeout': timeout});
            if (res.ok && res.data && res.data.message) {
              let message = new MgiMessage(res.data.message);
              sf.push(message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT").toString()));
              if (message.value("ED")[0] + " " + message.value("ET")[0] === data[data.length - 1].date) {
                this.getTemplateRecord(template, message.value("ED")[0] + " " + message.value("ET")[0]);
                this.setState({sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT").toString())})
              }
            }
          }
          this.setState({dates: sf});
        }
    } else {
      this.getTemplateRecord(template, sfed);
    }
    }
  };
  //Copy template
  update_tad = async (cpr, lad, cr) => {
    this.setState({large: false});
    let lads = validLAD(this.state.gridArea, this.state.gridDate, this.state.gridLATA, this.state.gridNXX, this.state.gridState, this.state.gridTel, this.state.gridTime, this.state.gridTD, this.state.gridSD);
    let types = this.state.gridType.filter(function (el) {return el !== ""});
    let message;
    if (this.state.action === "N") {
      if (this.state.template.length === 0) {this.setState({message: "Please input template!"});return false;}
      if (this.state.sfed.length === 0) {this.setState({message: "Please input effective date and time"});return false;}
      if (this.state.iec.length === 0) {this.setState({message: "Please input Interlata carrier!"});return false;}
      if (this.state.iac.length === 0) {this.setState({message: "Please input Intralata carrier"});return false;}
      if (this.state.ncon.length === 0) {this.setState({message: "Please input contact name"});return false;}
      message = create_template(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.ro, this.state.template, this.state.sfed, this.state.iec, this.state.iac, this.state.notes, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state, this.state.line, lads, types, this.state.gridData, this.state.description);
    } else if (this.state.action === "C") {
      message = copyTad(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.copy_template, this.state.sfed, this.state.sfed, this.state.iec, this.state.iac, this.state.notes, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state, this.state.line, lads, types, this.state.gridData, cr, cpr, lad, this.state.description);
    } else if (this.state.action === "D") {
      message = disconnect_template(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.template, this.state.sfed, origin_sfed);
    } else if (this.state.action === "R") {
      message = create_template(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.ro, this.state.template, this.state.sfed, this.state.iec, this.state.iac, this.state.notes, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state, this.state.line, lads, types, this.state.gridData, this.state.description);
    }
    this.setState({loading: true});
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      const message = new MgiMessage(res.data.message);
      let state = '';
      this.setState({ddt: message.value("ED")[0], ed_origin: message.value("ED")[0], et_origin: message.value("ET")[0]});
      message.value("STAT")[0] ? state = state_value(message.value("STAT")[0].toString()) : state = "PENDING";
      let dates = [], date = '';
      if (this.state.action === "N") {
        if (message.value("ERR")[0]) {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " FAILED";
          dates.push(date);
          this.setState({message: error_template_query_message(message.value("ERR")[0]), disable: false, dates: dates, sfed: date,})
        } else {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " " + state;
          dates.push(date);
          this.setState({message: "TAD create successfully!", disable: true, dates: dates, sfed: date,})
        }
      } else if (this.state.action === "C") {
        dates = this.state.dates;
        dates.pop();
        if (message.value("ERR")[0]) {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " FAILED";
          dates.push(date);
          this.setState({message: error_template_query_message(message.value("ERR")[0]), disable: false, dates: dates, sfed: date,})
        } else {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " " + state;
          dates.push(date);
          this.setState({message: "TAD update successfully!", disable: true, dates: dates, sfed: date})
        }
      } else if (this.state.action === "D") {
        message.value("ERR")[0] ? this.setState({message: error_template_query_message(message.value("ERR")[0]) }) : this.setState({message: "TAD disconnect successfully!"});
        if (!message.value("ERR")[0]) {
          this.setState({ dates: [], sfed: '', ncon: '', ctel:'', notes: '', iec: '', iac: '', network: '', lns: '', ro: '', approval: '', tem_id: '', description:''})
        }
      } else if (this.state.action === "R") {

      }
    }
  };

  copy_tad = () => {
    let date = fixed_date(this.state.copy_sfed, this.state.copy_now);
    let dates = this.state.dates;
    dates.push(date);
    this.setState({dates: dates, sfed: date, large: false, action: "C",disable: false, update: false, copy: true ,message:"TAD copy successfully!"});
    if (this.state.copy_template !== "" && this.state.copy_template !== this.state.template) {
      this.setState({template: this.state.copy_template});
    }

    !this.state.copy_cr && this.setState({lns: '', network: '' });
    !this.state.copy_lad &&
      this.setState({gridArea: Array(7).fill(Array(11).fill('')), gridDate: Array(7).fill(Array(11).fill('')), gridLATA: Array(7).fill(Array(11).fill('')),
        gridNXX: Array(7).fill(Array(11).fill('')), gridState: Array(7).fill(Array(11).fill('')), gridTel: Array(7).fill(Array(11).fill('')), gridTime: Array(7).fill(Array(11).fill('')),
        gridTD: Array(7).fill(Array(11).fill('')), gridSD: Array(7).fill(Array(11).fill('')), isLATA: false, isSD: false, isArea: false, isDate: false, isState: false, isNXX: false,
        isTime: false, isTD: false, isTel: false });
    !this.state.copy_cpr && this.setState({gridType: Array(10).fill(''), gridData: Array(5).fill(Array(10).fill(''))});
  };

  deleteTad = async () => {
    let date = fixed_date(this.state.delete_sfed, this.state.delete_now);
    this.setState({toggle_delete: false});
    let lads = validLAD(this.state.gridArea, this.state.gridDate, this.state.gridLATA, this.state.gridNXX, this.state.gridState, this.state.gridTel, this.state.gridTime, this.state.gridTD, this.state.gridSD);
    let types = this.state.gridType.filter(function (el) {return el !== ""});
    let message = deleteTad(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.template, date, "", this.state.description, this.state.iec, this.state.iac, this.state.notes, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state, this.state.line, lads, types, this.state.gridData);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      const message = new MgiMessage(res.data.message);
      if (!message.value("ERR")[0]) {
        this.setState({message: "TAD delete successfully!", dates: [], sfed: '', disable: false, });
      } else {
        this.setState({message: error_template_query_message(message.value("ERR")[0]), disable: true,})
      }
    }
  };

  transferTad = async () => {
    let date = fixed_date(this.state.transfer_sfed, this.state.transfer_now);
    this.setState({isTran: false});
    let lads = validLAD(this.state.gridArea, this.state.gridDate, this.state.gridLATA, this.state.gridNXX, this.state.gridState, this.state.gridTel, this.state.gridTime, this.state.gridTD, this.state.gridSD);
    let types = this.state.gridType.filter(function (el) {return el !== ""});
    let message = deleteTad(this.props.somos.id, this.props.somos.ro, this.state.action, this.state.copy_template, date, this.state.sfed, this.state.description, this.state.iec, this.state.iac, this.state.notes, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state, this.state.line, lads, types, this.state.gridData);
    console.log(message);
    this.setState({loading: true, action: "T"});
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      const message = new MgiMessage(res.data.message);
      let dates = this.state.dates;
      dates.push(message.value("ED")[0] + " " + message.value("ET")[0] + " PENDING");
      if (message.value("ERR")[0] === undefined) {
        this.setState({message: "TAD transfer successfully!", disable: true, dates: dates, sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " PENDING"});
      } else {
        this.setState({message: error_template_query_message(message.value("ERR")[0]), disable: true})
      }
    }
  };

  clear = () => {this.setState(this.initialState); this.setState({data:[]})};
  copyDate = (date) => {this.setState({copy_sfed: date});};
  transferDate = (date) => {this.setState({transfer_sfed: date});};
  deleteDate = (date) => {this.setState({delete_sfed: date});};
  //Manage area carrier for LAD
  handleAreaChange = (ev) => {this.setState({gridArea: handle_lad(ev, this.state.gridArea)});};
  //Manage date carrier for LAD
  handleDateChange = (ev) => {this.setState({gridDate: handle_lad(ev, this.state.gridDate)});};
  //Manage lata carrier for LAD
  handleLATAChange = (ev) => {this.setState({gridLATA: handle_lad(ev, this.state.gridLATA)});};
  //Manage nxx carrier for LAD
  handleNXXChange = (ev) => {this.setState({gridNXX: handle_lad(ev, this.state.gridNXX)});};
  //Manage state carrier for LAD
  handleStateChange = (ev) => {this.setState({gridState: handle_lad(ev, this.state.gridState)});};
  //Manage tel carrier for LAD
  handleTelChange = (ev) => {this.setState({gridTel: handle_lad(ev, this.state.gridTel)});};
  //Manage time carrier for LAD
  handleTimeChange = (ev) => {this.setState({gridTime: handle_lad(ev, this.state.gridTime)});};
  //Manage ten digits carrier for LAD
  handleTdChange = (ev) => {this.setState({gridTD: handle_lad(ev, this.state.gridTD)});};
  //Manage six digits carrier for LAD
  handleSdChange = (ev) => {this.setState({gridSD: handle_lad(ev, this.state.gridSD)});};
  handle = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
    if (event.target.name === "action" && event.target.value==="D") {
      this.setState({dates: [], update: false});
    }
  };
  toggle = (tab) => {this.state.activeTab !== tab && this.setState({activeTab: tab});};
  toggleLarge = () => {this.setState({large: !this.state.large, action: 'C'});};
  toggleDelete = () => {this.setState({toggle_delete: !this.state.toggle_delete, action: 'X'})};
  goLad = () => {this.setState({isLad: !this.state.isLad, isCpr: false})};
  goCpr = () => {this.setState({isCpr: !this.state.isCpr, isLad: false})};
  toggleTran = () => {this.setState({isTran: !this.state.isTran, action: 'T'})};
  insertCell = (type) => {
    if (type === "AC") this.setState({gridArea: insert_cell(this.state.gridArea)});
    else if (type === "DT") this.setState({gridDate: insert_cell(this.state.gridDate)});
    else if (type === "LT") this.setState({gridLATA: insert_cell(this.state.gridLATA)});
    else if (type === "TD") this.setState({gridTD: insert_cell(this.state.gridTD)});
    else if (type === "SD") this.setState({gridSD: insert_cell(this.state.gridSD)});
    else if (type === "NX") this.setState({gridNXX: insert_cell(this.state.gridNXX)});
    else if (type === "TI") this.setState({gridTime: insert_cell(this.state.gridTime)});
    else if (type === "TE") this.setState({gridTel: insert_cell(this.state.gridTel)});
    else if (type === "ST") this.setState({gridState: insert_cell(this.state.gridState)})};
  deleteCell = (type) => {
    if (type === "AC") this.setState({gridArea: delete_cell(this.state.gridArea)});
    else if (type === "TI") this.setState({gridTime: delete_cell(this.state.gridTime)});
    else if (type === "TD") this.setState({gridTD: delete_cell(this.state.gridTD)});
    else if (type === "SD") this.setState({gridSD: delete_cell(this.state.gridSD)});
    else if (type === "TE") this.setState({gridTel: delete_cell(this.state.gridTel)});
    else if (type === "ST") this.setState({gridState: delete_cell(this.state.gridState)});
    else if (type === "NX") this.setState({gridNXX: delete_cell(this.state.gridNXX)});
    else if (type === "DT") this.setState({gridDate: delete_cell(this.state.gridDate)});
    else if (type === "LT") this.setState({gridLATA: delete_cell(this.state.gridLATA)})};
  insertCprCell = () => {this.setState({gridData: insert_cell(this.state.gridData)})};
  deleteCprCell = () => {this.setState({gridData: delete_cell(this.state.gridData)})};
  insertCprColumn = () => {
    let data = this.state.gridData;
    for (let i = 0; i< data.length; i++) {data[i]=insert_cell(data[i]);}
    this.setState({gridData: data});
    let type = this.state.gridType; type.push("");
    this.setState({gridType: type});
  };
  deleteCprColumn = () => {
    let data = this.state.gridData;
    for (let i = 0; i< data.length; i++) {data[i]=delete_cell(data[i]);}
    this.setState({gridData: data});
    let type = this.state.gridType; type.pop();
    this.setState({gridType: type});
  };
  handleChange = (ev) => {this.setState({gridType: handle_change(ev, this.state.gridType)});};
  handleValue = (ev) => {this.setState({gridData: handle_value_cpr(ev, this.state.gridData)});};
  handleCheck = (event)=> {const state = {}; state[event.target.name] = event.target.checked; this.setState(state)};
  render() {
    return (
      <div className="animated fadeIn mt-1">
        <Label className="ml-1"><strong style={{fontSize: 25}}>Template Admin Data</strong></Label>
        <Row>
          <Col xs="12">
            <Card>
              <div className="mt-3 mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Row className="mt-2 ml-4 mr-4">
                  <Col xs="12" md="6" className="row">
                    <p className="col-5 font-weight-bold">Template Name *:</p>
                    <Input className="col-4 form-control-sm" type="text" name="template" id="template" onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                  </Col>
                  <Col xs="12" md="6" className="row">
                    <Label className="col-5 font-weight-bold">Eff.Date/Time/Status:</Label>
                    {!this.state.dates.length ?
                    <Input className="col-4 form-control-sm" type="text" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed}/> :
                    <select className="col-4 form-control-sm" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed}>
                      <>{this.state.dates.map(value => {return <option>{value}</option>})}</>
                    </select>
                    }
                  </Col>
                </Row>
              </div>
              <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Row className="mb-1 ml-4 mr-4 mt-2">
                  <Col xs="12" md="3" className="row">
                    <Label className="col-6 font-weight-bold text-right">Resp Org:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="ro" id="ro" onChange={(ev) => this.handle(ev)} value={this.state.ro} disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="3" className="row">
                    <Label className="col-6 text-right">Approval:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="approval" id="approval" onChange={(ev) => this.handle(ev)} value={this.state.approval} disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">Last:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="last" id="last" onChange={(ev) => this.handle(ev)} value={this.state.last} disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">Prev User:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="prev_user" id="prev_user" onChange={(ev) => this.handle(ev)} value={this.state.prev_user} disabled={this.state.disable}/>
                  </Col>
                  <Col xs="12" md="2" className="row">
                    <Label className="col-6 text-right">By:</Label>
                    <Input className="col-6 form-control-sm" type="text" name="by" id="by" onChange={(ev) => this.handle(ev)} value={this.state.by} disabled={this.state.disable}/>
                  </Col>
                </Row>
              </div>
              <div className="mb-1 ml-4 mr-4 mt-1 mb-1 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <div style={{backgroundColor: '#c8ced3'}}>
                  <Label className="ml-3 mt-1 mb-1 font-weight-bold">Template Info</Label>
                </div>
                <Col xs="12" md="8" className="row mr-4 ml-4 mt-2">
                  <Label className="col-3 font-weight-bold">Template ID:</Label>
                  <Input className="col-3 form-control-sm" type="text" name="tem_id" id="tem_id" value={this.state.tem_id} onChange={(ev) => this.handle(ev)} disabled={this.state.disable}/>
                </Col>
                <Col xs="12" md="8" className="row mr-4 ml-4 mt-1 mb-2">
                  <Label className="col-3 font-weight-bold">Template Description:</Label>
                  <Input className="col-9 form-control-sm" type="text" name="description" id="description" value={this.state.description} onChange={(ev) => this.handle(ev)} disabled={this.state.disable}/>
                </Col>
              </div>
              <Row>
                <Col md="6" xs="12">
                  <div className="mb-1 ml-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Action</Label>
                    </div>
                    <Row className="mt-3 mb-3 ml-4">
                      <Col xs="2"><Label>Action:</Label></Col>
                      <Col xs="2"><Input type="select" className="form-control-sm " id="action" name="action" value={this.state.action} onChange={(ev)=> this.handle(ev)}>
                        <option value="N">N</option>
                        <option value="C">C</option>
                        <option value="X">X</option>
                        <option value="T">T</option>
                        <option value="D">D</option>
                        <option value="R">R</option></Input>
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-1 ml-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Destination</Label>
                    </div>
                    <Row className="mt-3 mb-3 ml-4">
                      <Col xs="2"><Label>#Line:</Label></Col>
                      <Col xs="2"><Input type="text" className="form-control-sm" id="line" name="line" value={this.state.line} onChange={(ev) => this.handle(ev)} disabled={this.state.disable}/></Col>
                    </Row>
                  </div>
                </Col>
                <Col md="6" xs="12">
                  <div className="mb-1 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Contact Information</Label>
                    </div>
                    <Row className="mt-1 mr-4">
                      <Label className="col-4 text-right">Contact Person:</Label>
                      <Input className="col-8 text-left form-control-sm" type="text" name="ncon" id="ncon" onChange={(ev) => this.handle(ev)} value={this.state.ncon} disabled={this.state.disable}/>
                    </Row>
                    <Row className="mt-1 mr-4">
                      <Label className="col-4 text-right">Contact Number:</Label>
                      <Input className="col-8 text-left form-control-sm" type="text" name="ctel" id="ctel" onChange={(ev) => this.handle(ev)} value={this.state.ctel} disabled={this.state.disable}/>
                    </Row>
                    <Row className="mt-1 mb-1 mr-4">
                      <Label className="col-4 text-right">Notes:</Label>
                      <Input className="col-8 text-left form-control-sm" type="textarea" name="notes" id="notes" onChange={(ev) => this.handle(ev)} value={this.state.notes} disabled={this.state.disable}/>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6" xs="12">
                  <div className="mb-1 ml-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '##f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Area of Service</Label>
                    </div>
                    <div className="ml-2 mr-2 mt-1 mb-1">
                      <Nav tabs className="custom">
                        {this.renderNavbar("1", "Networks", false)}
                        {this.renderNavbar("2", "States", false)}
                        {this.renderNavbar("3", "NPAs", false)}
                        {this.renderNavbar("4", "LATAs", false)}
                        {this.renderNavbar("5", "Labels", false)}
                      </Nav>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <Input type="text" name="network" id="network" onChange={(ev) => this.handle(ev)} placeholder="Networks" value={this.state.network} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="2">
                          <Input type="text" name="state" id="state" onChange={(ev) => this.handle(ev)} placeholder="States" value={this.state.state} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="3">
                          <Input type="text" name="npa" id="npa" onChange={(ev) => this.handle(ev)} placeholder="NPAs" value={this.state.npa} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="4">
                          <Input type="text" name="lata" id="lata" onChange={(ev) => this.handle(ev)} placeholder="LATAs" value={this.state.lata} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="5">
                          <Input type="text" name="label" id="label" onChange={(ev) => this.handle(ev)} placeholder="Labels" value={this.state.label} disabled={this.state.disable}/>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </Col>
                <Col md="6" xs="12">
                  <div className="mb-1 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Carriers</Label>
                    </div>
                    <div className="row mt-4 mb-4">
                      <Row className="col-6">
                        <Label className="col-6 text-right font-weight-bold">IntraLATA:</Label>
                        <Input className="col-6 text-left" type="textarea" name="iac" id="iac" onChange={(ev) => this.handle(ev)} value={this.state.iac} disabled={this.state.disable}/>
                      </Row>
                      <Row className="col-6">
                        <Label className="col-6 text-right font-weight-bold">InterLATA:</Label>
                        <Input className="col-6 text-left" type="textarea" name="iec" id="iec" onChange={(ev) => this.handle(ev)} value={this.state.iec} disabled={this.state.disable}/>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
              <Card className="ml-4 mr-4">
                <div className="row mt-2 mb-2">
                  <Label className="col-2 text-right">Message:</Label>
                  <Input className="col-8" type="textarea" name="message" id="message" onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                </div>
              </Card>
              <div className="ml-4 mr-4 mb-2">
                <Row>
                  <Col xs="12" md="7">
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.retrieve} onClick={() => this.retrieve_template(this.state.template, this.state.sfed)}>Retrieve</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.update} onClick={()=>this.update_tad(this.state.copy_cpr, this.state.copy_lad, this.state.copy_cr)}>Update</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.copy} onClick={this.toggleLarge}>Copy</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.transfer} onClick={this.toggleTran}>Transfer</Button>
                    <Button size="md" color="primary" disabled={this.state.delete} onClick={this.toggleDelete}>Delete</Button>
                  </Col>
                  <Col xs="12" md="5" className="text-right">
                    <Button size="md" color="danger" className="mr-2" disabled={this.state.cpr} onClick={this.goCpr}>CPR</Button>
                    <Button size="md" color="danger" className="mr-2" disabled={this.state.lad} onClick={this.goLad}>LAD</Button>
                    {/*<Button size="md" color="danger" className="mr-2" disabled={this.state.rec}>TEC</Button>*/}
                    <Button size="md" color="danger" className="mr-2" onClick={this.clear}>Clear</Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Modal for copy template */}
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleLarge}>Copy Template Record</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="template">Template:</Label>
                    <Input type="text" name="template" id="template" value={this.state.template} disabled/>
                    <Label htmlFor="sfed">Effective Date/Time</Label>
                    <Input type="text" name="sfed" id="sfed" value={this.state.ed_origin + " " + this.state.et_origin} disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_template">Template: </Label>
                    <Input type="text" name="copy_template" id="copy_template" onChange={(ev) => this.handle(ev)} value={this.state.copy_template}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker dateFormat="MM/DD/YY hh:mmA/C" selected={this.state.copy_sfed} showTimeSelect timeIntervals={15} onChange={this.copyDate} className="form-control"
                          timeCaption="time"/>
                      </Col>
                      <div className="form-check align-content-center">
                        <Input type="checkbox" className="form-check-input" id="copy_now" name="copy_now" onChange={this.handleCheck} checked={this.state.copy_now}/>
                        <label className="form-check-label" htmlFor="copy_cr"> NOW</label>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </FormGroup>
            <div className="row">
              <Col xs="3"/>
              <Col xs="6">
                <Card>
                  <CardHeader>Copy Portions from Source Record</CardHeader>
                  <CardBody className="ml-lg-5">
                    <div className="form-check align-content-center">
                      <Input type="checkbox" className="form-check-input" id="copy_cr" name="copy_cr" onChange={(ev)=> this.handleCheck(ev)}/>
                      <label className="form-check-label" htmlFor="copy_cr"> CR Basic Data</label>
                    </div>
                    <div className="form-check">
                      <Input type="checkbox" className="form-check-input" id="copy_lad" name="copy_lad" onChange={(ev)=> this.handleCheck(ev)} disabled={this.state.is_lad}/>
                      <label className="form-check-label" htmlFor="copy_lad"> LAD</label>
                    </div>
                    <div className="form-check">
                      <Input type="checkbox" className="form-check-input" id="copy_cpr" name="copy_cpr" onChange={(ev)=> this.handleCheck(ev)} disabled={this.state.is_cpr}/>
                      <label className="form-check-label" htmlFor="copy_cpr"> CPR</label>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="3"/>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="md" color="primary" className="mr-2" onClick={this.copy_tad}> Copy</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toggleLarge}> Cancel</Button>
          </ModalFooter>
        </Modal>

        {/* Modal for transfer template*/}
        <Modal isOpen={this.state.isTran} toggle={this.toggleTran} className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleTran}>Transfer Template Record</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="num">Template:</Label>
                    <Input type="text" value={this.state.template} disabled/>
                    <Label htmlFor="et_origin">Effective Date/Time</Label>
                    <Input type="text" value={this.state.ed_origin + " " + this.state.et_origin} disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_template">Template: </Label>
                    <Input type="text" name="copy_template" id="copy_template" onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker dateFormat="MM/DD/YY hh:mmA/C" selected={this.state.transfer_sfed} showTimeSelect timeIntervals={15} onChange={this.transferDate} className="form-control"
                          timeCaption="time"/>
                      </Col>
                      <div className="form-check align-content-center">
                        <Input type="checkbox" className="form-check-input" id="transfer_now" name="transfer_now" onChange={this.handleCheck} checked={this.state.transfer_now}/>
                        <label className="form-check-label" htmlFor="copy_cr"> NOW</label>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="md" color="primary" className="mr-2" onClick={this.transferTad}> Transfer</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toggleTran}> Cancel</Button>
          </ModalFooter>
        </Modal>
        {/* Modal for delete template*/}
        <Modal isOpen={this.state.toggle_delete} toggle={this.toggleDelete} className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleDelete}>Delete TAD</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="num">Template:</Label>
                    <Input type="text" value={this.state.template} disabled/>
                    <Label>Effective Date/Time</Label>
                    <Input type="text" value={this.state.ed_origin + " " + this.state.et_origin} disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_template">Template: </Label>
                    <Input type="text" name="copy_template" id="copy_template" onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker dateFormat="MM/DD/YY hh:mmA/C" selected={this.state.delete_sfed} showTimeSelect timeIntervals={15} onChange={this.deleteDate}
                          timeCaption="time"/>
                      </Col>
                      <div className="form-check align-content-center">
                        <Input type="checkbox" className="form-check-input" id="delete_now" name="delete_now" onChange={this.handleCheck} checked={this.state.delete_now}/>
                        <label className="form-check-label" htmlFor="copy_cr"> NOW</label>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button size="md" color="primary" className="mr-2" onClick={this.deleteTad}> Delete</Button>
            <Button size="md" color="danger" onClick={this.toggleDelete}> Cancel</Button>
          </ModalFooter>
        </Modal>

        {/* Modal for LAD*/}
        <Modal isOpen={this.state.isLad} toggle={this.goLad} className={'modal-md ' + this.props.className}>
          <ModalHeader toggle={this.goLad}>Label Definitions</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <div className="mt-3 mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                  <Row className="mt-2 ml-4 mr-4">
                    <Col xs="12" md="6" className="row">
                      <p className="col-5 font-weight-bold">Dial#/Template Name *:</p>
                      <Input className="col-4 form-control-sm" type="text" name="template" id="template" onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                    </Col>
                    <Col xs="12" md="6" className="row">
                      <Label className="col-5 font-weight-bold">Eff.Date/Time/Status:</Label>
                      <Input className="col-4 form-control-sm" type="text" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed} disabled={this.state.disable}/>
                    </Col>
                  </Row>
                </div>
                <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                  <Row className="mb-1 ml-4 mr-4 mt-2">
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 font-weight-bold text-right">Resp Org:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="ro" id="ro" onChange={(ev) => this.handle(ev)} value={this.state.ro} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Approval:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="approval" id="approval" onChange={(ev) => this.handle(ev)} value={this.state.approval} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="2" className="row">
                      <Label className="col-6 text-right">Last:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="last" id="last" onChange={(ev) => this.handle(ev)} value={this.state.last} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="2" className="row">
                      <Label className="col-6 text-right">Prev User:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="prev_user" id="prev_user" onChange={(ev) => this.handle(ev)} value={this.state.prev_user} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="2" className="row float-right">
                      <Label className="col-6 text-right">By:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="by" id="by" onChange={(ev) => this.handle(ev)} value={this.state.by} disabled={this.state.disable}/>
                    </Col>
                  </Row>
                </div>
                <div className="mb-1 ml-4 mr-4 mt-1 mb-1 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                  <div className="ml-2 mr-2 mt-1 mb-1">
                    <Nav tabs className="custom">
                      {this.renderNavbar("1", "Area Code", this.state.isArea)}
                      {this.renderNavbar("2", "Date", this.state.isDate)}
                      {this.renderNavbar("3", "LATA", this.state.isLATA)}
                      {this.renderNavbar("4", "NXX", this.state.isNXX)}
                      {this.renderNavbar("5", "State", this.state.isState)}
                      {this.renderNavbar("6", "Tel#", this.state.isTel)}
                      {this.renderNavbar("7", "Time", this.state.isTime)}
                      {this.renderNavbar("8", "10-digit#", this.state.isTD)}
                      {this.renderNavbar("9", "6-digit#", this.state.isSD)}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      {this.renderTabPane("1", this.state.gridArea, "AC", this.handleAreaChange)}
                      {this.renderTabPane("2", this.state.gridDate, "DT", this.handleDateChange)}
                      {this.renderTabPane("3", this.state.gridLATA, "LT", this.handleLATAChange)}
                      {this.renderTabPane("4", this.state.gridNXX, "NX", this.handleNXXChange)}
                      {this.renderTabPane("5", this.state.gridState, "ST", this.handleStateChange)}
                      {this.renderTabPane("6", this.state.gridTel, "TE", this.handleTelChange)}
                      {this.renderTabPane("7", this.state.gridTime, "TI", this.handleTimeChange)}
                      {this.renderTabPane("8", this.state.gridTD, "TD", this.handleTdChange)}
                      {this.renderTabPane("9", this.state.gridSD, "SD", this.handleSdChange)}
                    </TabContent>
                  </div>
                </div>
                <Card className="ml-4 mr-4">
                  <div className="row mt-2 mb-2">
                    <Label className="col-2 text-right">Message:</Label>
                    <Input className="col-8" type="textarea" name="message" id="message" onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                  </div>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        {/* Modal for CPR*/}
        <Modal isOpen={this.state.isCpr} toggle={this.goCpr} className={'modal-md ' + this.props.className}>
          <ModalHeader toggle={this.goCpr}>Call Processing</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <Card>
                  <div className="mt-3 mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Row className="mt-2 ml-4 mr-4">
                      <Col xs="12" md="6" className="row">
                        <p className="col-5 font-weight-bold">Dial#/Template Name *:</p>
                        <Input className="col-4 form-control-sm" type="text" name="template" id="template" onChange={(ev) => this.handle(ev)} value={this.state.template}/>
                      </Col>
                      <Col xs="12" md="6" className="row">
                        <Label className="col-5 font-weight-bold">Eff.Date/Time/Status</Label>
                        <Input className="col-4 form-control-sm" type="text" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed} disabled={this.state.disable}/>
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Row className="mb-1 ml-4 mr-4 mt-2">
                      <Col xs="12" md="3" className="row">
                        <Label className="col-6 font-weight-bold text-right">Resp Org:</Label>
                        <Input className="col-6 form-control-sm" type="text" name="ro" id="ro" onChange={(ev) => this.handle(ev)} value={this.state.ro} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="3" className="row">
                        <Label className="col-6 text-right">Approval:</Label>
                        <Input className="col-6 form-control-sm" type="text" name="approval" id="approval" onChange={(ev) => this.handle(ev)} value={this.state.approval} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="2" className="row">
                        <Label className="col-6 text-right">Last:</Label>
                        <Input className="col-6 form-control-sm" type="text" name="last" id="last" onChange={(ev) => this.handle(ev)} value={this.state.last} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="2" className="row">
                        <Label className="col-6 text-right">Prev User:</Label>
                        <Input className="col-6 form-control-sm" type="text" name="prev_user" id="prev_user" onChange={(ev) => this.handle(ev)} value={this.state.prev_user} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="2" className="row">
                        <Label className="col-6 text-right">By:</Label>
                        <Input className="col-6 form-control-sm" type="text" name="by" id="by" onChange={(ev) => this.handle(ev)} value={this.state.by} disabled={this.state.disable}/>
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-1 ml-4 mr-4 mt-1 mb-1 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Col xs="12" md="8" className="row mr-4 ml-4 mt-2 mb-2">
                      <Label className="col-2 font-weight-bold">Section:</Label>
                      <Input className="col-2 form-control-sm" type="select" name="section" id="section" onChange={(ev) => this.handle(ev)}>
                        <option>Main</option>
                        <option>Sub</option>
                      </Input>
                      {/*<Button size="sm" color="primary" className="ml-4">Add Section</Button>*/}
                      {/*<Button size="sm" color="primary" className="ml-4">Delete Section</Button>*/}
                    </Col>
                    <Col xs="12" className="mt-2 mb-1 scroll">
                      <table className="table-bordered" style={{width: '100%'}}>
                        <thead>
                        <tr>
                          {this.state.gridType.map((value) => {
                            if (value === "TI") value = "Time";
                            else if (value === "DT") value = "Date";
                            else if (value === "DA") value = "Day";
                            else if (value === "TE") value = "Tel#";
                            else if (value === "LT") value = "LATA";
                            else if (value === "ST") value = "State";
                            else if (value === "AC") value = "Area Code";
                            else if (value === "NX") value = "NXX";
                            else if (value === "SW") value = "Switch";
                            else if (value === "PC") value = "Percent";
                            else if (value === "CA") value = "Carrier";
                            else if (value === "AN") value = "Announcement";
                            else if (value === "SD") value = "6-digit#";
                            else if (value === "TD") value = "10-digit#";
                            else if (value === "GT") value = "Go to";
                            else if (!value) value = "<select>";
                            return (
                              <th className="text-center">{value}</th>
                            )
                          })}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          {this.state.gridType.map((value, i) => {
                            return (<td>
                                <Input type="select" name={'type_' + i} className="form-control-sm" value={value} onChange={(ev) => this.handleChange(ev)} disabled={this.state.disable}>
                                  <option>&lt;select&gt;</option>
                                  <option value="TI">Time</option>
                                  <option value="TE">Tel#</option>
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
                                  <option value="SD">6-digit#</option>
                                  <option value="TD">10-digit#</option>
                                  <option value="GT">Go to</option>
                                </Input>
                              </td>
                            )
                          })}
                        </tr>
                        {this.state.gridData.map((datas, k) => {
                          return (<tr>
                            {datas.map((data, g) => {
                              return (
                                <td><Input type="text" className="form-control-sm" name={k + "_" + g}
                                           value={data} onChange={(ev) => this.handleValue(ev)}
                                           disabled={this.state.disable} style={{minWidth: 100}}/></td>
                              )})}
                            </tr>)
                          })}
                        </tbody>
                      </table>
                      <div className="mt-2">
                        <Button size="sm" color="primary" onClick={this.insertCprCell} disabled={this.state.disable}>Insert Cell</Button>
                        <Button size="sm" color="primary" onClick={this.deleteCprCell} className="ml-3" disabled={this.state.disable}>Delete Cell</Button>
                        <Button size="sm" color="primary" onClick={this.insertCprColumn} className="ml-3" disabled={this.state.disable}>Insert Column</Button>
                        <Button size="sm" color="primary" onClick={this.deleteCprColumn} className="ml-3" disabled={this.state.disable}>Delete Column</Button>
                      </div>
                    </Col>
                  </div>
                  <Row>
                    <Col xs="12">
                      <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '##f0f3f5'}}>
                        <div className="ml-4 mr-4 mt-2 mb-2 row">
                          <Col xs="3" className="row">
                            <Col xs="6">IntraLATA Carrier:</Col>
                            <Col xs="6">
                              <Input type="select" className="form-control-sm" disabled={this.state.disable}>
                              {this.state.iac_array.map(value => {return <option value={value}>{value}</option>})}
                              </Input>
                            </Col>
                          </Col>
                          <Col xs="3" className="row">
                            <Col xs="6">InterLATA Carrier:</Col>
                            <Col xs="6"><Input type="select" className="form-control-sm" disabled={this.state.disable}>
                              {this.state.iec_array.map(value => {return <option value={value}>{value}</option>})}
                            </Input></Col>
                          </Col>
                          <Col xs="3" className="row">
                            <Col xs="6">Time Zone:</Col>
                            <Col xs="6"><Input type="select" className="form-control-sm" value={this.state.timezone} disabled={this.state.disable}>
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
                            <Col xs="6" className="text-right"><Input type="checkbox" checked={this.state.ds === "Y"} disabled={this.state.disable}/></Col>
                            <Col xs="6">Daylight Savings</Col>
                          </Col>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Card className="ml-4 mr-4">
                    <div className="row mt-2 mb-2">
                      <Label className="col-2 text-right">Message:</Label>
                      <Input className="col-8" type="textarea" name="message" id="message" onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                    </div>
                  </Card>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
  renderNavbar = (id, name, state) => {
    return  <NavItem>
      <NavLink className={classnames({active: this.state.activeTab === id})} onClick={() => {this.toggle(id);}}>
        {!state ? name : name + " *"}
      </NavLink>
    </NavItem>
  };

  renderTabPane = (id, data, index, func) => {
    return <TabPane tabId={id}>
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
        {data.map((value, i) => {return (<tr>
          {value.map((element, j) => {
            return (<td><Input type="text" className="form-control-sm" name={index + "_" + i + "_" + j} value={element} onChange={func} disabled={this.state.disable}/></td>)})}
        </tr>)})
        }
        </tbody>
      </table>
      <div className="mt-2">
        <Button size="sm" color="primary" onClick={() => this.insertCell(index)} disabled={this.state.disable}>Insert Cell</Button><span className="ml-3"/>
        <Button size="sm" color="primary" onClick={() => this.deleteCell(index)} disabled={this.state.disable}>Delete Cell</Button>
      </div>
    </TabPane>
  }
}
export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(TAD));
