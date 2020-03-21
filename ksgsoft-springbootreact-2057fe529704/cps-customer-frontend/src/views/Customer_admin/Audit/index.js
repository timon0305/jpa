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
  FormText

} from 'reactstrap';
import ReactTable from 'react-table'
import '../../../scss/react-table.css'
import {customer_record, mod, timeout, verb} from "../../../service/customer";
import api from "../../../service/api";
import {Loader} from 'react-overlay-loader';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
// import storage from "../../../service/storage";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;


class Audit extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);


    this.state = {
      collapse: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_setting: 300,
      num: null,
      loading: false,
      isNum: true,
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
  handleChange(event) {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  customer = () => {
    if (this.state.num === null ) {
      this.setState({isNum: false});
      return false;
    } else {
      this.setState({isNum: true});
    }
    let message = customer_record(this.state.num);
    console.log(message);
    this.setState({loading: true});
    api.sendNew({
      'verb': verb,
      'mod': mod,
      'message': message,
      'timeout': timeout
    }).then(res => {
      this.setState({loading: false});
      let message = new MgiMessage(res.data.message);
    }).catch(err => {
      toast.warn("Server Connection Error!");
    })

  };

  render() {
   const data = [
     // {
    //   scp_id: 'BX01',
    //   status: 'OK',
    //   in_aos: 'Active',
    // },{
    //   scp_id: 'BX02',
    //   status: 'OK',
    //   in_aos: 'InActive',
    // },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   },
    //   {
    //     scp_id: 'BX02',
    //     status: 'OK',
    //     in_aos: 'InActive',
    //   }
    ];
    const columns = [
      {
        Header: 'SCP ID',
        accessor: 'scp_id',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'IN-AOS',
        accessor: 'in_aos'
      }
    ];
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Customer Record Audit/Resend</strong></Label>
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
                    <Input type="text" name="num" id="num" onChange={(ev)=>this.handleChange(ev)}/>
                    {!this.state.isNum ?
                      <FormText><p style={{color: 'red'}}>Please input Toll Free Number</p>
                      </FormText> : ""}
                    <Button size="md" color="primary" className="mt-3" onClick={this.customer}>Retrieve</Button>
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
                    <FormGroup row>
                      <Col xs="12" md="6">
                        <Button size="md" color="link"><i className="fa fa-gear" style={{fontSize: 30}}/></Button>
                      </Col>
                      <Col xs="12" md="6" className="text-right">
                        <Button size="md" color="link"><i className="fa fa-trash" style={{fontSize: 30}}/></Button>
                        <Button size="md" color="link"><i className="fa fa-print" style={{fontSize: 30}}/></Button>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="12" md="5">
                        <Input type="text" name="search" id="search" placeholder="Search"/>
                      </Col>
                      <Col xs="12" md="2"/>
                      <Col xs="12" md="5">
                        <Input type="select" name="search" id="search">
                          <option>Select</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <ReactTable data={data} columns={columns} defaultPageSize={10} minRows={2}/>
                    <FormGroup className="mt-3">
                      <Button size="md" color="danger">Cancel</Button>
                    </FormGroup>
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

export default withLoadingAndNotification(Audit);
