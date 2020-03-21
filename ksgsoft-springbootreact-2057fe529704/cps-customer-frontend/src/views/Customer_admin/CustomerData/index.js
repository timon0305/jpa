import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import {connect} from 'react-redux'
import DatePicker from "react-datepicker";
import mutate from 'immer';
import "react-datepicker/dist/react-datepicker.css";
import {fix_num, query_number} from "../../../service/numberSearch";
import {timeout, create_customer_record, customer_number, deleteCad, transfer, customer_selection, cadToPad, update_customer_record, disconnect_customer, resend_customer
} from "../../../service/customer";
import {error_customer_record_message, error_number_query} from "../../../service/error_message";
import classnames from "classnames";
import {state_value, validLAD} from "../../../service/template";
import {delete_cell, fixed_date, handle_change, handle_lad, handle_value_cpr, insert_cell, push_cpr} from "../../../utils";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
let origin_iec = '';
let origin_iac = '';
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class CustomerData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, activeTab: '1', num: "", sfed: '', ed: "", et: '', ro: '', approval: '', last: '', prev_user: '', by: '', action: '', so: '', sf: '', ddt: '', customer: '', agent: '', telco: '', hold: '', directory: '',
      dau: '', dat: '', list_name: '', list_address: '', ncon: '', ctel: '', notes: '', network: '', state: '', npa: '', lata: '', tel: '', label: '', iec: '', iac: '', abn: '', rao: '', ic: '', end: '',
      lns: '', city: '', uts: '', line: '', lsis: '', lso: '', fso: '', stn: '', sfg: '', hml: '', referral: 'N', message: '', isDate: false, retrieve: false, update: false,
      copy: true, transfer: true, delete: true, cpr: false, lad: false, rec: false, disable: false, large: false, ed_origin: "", et_origin: '', toggle_delete: false, dcsn: "",
      template: "", ed_cpr: "", et_cpr: "", tran: false,copy_num: '', copy_cr: false, copy_lad: false, copy_cpr: false,isLad: false, isCpr: false,
      gridArea: Array(7).fill(Array(11).fill('')), gridDate: Array(7).fill(Array(11).fill('')), gridLATA: Array(7).fill(Array(11).fill('')),
      gridNXX: Array(7).fill(Array(11).fill('')), gridState: Array(7).fill(Array(11).fill('')), gridTel: Array(7).fill(Array(11).fill('')), gridTime: Array(7).fill(Array(11).fill('')),
      gridTD: Array(7).fill(Array(11).fill('')), gridSD: Array(7).fill(Array(11).fill('')), gridType: Array(10).fill(''), gridData: Array(5).fill(Array(10).fill('')), iec_array: [], iac_array: [], dates:[],
      copy_now: false, transfer_now: false, delete_now: false, copy_sfed: null, transfer_sfed: null, delete_sfed: null, rec_sfed: null, rec_now: false, disconnect: true,
    };
    this.initialState = mutate(this.state, (r)=> {})
  }

  componentDidMount = () => {
    let num = localStorage.getItem("number");
    let dates = localStorage.getItem("dates");
    let sfed = localStorage.getItem("sfed");
    localStorage.removeItem("number");
    localStorage.removeItem("dates");
    localStorage.removeItem("sfed");
    if (num) {
      if (sfed) {
        dates = dates.split(",");
        sfed = sfed.split(" ");
        this.get_customer_record(num, sfed[0], sfed[1]);
        this.setState({num: num, dates: dates, sfed: sfed});
      } else {
        this.retrieve_number(num, "");
        this.setState({num: num});
      }
    }
  };

  get_customer_record = async (num, ed, et) => {
    let message = customer_number(this.props.somos.id, this.props.somos.ro, fix_num(num), ed, et);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRV', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      console.log(res.data.message);
      let dates = this.state.dates;
      if (dates === []) {
        dates.push(message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()));
        this.setState({dates: dates});
      } else if (dates.length === 1) {
        let newDate = [];
        newDate.push(message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()));
        this.setState({dates: newDate});
      }
      if (!message.value("TMPLTPTR")[0]){
        this.setState({
          ncon: message.value("NCON")[0] ? message.value("NCON")[0] : "",
          ctel: message.value("CTEL")[0] ? message.value("CTEL")[0] : "",
          copy_num: message.value("NUM")[0],
          ro: message.value("CRO")[0],
          sfed: message.value("ED")[0] + " " + message.value("ET")[0] + " " + state_value(message.value("STAT")[0].toString()),
          ac: message.value("STAT")[0],
          ed_origin: message.value("ED")[0],
          et_origin: message.value("ET")[0],
          dau: message.value("DAU")[0],
          dat: message.value("DAT")[0],
          hold: message.value("HDD")[0],
          so: message.value("SO")[0],
          telco: message.value("TELCO")[0],
          tel: message.value("TEL")[0],
          lns: message.value("LNS")[0],
          message: "CAD retrieve successfully",
          iec: message.value("IEC")[0].split(",")[1],
          iac: message.value("IAC")[0].split(",")[1],
          network: message.value("ANET")[0].split(",")[1],
          copy: false,
          transfer: false,
          delete: false,
          disable: true,
        });
        origin_iac = message.value("IAC")[0].split(",")[1];
        origin_iec = message.value("IEC")[0].split(",")[1];
        message.value("NODE")[0] ? this.setState({is_cpr: false}) : this.setState({is_cpr: true});
        message.value("CNT12")[0] ? this.setState({is_lad: false}) : this.setState({is_lad: true});
        message.value("LN")[0].split(" ").join("") !== "NLNP" && this.setState({list_name: message.value("LN")[0]});
        let values = message.value(["TYPE", "DEF", "LBL"]);
        message.value("NODE")[0] ? this.setState({is_cpr: false}) : this.setState({is_cpr: true});
        message.value("CNT12")[0] ? this.setState({is_lad: false}) : this.setState({is_lad: true});
        let lts = [], acs = [], dts = [], sts = [], nxs = [], tis = [], sds = [], tds = [], tel = [];
        //Push the data in 2 dimentional array for LAD.
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
          } else if (value.TYPE === "TL") {tel = push_cpr(tel, value);
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
        this.setState({gridType: newArray, gridData: newDatas});
      } else {
        localStorage.setItem("number", this.state.num);
        localStorage.setItem("dates", this.state.dates);
        localStorage.setItem("sfed", this.state.sfed);
        this.props.navigate('/customer_admin/pointer_data');
        window.location.reload();
      }
    }
  };

  retrieve_number = async (num, sfed) => {
    this.setState({update: true});
    if (sfed ==="") {
      let message = customer_selection(this.props.somos.id, this.props.somos.ro, fix_num(num));
      let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRQ', 'message': message, 'timeout': timeout});
      if (res.ok && res.data && res.data.message) {
        let message = new MgiMessage(res.data.message);
        console.log(res.data.message);
        let dates = [];let date = "";let ed = "";let et = "";
        let params = message.value(["ED","ET","STAT"]);
        if (params.length === 0) {
          message = query_number(this.props.somos.id, this.props.somos.ro, fix_num(num));
          let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'NSR', 'message': message, 'timeout': timeout});
          if (res.ok && res.data && res.data.message) {
            console.log(res.data.message);
            const message = new MgiMessage(res.data.message);
            if (message.value("ERR")[0]) {
              this.setState({message: error_number_query(message.value("ERR")[0])});
              return false;
            }
            if (message.value('STAT')[0].trim() !== "SPARE") {
              this.setState({ncon: message.value("NCON")[0], ctel: message.value("CTEL")[0],
                ro: message.value("CRO")[0], date: message.value("SE")[0], ac: message.value("STAT")[0],
                tel: this.state.num, action: "N", update: false,
              });
              message.value("ERR")[0] ? this.setState({message: error_customer_record_message(message.value("ERR")[0])}) : this.setState({message: "To create a new 'CAD', please enter the EFF Date/Time on CAD!"});
              message.value("STAT")[0] === "WORKING" && this.setState({sfed: message.value("SE")[0] + " " + message.value("STAT")[0]});
            } else {
              this.setState({message: "Number is spare! Please go to 'NUS' and reserve number!"});
            }
          }
        } else if (params.length === 1) {
          this.get_customer_record(fix_num(num), params[0].ED, params[0].ET)
        } else {
          if (state_value(params[params.length - 1].STAT.toString()) === "FAILED") {
            for (let i = 0; i< params.length; i++) {
              date = params[i].ED + " " + params[i].ET + " " + state_value(params[i].STAT.toString());
              if (state_value(params[i].STAT.toString()) === "ACTIVE") {
                ed = params[i].ED;
                et = params[i].ET;
                this.setState({sfed: ed + " " + et + " " + state_value(params[i].STAT.toString()), ed_origin: ed, et_origin: et})
              }
              dates.push(date);
            }
            this.setState({dates: dates});
          } else if (state_value(params[params.length - 1].STAT.toString()) === "ACTIVE" || state_value(params[params.length - 1].STAT.toString()) === "PENDING") {
            for (let i = 0; i< params.length; i++) {
              date = params[i].ED + " " + params[i].ET + " " + state_value(params[i].STAT.toString());
              dates.push(date);
            }
            this.setState({dates: dates});
            ed = params[params.length - 1].ED;
            et = params[params.length - 1].ET;
            this.setState({sfed: ed + " " + et + " " + state_value(params[params.length - 1].STAT.toString()), ed_origin: ed, et_origin: et})
          }
          this.get_customer_record(fix_num(num), ed, et);
        }
      }
    } else {
      let date = this.state.sfed;
      date = date.split(" ");
      this.get_customer_record(fix_num(num), date[0], date[1]);
    }
  };

  updateCad = async () => {
    let message = "";
    let lads = validLAD(this.state.gridArea, this.state.gridDate, this.state.gridLATA, this.state.gridNXX, this.state.gridState, this.state.gridTel, this.state.gridTime, this.state.gridTD, this.state.gridSD);
    let types = this.state.gridType.filter(function (el) {return el !== ""});
    if (this.state.action === "C") {
      if (this.state.so === "") {this.setState({message: "Please input service order"});return false;}
      if (this.state.sfed === "") {this.setState({message: "To create a new 'CAD', please enter the EFF Date/Time on CAD!"});return false;}
      if (this.state.network === "") {this.setState({message: "Please input Network"});return false;}
      if (this.state.tel === "") {this.setState({message: "Please input Number"});return false;}
      if (this.state.lns === "") {this.setState({message: "Please input Line"});return false;}
      let iec = this.state.iec;
      let iac = this.state.iac;
      if (iec.replace(/\s/g, '') === origin_iec) {
        iec = "";
      }
      if (iac.replace(/\s/g, '') === origin_iac) {
        iac = "";
      }
      message = update_customer_record(this.props.somos.id, this.props.somos.ro, this.state.action, fix_num(this.state.num), this.state.sfed, iec, iac, this.state.abn,
        this.state.dau, this.state.dat, this.state.ddt, this.state.hold, this.state.directory, this.state.rao, this.state.so,
        this.state.sf, this.state.notes, this.state.agent, this.state.telco, this.state.customer, this.state.ro, this.state.list_address,
        this.state.ic, this.state.ncon, this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state,
        this.state.list_name, fix_num(this.state.tel), this.state.city, this.state.fso, this.state.lns, this.state.hml, this.state.lsis, this.state.lso,
        this.state.sfg, this.state.stn, this.state.uts, lads, types, this.state.gridData, this.state.copy_cpr, this.state.copy_cr, this.state.copy_lad);
    } else if (this.state.action === "N") {
      message = create_customer_record(this.props.somos.id, this.props.somos.ro, this.state.action, fix_num(this.state.num), this.state.sfed, this.state.iec, this.state.iac, this.state.abn,
        this.state.dau, this.state.dat, this.state.ddt, this.state.hold, this.state.directory, this.state.rao, this.state.so,
        this.state.sf, this.state.notes, this.state.agent, this.state.telco, this.state.customer, this.state.ro, this.state.list_address,
        this.state.ic, this.state.ncon.trim(), this.state.ctel, this.state.label, this.state.lata, this.state.network, this.state.state,
        this.state.list_name, fix_num(this.state.tel), this.state.city, this.state.fso, this.state.lns, this.state.hml, this.state.lsis, this.state.lso,
        this.state.sfg, this.state.stn, this.state.uts, lads, types, this.state.gridData);
    } else if (this.state.action === "D") {
      if (this.state.end === "") {
        this.setState({message: "Please input End Intercept!"});
        return false;
      }
      message = disconnect_customer(this.props.somos.id, this.props.somos.ro, this.state.action, fix_num(this.state.num), this.state.sfed, this.state.referral, this.state.end);
    } else if (this.state.action === "R") {
      message = resend_customer(this.props.somos.id, this.props.somos.ro, this.state.action, fix_num(this.state.num), this.state.sfed);
    }
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      const message = new MgiMessage(res.data.message);
      let state = '';
      this.setState({ddt: message.value("ED")[0], ed_origin: message.value("ED")[0], et_origin: message.value("ET")[0]});
      message.value("STAT")[0] ? state = state_value(message.value("STAT")[0].toString()) : state = "PENDING";
      let dates = [], date = '';
      if (this.state.action === "N") {
        if (message.value("ERR")[0]) {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " FAILED";
          dates.push(date);
          this.setState({message: error_customer_record_message(message.value("ERR")[0]), disable: false, dates: dates, sfed: date})
        } else {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " " + state;
          dates.push(date);
          this.setState({message: "CAD create successfully!", disable: true, dates: dates, sfed: date,})
        }
      } else if (this.state.action === "C") {
        dates = this.state.dates;
        dates.pop();
        if (message.value("ERR")[0]) {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " FAILED";
          dates.push(date);
          this.setState({message: error_customer_record_message(message.value("ERR")[0]), disable: false, dates: dates, sfed: date,})
        } else {
          date = message.value("ED")[0] + " " + message.value("ET")[0] + " " + state;
          dates.push(date);
          this.setState({message: "CAD update successfully!", disable: true, dates: dates, sfed: date})
        }
      } else if (this.state.action === "D") {
        message.value("ERR")[0] ? this.setState({message: error_customer_record_message(message.value("ERR")[0]), sfed: ''}) : this.setState({message: "CAD disconnect successfully", sfed:''});
      } else if (this.state.action === "R") {
        message.value("ERR")[0] ? this.setState({message: error_customer_record_message(message.value("ERR")[0])}) : this.setState({message: "CAD resend successfully"});
      }
    }
  };

  copy_customer = () => {
    let dates = this.state.dates;
    let date = fixed_date(this.state.copy_sfed, this.state.copy_now);
    dates.push(date);
    this.setState({dates: dates, sfed: date, large: false, action: "C",disable: false, update: false,message:"CAD copy successfully!"});
    !this.state.copy_cr && this.setState({lns: '', network: '' });
    !this.state.copy_lad &&
    this.setState({gridArea: Array(7).fill(Array(11).fill('')), gridDate: Array(7).fill(Array(11).fill('')), gridLATA: Array(7).fill(Array(11).fill('')),
      gridNXX: Array(7).fill(Array(11).fill('')), gridState: Array(7).fill(Array(11).fill('')), gridTel: Array(7).fill(Array(11).fill('')), gridTime: Array(7).fill(Array(11).fill('')),
      gridTD: Array(7).fill(Array(11).fill('')), gridSD: Array(7).fill(Array(11).fill('')), isLATA: false, isSD: false, isArea: false, isDate: false, isState: false, isNXX: false,
      isTime: false, isTD: false, isTel: false });
    !this.state.copy_cpr && this.setState({gridType: Array(10).fill(''), gridData: Array(5).fill(Array(10).fill(''))});
  };

  delete_customer = async () => {
    this.setState({toggle_delete: false});
    let date = fixed_date(this.state.delete_sfed, this.state.delete_now);
    let message = deleteCad(this.props.somos.id, this.props.somos.ro, date, fix_num(this.state.num));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      let message = new MgiMessage(res.data.message);
      message.value("ERR")[0] ? this.setState({message: error_customer_record_message(message.value("ERR")[0])}): this.setState({message: "CAD delete successfully"});
      this.setState({disable: true});
    }
  };

  convertCadToPad = async () => {
    this.setState({cpr: false});
    let date = fixed_date(this.state.rec_sfed, this.state.rec_now);
    let message = cadToPad(this.props.somos.id, this.props.somos.ro, date, fix_num(this.state.num), this.state.template, this.state.sfed);
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      if (message.value("ERR")[0]) {
        this.setState({message: error_customer_record_message(message.value("ERR")[0])});
      } else {
        localStorage.setItem("number", this.state.num);
        this.props.navigate('/customer_admin/pointer_data');
        window.location.reload();
      }
      this.setState({disable: true});
    }
  };

  goLad = () => {this.setState({isLad: !this.state.isLad, isCpr: false})};
  goCpr = () => {this.setState({isCpr: !this.state.isCpr, isLad: false})};
  transfer = async () => {
    this.setState({tran: false});
    let date = fixed_date(this.state.transfer_sfed, this.state.transfer_now);
    let message = transfer(this.props.somos.id, this.props.somos.ro, date, fix_num(this.state.num), this.state.ed_origin, this.state.et_origin);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'CRC', 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      console.log(res.data.message);
      let message = new MgiMessage(res.data.message);
      if (message.value("ERR")[0]) {
        this.setState({message: error_customer_record_message(message.value("ERR")[0])});
        return false;
      } else {
        this.setState({
          message: "Successfully transfer CAD",
          ed: message.value("ED")[0],
          et: message.value("ET")[0],
        })
      }
      this.setState({disable: true});
    }
  };
  clear = () => {this.setState(this.initialState);};
  copyDate = (date) => {this.setState({copy_sfed: date});};
  transferDate = (date) => {this.setState({transfer_sfed: date});};
  deleteDate = (date) => {this.setState({delete_sfed: date});};
  recDate = (date) => {this.setState({rec_sfed: date});};
  handle(event) {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
    if (event.target.name === "action" && event.target.value==="D") {
      this.setState({dates: [], disconnect: false, update: false});
    }
  }
  handleCheck = (event)=> {const state = {}; state[event.target.name] = event.target.checked;this.setState(state);};
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
  toggle = (tab) => {this.state.activeTab !== tab && this.setState({activeTab: tab});};
  toggleLarge = () => {this.setState({large: !this.state.large});};
  toggleDelete = () => {this.setState({toggle_delete: !this.state.toggle_delete})};
  toggle_cpr = () => {this.setState({cpr: !this.state.cpr});};
  toggle_transfer = () => {this.setState({tran: !this.state.tran});};
  insertCell = (type) => {
    if (type === "AC") {this.setState({gridArea: insert_cell(this.state.gridArea)})
    } else if (type === "DT") {this.setState({gridDate: insert_cell(this.state.gridDate)})
    } else if (type === "LT") {this.setState({gridLATA: insert_cell(this.state.gridLATA)})
    } else if (type === "TD") {this.setState({gridTD: insert_cell(this.state.gridTD)})
    } else if (type === "SD") {this.setState({gridSD: insert_cell(this.state.gridSD)})
    } else if (type === "NX") {this.setState({gridNXX: insert_cell(this.state.gridNXX)})
    } else if (type === "TI") {this.setState({gridTime: insert_cell(this.state.gridTime)})
    } else if (type === "TE") {this.setState({gridTel: insert_cell(this.state.gridTel)})
    } else if (type === "ST") {this.setState({gridState: insert_cell(this.state.gridState)})}
  };
  deleteCell = (type) => {
    if (type === "AC") {this.setState({gridArea: delete_cell(this.state.gridArea)});
    } else if (type === "TI") {this.setState({gridTime: delete_cell(this.state.gridTime)})
    } else if (type === "TD") {this.setState({gridTD: delete_cell(this.state.gridTD)})
    } else if (type === "SD") {this.setState({gridSD: delete_cell(this.state.gridSD)})
    } else if (type === "TE") {this.setState({gridTel: delete_cell(this.state.gridTel)})
    } else if (type === "ST") {this.setState({gridState: delete_cell(this.state.gridState)})
    } else if (type === "NX") {this.setState({gridNXX: delete_cell(this.state.gridNXX)})
    } else if (type === "DT") {this.setState({gridDate: delete_cell(this.state.gridDate)})
    } else if (type === "LT") {this.setState({gridLATA: delete_cell(this.state.gridLATA)})}
  };
  insertCprCell = () => {this.setState({gridData: insert_cell(this.state.gridData)})};
  deleteCprCell = () => {this.setState({gridData: delete_cell(this.state.gridData)})};
  insertCprColumn = () => {
    let data = this.state.gridData;
    for (let i = 0; i< data.length; i++) {
      data[i]=insert_cell(data[i]);
    }
    this.setState({gridData: data});
    let type = this.state.gridType;
    type.push("");
    this.setState({gridType: type});
  };
  deleteCprColumn = () => {
    let data = this.state.gridData;
    for (let i = 0; i< data.length; i++) {
      data[i]=delete_cell(data[i]);
    }
    this.setState({gridData: data});
    let type = this.state.gridType;
    type.pop();
    this.setState({gridType: type});
  };
  handleChange = (ev) => {this.setState({gridType: handle_change(ev, this.state.gridType)});};
  handleValue = (ev) => {this.setState({gridData: handle_value_cpr(ev, this.state.gridData)});};

  render() {
    return (
      <div className="animated fadeIn mt-1">
        <Label className="ml-1"><strong style={{fontSize: 25}}>Customer Record Admin Data</strong></Label>
        <Row>
          <Col xs="12">
            <Card>
              <div className="mt-3 mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <Row className="mt-2 ml-4 mr-4">
                  <Col xs="12" md="6" className="row">
                    <p className="col-5 font-weight-bold">Toll Free Number * :</p>
                    <Input className="col-4 form-control-sm" type="text" name="num" id="num" onChange={(ev) => this.handle(ev)} value={this.state.num}/>
                  </Col>
                  <Col xs="12" md="6" className="row">
                    <Label className="col-5 font-weight-bold">Eff.Date/Time/Status:</Label>
                    {!this.state.dates.length ?
                      <Input className="col-4 form-control-sm" type="text" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed}/> :
                      <select className="col-4 form-control-sm" name="sfed" id="sfed" onChange={(ev) => this.handle(ev)} value={this.state.sfed}>
                        <>
                          {this.state.dates.map(value => {
                            return <option>{value}</option>
                          })}
                        </>
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
              <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <div className="mt-2 mb-1 ml-4 mr-4">
                  <Row>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right font-weight-bold">Action:</Label>
                      <Input className="col-6 form-control-sm" type="select" name="action" id="action" onChange={(ev) => this.handle(ev)} value={this.state.action}>
                        <option value="N">N</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="T">T</option>
                        <option value="R">R</option>
                        <option value="X">X</option>
                      </Input>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right font-weight-bold">Service Order:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="so" id="so" onChange={(ev) => this.handle(ev)} value={this.state.so} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Sup.Form:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="sf" id="sf" onChange={(ev) => this.handle(ev)} value={this.state.sf} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Due.Date:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="ddt" id="ddt" onChange={(ev) => this.handle(ev)} value={this.state.ddt} disabled={this.state.disable}/>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Customer:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="customer" id="customer" onChange={(ev) => this.handle(ev)} value={this.state.customer} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Agent:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="agent" id="agent" onChange={(ev) => this.handle(ev)} value={this.state.agent} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right font-weight-bold">Telco:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="telco" id="telco" onChange={(ev) => this.handle(ev)} value={this.state.telco} disabled={this.state.disable}/>
                    </Col>
                    <Col xs="12" md="3" className="row">
                      <Label className="col-6 text-right">Hold:</Label>
                      <Input className="col-6 form-control-sm" type="select" name="hold" id="hold" onChange={(ev) => this.handle(ev)} value={this.state.hold} disabled={this.state.disable}>
                        <option value="N">No</option>
                        <option value="Y">Yes</option>
                      </Input>
                    </Col>
                  </Row>
                </div>
              </div>
              <Row>
                <Col md="6" xs="12">
                  <div className="mb-1 ml-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <div style={{backgroundColor: '#c8ced3'}}>
                      <Label className="ml-3 mt-1 mb-1 font-weight-bold">Listing</Label>
                    </div>
                    <Row className="mt-2 ml-4 mr-4">
                      <Col xs="12" md="4" className="row">
                        <Label className="col-7 text-right">Directory:</Label>
                        <Input className="col-5 form-control-sm" type="select" name="directory" id="directory" onChange={(ev) => this.handle(ev)} value={this.state.directory} disabled={this.state.disable}>
                          <option value="NP">NP</option>
                          <option value="BL">BL</option>
                          <option value="LI">LI</option>
                        </Input>
                      </Col>
                      <Col xs="12" md="4" className="row">
                        <Label className="col-7 text-right">DA Update:</Label>
                        <Input className="col-5 form-control-sm" type="select" name="dau" id="dau" onChange={(ev) => this.handle(ev)} value={this.state.dau} disabled={this.state.disable}>
                          <option value="N">No</option>
                          <option value="Y">Yes</option>
                        </Input>
                      </Col>
                      <Col xs="12" md="4" className="row">
                        <Label className="col-6 text-right">DA Type:</Label>
                        <Input className="col-6 form-control-sm" type="select" name="dat" id="dat" onChange={(ev) => this.handle(ev)} value={this.state.dat} disabled={this.state.disable}>
                          <option value="N">Normal</option>
                          <option value="G">Government</option>
                          <option value="F">Frequently Called</option>
                        </Input>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs="12" md="12" className="row">
                        <Label className="col-4 text-right">Listing Name:</Label>
                        <Input className="col-8 form-control-sm" type="text" name="list_name" id="list_name" onChange={(ev) => this.handle(ev)} value={this.state.list_name} disabled={this.state.disable}/>
                      </Col>
                    </Row>
                    <Row className="mt-1 mb-1">
                      <Col xs="12" md="12" className="row">
                        <Label className="col-4 text-right">List Address:</Label>
                        <Input className="col-8 form-control-sm" type="text" name="list_address" id="list_address" onChange={(ev) => this.handle(ev)} value={this.state.list_address} disabled={this.state.disable}/>
                      </Col>
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
                      <Input className="col-8 text-left form-control-sm" type="textarea" name="notes" id="notes"
                             onChange={(ev) => this.handle(ev)} value={this.state.notes}
                             disabled={this.state.disable}/>
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
                          <Input type="text" name="network" id="network" onChange={(ev) => this.handle(ev)}
                                 placeholder="Networks" value={this.state.network} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="2">
                          <Input type="text" name="state" id="state" onChange={(ev) => this.handle(ev)}
                                 placeholder="States" value={this.state.state} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="3">
                          <Input type="text" name="npa" id="npa" onChange={(ev) => this.handle(ev)}
                                 placeholder="NPAs" value={this.state.npa} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="4">
                          <Input type="text" name="lata" id="lata" onChange={(ev) => this.handle(ev)}
                                 placeholder="LATAs" value={this.state.lata} disabled={this.state.disable}/>
                        </TabPane>
                        <TabPane tabId="5">
                          <Input type="text" name="label" id="label" onChange={(ev) => this.handle(ev)}
                                 placeholder="Labels" value={this.state.label} disabled={this.state.disable}/>
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
                        <Input className="col-6 text-left" type="textarea" name="iac" id="iac"
                               onChange={(ev) => this.handle(ev)} value={this.state.iac}
                               disabled={this.state.disable}/>
                      </Row>
                      <Row className="col-6">
                        <Label className="col-6 text-right font-weight-bold">InterLATA:</Label>
                        <Input className="col-6 text-left" type="textarea" name="iec" id="iec"
                               onChange={(ev) => this.handle(ev)} value={this.state.iec}
                               disabled={this.state.disable}/>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="mb-1 ml-4 mr-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                <div style={{backgroundColor: '#c8ced3'}}>
                  <Label className="ml-3 mt-1 mb-1 font-weight-bold">Destination</Label>
                </div>
                <table className="table-bordered table-responsive-lg mt-2 mb-2 mr-4 ml-4">
                  <thead>
                  <tr>
                    <th className="text-center">Number</th>
                    <th className="text-center">City</th>
                    <th className="text-center">UTS</th>
                    <th className="text-center">#Lines</th>
                    <th className="text-center">LSIS</th>
                    <th className="text-center">LSO</th>
                    <th className="text-center">FSO</th>
                    <th className="text-center">STN</th>
                    <th className="text-center">SFG</th>
                    <th className="text-center">HML</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><Input type="text" name="tel" id="tel" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.tel} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="city" id="city" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.city} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="uts" id="uts" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.uts} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="lns" id="lns" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.lns} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="lsis" id="lsis" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.lsis} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="lso" id="lso" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.lso} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="fso" id="fso" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.fso} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="stn" id="stn" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.stn} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="sfg" id="sfg" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.sfg} disabled={this.state.disable}/></td>
                    <td><Input type="text" name="hml" id="hml" onChange={(ev) => this.handle(ev)} className="form-control-sm" value={this.state.hml} disabled={this.state.disable}/></td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <Row>
                <Col md="6" xs="12">
                  <div className="mb-1 ml-4 border" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Row className="mt-2 mb-2">
                      <Col xs="12" md="4" className="row">
                        <Label className="col-7 text-right">Bill TN:</Label>
                        <Input className="col-5 form-control-sm" type="text" name="abn" id="abn" onChange={(ev) => this.handle(ev)} value={this.state.abn} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="4" className="row">
                        <Label className="col-7 text-right">RAO:</Label>
                        <Input className="col-5 form-control-sm" type="text" name="rao" id="rao" onChange={(ev) => this.handle(ev)} value={this.state.rao} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="4" className="row">
                        <Label className="col-7 text-right">IC/EC:</Label>
                        <Input className="col-5 form-control-sm" type="text" name="ic" id="ic" onChange={(ev) => this.handle(ev)} value={this.state.ic} disabled={this.state.disable}>
                          <option/>
                        </Input>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col md="6" xs="12">
                  <div className="mb-1 mr-4 border row" style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Col xs="12" md="6" className="row mt-2 mb-2">
                      <Label className="col-6 text-right">End Intercept:</Label>
                      <Input className="col-6 form-control-sm" type="text" name="end" id="end" onChange={(ev) => this.handle(ev)} value={this.state.end} disabled={this.state.disconnect}/>
                    </Col>
                    <Col xs="12" md="6" className="row mt-2 mb-2">
                      <Label className="col-6 text-right">Referral:</Label>
                      <Input className="col-6 form-control-sm" type="select" name="referral" id="referral" onChange={(ev) => this.handle(ev)} value={this.state.referral} disabled={this.state.disconnect}>
                        <option value="N">No</option>
                        <option value="Y">Yes</option>
                      </Input>
                    </Col>
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
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.retrieve} onClick={() => this.retrieve_number(this.state.num, this.state.sfed)}>Retrieve</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.update} onClick={this.updateCad}>Update</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.copy} onClick={this.toggleLarge}>Copy</Button>
                    <Button size="md" color="primary" className="mr-2" disabled={this.state.transfer} onClick={this.toggle_transfer}>Transfer</Button>
                    <Button size="md" color="primary" disabled={this.state.delete} onClick={this.toggleDelete}>Delete</Button>
                  </Col>
                  <Col xs="12" md="5" className="text-right">
                    <Button size="md" color="danger" className="mr-2" onClick={this.goCpr} disabled={this.state.cpr}>CPR</Button>
                    <Button size="md" color="danger" className="mr-2" onClick={this.goLad} disabled={this.state.lad}>LAD</Button>
                    <Button size="md" color="danger" className="mr-2" onClick={this.toggle_cpr} disabled={this.state.rec} >REC</Button>
                    <Button size="md" color="danger" className="mr-2" onClick={this.clear}>Clear</Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleLarge}>Copy Customer Record</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="num">Dial#:</Label>
                    <Input type="text" name="num" id="num" value={this.state.num}
                           disabled/>
                    <Label htmlFor="et_origin">Effective Date/Time</Label>
                    <Input type="text" name="sfed" id="sfed" value={this.state.ed_origin + " " + this.state.et_origin}
                           disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_template">Dial#/Template: </Label>
                    <Input type="text" name="copy_num" id="copy_num" onChange={(ev) => this.handle(ev)} value={this.state.copy_num}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker
                          dateFormat="MM/DD/YY hh:mmA/C"
                          selected={this.state.copy_sfed}
                          showTimeSelect
                          timeIntervals={15}
                          onChange={this.copyDate}
                          className="form-control"
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
                  <CardBody>
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
            <Button type="submit" size="md" color="primary" className="mr-2"
                    onClick={this.copy_customer}> Copy</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toggleLarge}> Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.tran} toggle={this.toggle_transfer}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggle_transfer}>Customer Record Transfer</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="num">Dial#:</Label>
                    <Input type="text" name="num" id="num" value={this.state.num}
                           disabled/>
                    <Label htmlFor="et_origin">Effective Date/Time</Label>
                    <Input type="text" name="sfed" id="sfed" value={this.state.ed_origin + " " + this.state.et_origin}
                           disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_num">Dial#/Template: </Label>
                    <Input type="text" name="copy_num" id="copy_num" onChange={(ev) => this.handle(ev)} value={this.state.num}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker
                          dateFormat="MM/DD/YY hh:mmA/C"
                          selected={this.state.transfer_sfed}
                          showTimeSelect
                          timeIntervals={15}
                          onChange={this.transferDate}
                          className="form-control"
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
            <Button type="submit" size="md" color="primary" className="mr-2"
                    onClick={this.transfer}> Transfer</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toggle_transfer}> Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.cpr} toggle={this.toggle_cpr}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggle_cpr}>Customer Record Convert</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label>Toll Free Number</Label>
                    <Input type="text" name="num" id="num" value={this.state.num} disabled/>
                    <Label>Effective Date/Time </Label>
                    <Input type="text" name="ed" id="ed" disabled value={this.state.sfed}/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label>Template Name</Label>
                    <Input type="text" name="template" id="template"
                           onChange={(ev) => this.handle(ev)}/>
                    <Label>Effective Date/Time </Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker
                          dateFormat="MM/DD/YY hh:mmA/C"
                          selected={this.state.rec_sfed}
                          showTimeSelect
                          timeIntervals={15}
                          onChange={this.recDate}
                          className="form-control"
                          timeCaption="time"/>
                      </Col>
                      <div className="form-check align-content-center">
                        <Input type="checkbox" className="form-check-input" id="rec_now" name="rec_now" onChange={this.handleCheck} checked={this.state.rec_now}/>
                        <label className="form-check-label"> NOW</label>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="md" color="primary" className="mr-2"
                    onClick={this.convertCadToPad}> Convert CAD to PAD</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toggle_cpr}> Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLad} toggle={this.goLad}
               className={'modal-md ' + this.props.className}>
          <ModalHeader toggle={this.goLad}>Label Definitions</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <div className="mt-3 mb-1 ml-4 mr-4 border"
                     style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                  <Row className="mt-2 ml-4 mr-4">
                    <Col xs="12" md="6" className="row">
                      <p className="col-5 font-weight-bold">Dial#/Template Name *:</p>
                      <Input className="col-4 form-control-sm" type="text" name="template" id="template"
                             onChange={(ev) => this.handle(ev)} value={this.state.num} disabled={this.state.disable} />
                    </Col>
                    <Col xs="12" md="6" className="row">
                      <Label className="col-5 font-weight-bold">Eff.Date/Time/Status:</Label>
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
                    <Col xs="12" md="2" className="row float-right">
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
                    <Input className="col-8" type="textarea" name="message" id="message"
                           onChange={(ev) => this.handle(ev)} value={this.state.message} disabled={this.state.disable}/>
                  </div>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.isCpr} toggle={this.goCpr}
               className={'modal-md ' + this.props.className}>
          <ModalHeader toggle={this.goCpr}>Call Processing</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <Card>
                  <div className="mt-3 mb-1 ml-4 mr-4 border"
                       style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '#f0f3f5'}}>
                    <Row className="mt-2 ml-4 mr-4">
                      <Col xs="12" md="6" className="row">
                        <p className="col-5 font-weight-bold">Dial#/Template Name *:</p>
                        <Input className="col-4 form-control-sm" type="text" name="num" id="num"
                               onChange={(ev) => this.handle(ev)} value={this.state.num} disabled={this.state.disable}/>
                      </Col>
                      <Col xs="12" md="6" className="row">
                        <Label className="col-5 font-weight-bold">Eff.Date/Time/Status:</Label>
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
                      {/*<Button size="sm" color="primary" className="ml-4">Add Section</Button>*/}
                      {/*<Button size="sm" color="primary" className="ml-4">Delete Section</Button>*/}
                    </Col>
                    <Col xs="12" className="mt-2 mb-1">
                      <table className="table-bordered" style={{width: '100%'}}>
                        <thead>
                        <tr>
                          {this.state.gridType.map((value) => {
                            if (value === "TI") value = "Time";
                            else if (value === "DT") value = "Date";
                            else if (value === "TE") value = "Tel#";
                            else if (value === "DA") value = "Day";
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
                            return (<th className="text-center">{value}</th>)
                          })}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          {this.state.gridType.map((value, i) => {
                            return (
                              <td>
                                <Input type="select" name={'type_' + i} className="form-control-sm" value={value}
                                       onChange={(ev) => this.handleChange(ev)} disabled={this.state.disable}>
                                  <option>&lt;select&gt;</option>
                                  <option value="TI">Time</option>
                                  <option value="DT">Date</option>
                                  <option value="TE">Tel#</option>
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
                        {
                          this.state.gridData.map((datas, k) => {
                            return (
                              <tr>
                                {
                                  datas.map((data, g) => {
                                    return (
                                      <td><Input type="text" className="form-control-sm" name={k + "_" + g}
                                                 value={data} onChange={(ev) => this.handleValue(ev)}
                                                 disabled={this.state.disable}/></td>
                                    )
                                  })
                                }
                              </tr>
                            )
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
                      <div className="mb-1 ml-4 mr-4 border"
                           style={{borderRadius: 5, borderColor: '#c8ced3', backgroundColor: '##f0f3f5'}}>
                        <div className="ml-4 mr-4 mt-2 mb-2 row">
                          <Col xs="3" className="row">
                            <Col xs="6">IntraLATA Carrier:</Col>
                            <Col xs="6"><Input type="select" className="form-control-sm" disabled={this.state.disable}>
                              {this.state.iac_array.map(value => {
                                return <option value={value}>{value}</option>
                              })}
                            </Input></Col>
                          </Col>
                          <Col xs="3" className="row">
                            <Col xs="6">InterLATA Carrier:</Col>
                            <Col xs="6"><Input type="select" className="form-control-sm" disabled={this.state.disable}>
                              {this.state.iec_array.map(value => {
                                return <option value={value}>{value}</option>
                              })}
                            </Input></Col>
                          </Col>
                          <Col xs="3" className="row">
                            <Col xs="6">Time Zone:</Col>
                            <Col xs="6"><Input type="select"
                                               className="form-control-sm" value={this.state.timezone}
                                               disabled={this.state.disable}>
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
                            <Col xs="6" className="text-right"><Input type="checkbox" checked={this.state.ds === "Y"}
                                                                      disabled={this.state.disable}/></Col>
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
                             onChange={(ev) => this.handle(ev)} value={this.state.message}
                             disabled={this.state.disable}/>
                    </div>
                  </Card>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.toggle_delete} toggle={this.toogleDelete}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toogleDelete}>Delete Customer Record</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col xs="6">
                <Card>
                  <CardHeader>Source Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="num">Dial#:</Label>
                    <Input type="text" name="num" id="num" value={this.state.num}
                           disabled/>
                    <Label htmlFor="et_origin">Effective Date/Time</Label>
                    <Input type="text" name="sfed" id="sfed" value={this.state.ed_origin + " " + this.state.et_origin}
                           disabled/>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardHeader>Target Record</CardHeader>
                  <CardBody>
                    <Label htmlFor="copy_template">Dial#/Template: </Label>
                    <Input type="text" name="copy_num" id="copy_num" onChange={(ev) => this.handle(ev)} value={this.state.num}/>
                    <Label htmlFor="et_copy">Effective Date/Time</Label>
                    <Row>
                      <Col xs="7">
                        <DatePicker
                          dateFormat="MM/DD/YY hh:mmA/C"
                          selected={this.state.delete_sfed}
                          showTimeSelect
                          timeIntervals={15}
                          onChange={this.deleteDate}
                          className="form-control"
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
            <Button type="submit" size="md" color="primary" className="mr-2"
                    onClick={this.delete_customer}> Delete</Button>
            <Button type="reset" size="md" color="danger" onClick={this.toogleDelete}> Cancel</Button>
          </ModalFooter>
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
            return (<td><Input type="text" className="form-control-sm" name={index + "_" + i + "_" + j} value={element} onChange={func}
                               disabled={this.state.disable}/></td>)})}
        </tr>)})
        }
        </tbody>
      </table>
      <div className="mt-2">
        <Button size="sm" color="primary" onClick={() => this.insertCell(index)} disabled={this.state.disable}>Insert Cell</Button>
        <Button size="sm" color="primary" onClick={() => this.deleteCell(index)} className="ml-3" disabled={this.state.disable}>Delete Cell</Button>
      </div>
    </TabPane>
  }
}
export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(CustomerData));
