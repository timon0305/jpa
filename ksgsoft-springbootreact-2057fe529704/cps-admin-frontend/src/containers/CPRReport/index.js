import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Label, Row} from 'reactstrap';
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import {withAuthApiLoadingNotification} from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader';
import RestApi from "../../service/RestApi";
import './style.css'
import CardHeader from "reactstrap/es/CardHeader";
import produce from "immer";
import CardFooter from "reactstrap/es/CardFooter";
import FormGroup from "reactstrap/es/FormGroup";
import FormFeedback from "reactstrap/es/FormFeedback";
import ViewCPRModal from './ViewCPRModal';

const Header = cardHeader(true, false);

class CPRReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lcrReportList: [], reportName: "", isReportName: false, lcrList: [], isLcr: false, selectedLcr: '',
      data: [], page: 0, sort: [], filter: [], defaultRate: 0, isDefaultRate: false,
      pageSize: 0, total_page: 0,
      modal: {
        isOpen: false,
        data: [], page: 0, sort: [], filter: [],
        pageSize: 0, total_page: 0, id: null,
        totalCost: 0, averageRate: 0, defaultCarrier: "", defaultCarrierNpaNxx: ""
      },
    }
  }

  componentDidMount() {
    this.props.callApi(RestApi.getLCRReportList, response => {
      if (response.ok) {
        this.setState({lcrReportList: response.data});
      }
    })
  };

  cprgenReport = () => {
    if (this.state.reportName === "") {this.setState({isReportName: true});return false;}
    if (this.state.selectedLcr === "") {this.setState({isLcr: true}); return false;}
    if (this.state.defaultRate === 0) {this.setState({isDefaultRate: true}); return false;}
    this.props.callApi(RestApi.createCPRReport, response => {
    }, {lcrReportId: this.state.selectedLcr, name: this.state.reportName, defaultRate: parseFloat(this.state.defaultRate)});
  };

  viewCPRReport = (id) => {
    this.props.callApi(RestApi.getCprReportSummary, response => {
      if (response.ok) {
        this.setState({modal: produce(this.state.modal, m=> {
          m.totalCost = response.data.totalCost;
          m.averageRate = response.data.averageRate;
          m.defaultCarrier = response.data.defaultCarrier;
          m.defaultCarrierNpaNxx = response.data.defaultCarrierNpaNxx;
          })
        })
      }
    }, id);
    this.setState({
      modal: produce(this.state.modal, m => {
        m.isOpen = true;
        m.id = id
      })
    })
  };

  columns = [
    {
      Header: 'Name',
      accessor: 'name',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Used LCR Report',
      accessor: 'lcr_report_name',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: (row) => {
        let date = new Date(row.row.created_at);
        return <div className="text-center">{date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()} </div>
      }
    },
    {
      Header: 'Updated At',
      accessor: 'updated_at',
      Cell: (row) => {
        let date = new Date(row.row.updated_at);
        return <div className="text-center">{date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()} </div>
      }
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: props => <div className="text-center">
        <Button size="sm" color="primary" onClick={() => this.viewCPRReport(props.value)}>View</Button>
        <Button size="sm" color="success" className="ml-2" onClick={() => {
          this.downloadForm.action = process.env.REACT_APP_API_ENDPOINT + "cprgen/cpr_report/" + props.value + "/download";
          this.textInput.value = this.props.auth.token;
          this.downloadForm.submit();
          this.textInput.value = "";
        }}>Download</Button>
        <Button size="sm" color="success" className="ml-2" onClick={() => {
          this.downloadForm.action = process.env.REACT_APP_API_ENDPOINT + "cprgen/cpr_report/" + props.value + "/download_npanxx";
          this.textInput.value = this.props.auth.token;
          this.downloadForm.submit();
          this.textInput.value = "";
        }}>Download NPANXX</Button>
      </div>
    },
  ];

  CPRColumns = [
    {
      Header: 'ROW ANI',
      accessor: 'row_ani',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Cost',
      accessor: 'cost',
      filterable: true,
      Cell: props => <div className="text-center">{props.value.toFixed(3)}</div>
    },
    /*
    {
      Header: 'Cost Save',
      accessor: 'cost_savings',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },*/
    {
      Header: 'Duration',
      accessor: "duration",
      Cell: (row) => {
        let data = row.row.duration;
        const wholeSecs = Math.floor(data);
        const mins = Math.floor(wholeSecs / 60);
        const secs = Math.floor(data - 60 * mins);
        const expr = ((mins > 0) ? mins + 'min ' : '') + secs + 's ';
        return <div className="text-center">{expr}</div>
      }
    },
    {
      Header: 'Rate',
      accessor: 'rate',
      filterable: true,
      Cell: props => <div className="text-center">{props.value.toFixed(3)}</div>
    },
    /*
    {
      Header: 'Re-Rate',
      accessor: 're_rate',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },*/
    {
      Header: 'Carrier',
      accessor: 'carrier',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'LRN',
      accessor: 'lrn',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
  ];

  fetchData = () => {
    this.fetchTimer && clearTimeout(this.fetchTimer);
    this.fetchTimer = setTimeout(this._fetchData, 500)
  };

  _fetchData = () => {
    let sorts = [];
    let filters = [];
    if (this.state.sort.length) {
      let sorted = this.state.sort;
      let column = sorted[0][0].id;
      let direction = sorted[0][0].desc;
      if (direction === false) direction = "asc";
      else if (direction === true) direction = "desc";
      let sort = {
        "column": column,
        "direction": direction
      };
      sorts.push(sort)
    }
    if (this.state.filter.length) {
      let filtered = this.state.filter;
      filtered = filtered[0];
      let filter = {};
      for (let i = 0; i < filtered.length; i++) {
        filter = {
          "column": filtered[i].id,
          "contains": filtered[i].value
        };
        filters.push(filter);
      }
    }
    let data = {
      page: this.state.page,
      pageSize: this.state.pageSize === 0 ? 10 : this.state.pageSize,
      sorts: sorts,
      filters: filters
    };
    this.props.callApi(RestApi.getCPRReports, response => {
      console.log(response);
      if (response.ok) {
        this.setState({data: response.data.rows, total_page: response.data.totalPages});
      }
    }, data);
  };

  viewLCRData = () => {
    this.fetchTimer && clearTimeout(this.fetchTimer);
    this.fetchTimer = setTimeout(this._viewLCRData, 500)
  };

  _viewLCRData = () => {
    let sorts = [];
    let filters = [];
    if (this.state.modal.sort.length) {
      let sorted = this.state.modal.sort;
      let column = sorted[0][0].id;
      let direction = sorted[0][0].desc;
      if (direction === false) direction = "asc";
      else if (direction === true) direction = "desc";
      let sort = {
        "column": column,
        "direction": direction
      };
      sorts.push(sort)
    }
    if (this.state.modal.filter.length) {
      let filtered = this.state.modal.filter;
      filtered = filtered[0];
      let filter = {};
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].id === "role") {
          if (filtered[i].value === "all") {
            filter = {};
          } else {
            filter = {
              "column": "role_id",
              "exact": filtered[i].value
            }
          }
        } else {
          filter = {
            "column": filtered[i].id,
            "contains": filtered[i].value
          };
        }
        filters.push(filter);
      }
    }
    let data = {
      page: this.state.modal.page,
      pageSize: this.state.modal.pageSize === 0 ? 10 : this.state.modal.pageSize,
      sorts: sorts,
      filters: filters
    };
    this.props.callApi(RestApi.getCprReportDataById, response => {
      if (response.ok) {
        this.setState({
          modal: produce(this.state.modal, m => {
            m.data = response.data.rows;
            m.total_page = response.data.totalPages
          })
        })
      }
    }, this.state.modal.id, data);
  };

  handleRefresh = () => {this.fetchData()};

  handleUpdate = (type, value) => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m[type] = value
      })
    })
  };

  toggleModal = () => {
    const modal = produce(this.state.modal, m => {
      m.isOpen = !m.isOpen;
    });
    this.setState({modal});
  };

  render() {
    return (
      <Row>
        <Col lg="12">
          <Card>
            <Header>CPRgen Report</Header>
            <CardBody>
              <FormGroup row>
                <Col lg="4" className="row">
                  <Col lg="6" className="text-right">
                    <Label className="font-weight-bold">CPRgen Report Name:</Label>
                  </Col>
                  <Col lg="6">
                    <Input type="text" onChange={(ev)=> {this.setState({reportName: ev.target.value, isReportName: false});
                    }} className="form-control-sm" invalid={this.state.isReportName}/>
                    {this.state.isReportName ? <FormFeedback>Please input CPRgen report name!</FormFeedback> : ""}
                  </Col>
                </Col>
                <Col lg="4" className="row">
                  <Col lg="6" className="text-right">
                    <Label className="font-weight-bold">LCR Report List:</Label>
                  </Col>
                  <Col lg="6">
                    <Input type="select" onChange={(ev)=> {this.setState({selectedLcr: ev.target.value, isLcr: false});
                    }} className="form-control-sm" invalid={this.state.isLcr} required>
                      <option value=""/>
                      {this.state.lcrReportList.map(({id, name}) => {
                        return <option value={id}>{name}</option>
                      })}
                    </Input>
                    {this.state.isLcr ? <FormFeedback>Please select LCR report!</FormFeedback> : ""}
                  </Col>
                </Col>
                <Col lg="4" className="row">
                  <Col lg="6" className="text-right">
                    <Label className="font-weight-bold">Default Rate:</Label>
                  </Col>
                  <Col lg="6">
                    <Input type="number" onChange={(ev)=> {this.setState({defaultRate: ev.target.value, isDefaultRate: false});
                    }} className="form-control-sm" invalid={this.state.isDefaultRate}/>
                    {this.state.isDefaultRate ? <FormFeedback>Please input default rate!</FormFeedback> : ""}
                  </Col>
                </Col>
              </FormGroup>
            </CardBody>
            <CardFooter>
              <Button size="md" color="primary" onClick={this.cprgenReport}>CPRgen Report</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Row>
                <Col><strong className="card-title-big">CPRgen Report List</strong></Col>
                <Col>
                  <div className="text-right">
                    <Button size="md" color="link" onClick={this.handleRefresh}><i className="fa fa-refresh"/> Refresh</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <ReactTable
                manual
                data={this.state.data}
                columns={this.columns}
                defaultPageSize={10}
                onFilteredChange={(filter) => {
                  let filters = [];
                  filters.push(filter);
                  this.setState({filter: filters})
                }}
                onSortedChange={(sort) => {
                  let sorts = [];
                  sorts.push(sort);
                  this.setState({sort: sorts})
                }}
                onPageChange={(page)=>this.setState({page})}
                onPageSizeChange={(pageSize) => this.setState({pageSize: pageSize})}
                minRows={this.state.data.length && this.state.data.length}
                pages={this.state.total_page}
                onFetchData={this.fetchData}
              />
            </CardBody>
          </Card>
        </Col>
        <ViewCPRModal
          isOpen={this.state.modal.isOpen}
          toggle={this.toggleModal}
          columns={this.CPRColumns}
          data={this.state.modal.data}
          fetchData={this.viewLCRData}
          total_page={this.state.modal.total_page}
          handler={this.handleUpdate}
          averageRate={this.state.modal.averageRate}
          totalCost={this.state.modal.totalCost}
          defaultCarrier={this.state.modal.defaultCarrier}
          defaultCarrierNpaNxx={this.state.modal.defaultCarrierNpaNxx}
        />
        <form ref={(node)=> {this.downloadForm = node}} action="" target="_blank" method="post">
          <input type="hidden" ref={(input)=> {this.textInput = input}} name="access_token" value=""/>
        </form>
      </Row>
    );
  }
}

export default withAuthApiLoadingNotification(CPRReport);
