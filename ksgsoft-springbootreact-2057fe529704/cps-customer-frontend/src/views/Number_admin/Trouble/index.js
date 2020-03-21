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
  Tooltip, FormText

} from 'reactstrap';
import {connect} from 'react-redux'
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint from "react-to-print";

import {
  verb,
  timeout,
  trouble_number, fix_num, mod
} from '../../../service/numberSearch'
import api from '../../../service/api'
import {error_trouble_message} from "../../../service/error_message";
import 'react-overlay-loader/styles.css';
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class Trouble extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);


    this.state = {
      tooltipOpen: [false, false],
      collapse: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_setting: 300,
      loading: false,
      num: "",
      validNum: true,
      display: false,
      data: [],
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

  toggle_setting() {
    this.setState({collapse_setting: !this.state.collapse_setting});
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  retrieve_number = async () => {
    this.setState({display: false});
    if (this.state.num === "") {
      this.setState({validNum: false});
      return false;
    } else {
      this.setState({validNum: true})
    }
    let message = trouble_number(this.props.somos.id, this.props.somos.ro, fix_num(this.state.num));
    console.log(message);
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'TRN', 'message': message, 'timeout': timeout});
    console.log(res.data.message);
    if (res.ok && res.data && res.data.message) {
      let message = new MgiMessage(res.data.message);
      if (message.value("ERR")[0]) {
        toast.warn(error_trouble_message(message.value("ERR")[0]));
        return false;
      }

      let ro = message.value("ROTRN")[0];
      let ro_name = message.value("RONM")[0];
      let num = message.value("NUM")[0];
      let tran = message.value("TRN")[0];
      let datas = [];
      let data = {};

      if (ro !== "" && ro_name !== "" && num !== "" && tran !== ""){
        data = {
          ro: ro,
          ro_name: ro_name,
          num: num,
          tran: tran
        };
        datas.push(data);
        ro = "";
        ro_name = "";
        num = "";
        tran = "";
      }

      console.log(datas);
      this.setState({data: datas});
      this.setState({display: true});
    }
  };

  handleChange = (event) => {

    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  cancel = () => {
    this.setState({
      display: false,
      num: '',
    });
  };
  render() {

    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Trouble Referral Number Query</strong></Label>
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
                    <i className="fa fa-exclamation-circle fa-fw ml-5 size-3" id="tollfree_tooltip"
                       style={{fontSize: 25}}/>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen[1]} autohide={false}
                             target="tollfree_tooltip" toggle={() => {
                      this.toggle_tip(1);
                    }}>
                      Trouble Referral Input for Up to Ten Toll-Free Numbers
                    </Tooltip>
                    <Input type="textarea" name="num" id="num" rows="5" onChange={(ev) => this.handleChange(ev)} value={this.state.num}/>
                    {!this.state.validNum ?
                      <FormText><p style={{color: 'red'}}>Toll-Free Number#: Allows 10 alphanumerics and optionally two
                        dashes '-'</p>
                      </FormText> : ""}
                    <Button size="md" color="primary" className="mt-3" onClick={this.retrieve_number}>Retrieve</Button>
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
                    {this.state.display &&
                    <div>
                      <FormGroup row>
                        <Col xs="12" className="text-right">
                          <ReactToPrint
                            trigger={() => <Button size="lg" color="link"><i className="fa fa-print"
                                                                             style={{fontSize: 30}}/></Button>}
                            content={() => this.componentRef}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <table className="table ml-3 mr-3 mt-3" ref={el => (this.componentRef = el)}>
                          <tr>
                            <th>Toll Free Number</th>
                            <th>Resp Org</th>
                            <th>Trouble Ref#</th>
                            <th>Resp Org Name</th>
                          </tr>
                          {this.state.data.map((value) => {
                            console.log(value);
                            return (
                              <tr>
                                <td>{value.num}</td>
                                <td>{value.ro}</td>
                                <td>{value.tran}</td>
                                <td>{value.ro_name}</td>
                              </tr>
                            )
                          })}

                        </table>
                      </FormGroup>
                      <Button size="md" color="primary" onClick={this.cancel}>Cancel</Button>
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

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(Trouble));
