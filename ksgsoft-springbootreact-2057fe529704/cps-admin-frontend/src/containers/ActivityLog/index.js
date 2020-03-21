import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Label, Row, Collapse} from 'reactstrap';
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import produce from 'immer'
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader';
import RestApi from "../../service/RestApi";
import FormGroup from "reactstrap/es/FormGroup";
import '../../scss/smalltable.css';
import CardHeader from "reactstrap/es/CardHeader";
import ActivityReviewModal from './ActivityReviewModal';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import GetSomosMessageModal from "./GetSomosMessageModal";

const Header = cardHeader(true, true);

class ActivityLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], page: 0, total_page: 0,
      somos_id: '', ro: '', from: null, to: null, correlation_id: '',
      pageSize: 0,
      sort: [],
      modal: {isOpen: false, reviews: {}},
      isCollapsed: true,
      message: {isOpen: false, data: {}},
      req: "",
    }
  }

  formatInt(number, digits) {
    return new Intl.NumberFormat('en-IN', {'minimumIntegerDigits': digits, useGrouping: false}).format(number);
  };

  columns = [
    {
      Header: 'ID',
      accessor: 'somos_id',
      width: 85,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'RO',
      accessor: 'ro',
      width: 90,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Command',
      accessor: 'verb',
      width: 90,
      Cell: props => <div className="text-center">{props.original.verb + "-" + props.original.mod}</div>
    },
    {
      Header: 'Username',
      accessor: 'username',
      width: 90,
      Cell: props => props.value
    },
    {
      Header: 'Correlation Id',
      accessor: 'correlation_id',
      width: 130,
      Cell: props => props.value
    },
    {
      Header: 'Route ID',
      accessor: 'drc',
      width: 70,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Status Type',
      accessor: 'status_term_rept',
      filterable: false,
      width: 90,
      Cell: props => <div className="text-center" ><span style={{background: props.value === "COMPLD" ? 'green' : props.value === "DENIED" ? "orange" : "", color: props.value === "COMPLD" && "white", padding: 1, borderRadius: 4}}>{props.value}</span></div>
    },
    {
      Header: 'Status Code',
      accessor: 'status_error_code',
      filterable: false,
      width: 100,
      Cell: props => <div className="text-center" ><span style={{background: props.value === "00" ? 'green' : props.value === "01" ? "orange" : "", color: props.value === "00" && "white", padding: 1, borderRadius: 4}}>{props.value}</span></div>
    },
    {
      Header: 'Date',
      accessor: 'year',
      width: 200,
      Cell: props => props.original.year + "/" + this.formatInt(props.original.month, 2) + "/" +
        this.formatInt(props.original.day, 2) + " " + this.formatInt(props.original.hour, 2) + ":" + this.formatInt(props.original.minute, 2) + ":" + this.formatInt(props.original.second, 2) + " " + props.original.timezone
    },
    {
      Header: 'Destination Node Name',
      accessor: 'destination_node_name',
      width: 200,
      Cell: props => props.value
    },
    {
      Header: 'Source Node Name',
      accessor: 'source_node_name',
      width: 200,
      Cell: props => props.value
    },
    {
      Header: 'Action',
      accessor: 'action',
      width: 150,
      Cell: props => {
        return <div className="ml-3">
          <Button size="sm" color="primary" onClick={()=>this.reviewModal(props.original)} className="custom-button">View</Button>
          {props.original.verb !== "UNS" && <Button size="sm" color={props.original.verb === "REQ" ? "success" : "warning"} onClick={()=>this.getSomosMessgeById(props.original)} className="custom-button ml-1" >{props.original.verb === "REQ" ? "Response" : props.original.verb === "RSP" ? "Request" : ""}</Button>}
        </div>
      }
    }
  ];

  fetchData = () => {
    if (this.fetchTimer){
      clearTimeout(this.fetchTimer);
    }
    this.fetchTimer = setTimeout(this._fetchData, 300)
  };


  _fetchData = () => {
    let sorts = [];
    if (this.state.sort.length){
      let sorted = this.state.sort;
      let column = sorted[0][0].id;
      let direction = sorted[0][0].desc;
      if (column !== "status_term_rept" && column !== "status_error_code" && column !== "action") {
        if (direction === false) direction = "asc";
        else if (direction === true) direction = "desc";
        let sort = {
          "column": column,
          "direction": direction
        };
        sorts.push(sort)
      } else {
        return false;
      }
    }
    let filters = [];
    if (this.state.ro !== "") {
      filters.push({"column": "ro", "contains": this.state.ro,})
    }
    if (this.state.somos_id !== "") {
      filters.push({"column": "somos_id", "contains": this.state.somos_id,
      })
    }
    if (this.state.from) {
      filters.push({"column": "sms_created_at", "from": "FROM_UNIXTIME(" + this.state.from.getTime()/1000 + ")",
      })
    }
    if (this.state.to) {
      filters.push({"column": "sms_created_at", "to": "FROM_UNIXTIME(" + this.state.to.getTime()/1000 + ")",})
    }
    if (this.state.correlation_id !== "") {
      filters.push({"column": "correlation_id", "contains": this.state.correlation_id.trim(),})
    }
    let data = {
      page: this.state.page,
      pageSize: this.state.pageSize === 0 ? 20 : this.state.pageSize,
      sorts: sorts,
      filters: filters,
    };

    this.props.callApi(RestApi.activityLog, response => {
      if (response.ok) {
        this.setState({
          data: response.data.rows,
          total_page: response.data.totalPages
        })
      }
    }, data);
  };

  handleChange = (ev) => {
    let state = {};
    state[ev.target.name] = ev.target.value;
    this.setState(state);
  };
  reviewModal = (data) => {
    this.setState({modal: produce(this.state.modal, m => {
      m.reviews = data;
      m.isOpen = true
    })})
  };

  getSomosMessgeById = (req) => {
    this.setState({req: req.verb});
    this.props.callApi(RestApi.getSomosMessageById, response => {
      if (response.ok){
        this.setState({message: {data: response.data, isOpen: true}});
      }
    }, req.verb === "REQ" ? req.response_message_id : req.request_message_id);
  };
  fromDate = (date) => {this.setState({from: date});};
  toDate = (date) => {this.setState({to: date});};

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <Header toggle={() => this.setState({isCollapsed:!this.state.isCollapsed})} isCollapsed = {this.state.isCollapsed}>Search Log</Header>
            <Collapse isOpen={!this.state.isCollapsed}>
            <CardBody>
              <FormGroup row>
                <Col xs="3" className="row">
                  <Col xs="3" className="text-right"><Label for="somos_id">ID:</Label></Col>
                  <Col xs="9"><Input type="text" name="somos_id" onChange={this.handleChange} className="form-control-sm" value={this.state.somos_id}/></Col>
                </Col>
                <Col xs="3" className="row">
                  <Col xs="3" className="text-right"><Label for="ro">RO:</Label></Col>
                  <Col xs="9"><Input type="text" name="ro" onChange={this.handleChange} className="form-control-sm" value={this.state.ro}/></Col>
                </Col>
                <Col xs="3" className="row">
                  <Col xs="3" className="text-right"><Label for="from">FROM:</Label></Col>
                  <Col xs="9"><DatePicker dateFormat="yyyy/MM/dd" selected={this.state.from} onChange={this.fromDate}/></Col>
                </Col>
                <Col xs="3" className="row">
                  <Col xs="3" className="text-right"><Label for="to">TO:</Label></Col>
                  <Col xs="9"><DatePicker dateFormat="yyyy/MM/dd" selected={this.state.to} onChange={this.toDate}/></Col>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="3" className="row">
                  <Col xs="3" className="text-right"><Label for="correlation_id">Correlation:</Label></Col>
                  <Col xs="9"><Input type="text" name="correlation_id" onChange={this.handleChange} className="form-control-sm" value={this.state.correlation_id}/></Col>
                </Col>
              </FormGroup>
              <div className="text-right">
                <Button size="sm" color="primary" className="text-right" onClick={this.fetchData}>Search</Button>
              </div>
            </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader>
            <Row>
              <Col xs="9"><strong className="card-title-big">Activity Log</strong></Col>
              <Col xs="3">
                <div className="row text-right mt-1" style={{width: 400}}>
                  <div style={{background: '#BBDEFB', width: 15, height: 15, borderRadius: '50%'}} className="mt-1"/>
                  <Label>&nbsp;- Response</Label>
                  <div style={{background: '#C8E6C9', width: 15, height: 15, borderRadius: '50%'}} className="mt-1 ml-4"/>
                  <Label>&nbsp;- Unsolicited</Label>
                  <div style={{background: 'white', width: 15, height: 15, borderRadius: '50%'}} className="mt-1 ml-4"/>
                  <Label>&nbsp;- Request</Label>
                </div>
              </Col>
            </Row>
            </CardHeader>
            <CardBody>
              <ReactTable
                manual
                data={this.state.data}
                onFetchData={this.fetchData}
                columns={this.columns}
                defaultPageSize={20}
                onPageChange={(page) => this.setState({page})}
                onSortedChange={(sort) => {
                  let sorts = [];
                  sorts.push(sort);
                  this.setState({sort: sorts})
                }}
                onPageSizeChange={(pageSize) => {this.setState({pageSize: pageSize})}}
                minRows={this.state.data.length && this.state.data.length}
                getTrProps={(state, rowInfo) => {
                  return {
                    style: {
                      background: rowInfo.original !== undefined ? (rowInfo.original.verb === "RSP" ? "#BBDEFB" : (rowInfo.original.verb === "UNS" ? "#C8E6C9" : "")) : ""
                    }
                  }
                }}
                pages={this.state.total_page}
              />
            </CardBody>
          </Card>
        </Col>
        <ActivityReviewModal toggle={this.toggleModal} isOpen={this.state.modal.isOpen} reviews={this.state.modal.reviews}/>
        <GetSomosMessageModal toggle={this.toggleMessageModal} isOpen={this.state.message.isOpen} data={this.state.message.data} req={this.state.req}/>
      </Row>
    );
  }
  toggleModal = () => {
    this.setState({modal: produce(this.state.modal, m => {m.isOpen = !m.isOpen;})});
  };

  toggleMessageModal = () => {
    this.setState({message: produce(this.state.message, m => {m.isOpen = !m.isOpen;})});
  };
}

export default withLoadingAndNotification(ActivityLog);
