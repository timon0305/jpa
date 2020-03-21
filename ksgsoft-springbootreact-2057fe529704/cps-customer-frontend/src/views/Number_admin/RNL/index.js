import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, Col, FormGroup,
  Input, Label, Row
} from 'reactstrap';
import ReactTable from 'react-table'
import '../../../scss/react-table.css'
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
import {fix_num, mod, query_number, timeout} from "../../../service/numberSearch";
import {connect} from "react-redux";

const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;
class RNL extends Component {
  constructor(props) {
    super(props);
    this.state = {template: null, isTem: true, data: [], page: 0, sort: [],
      pageSize: 0, ncon: '', ctel: '', until: '', status: '', total_page: 0
    };
  }

  handleChange(event) {
    const state = {};state[event.target.name] = event.target.value;this.setState(state);
  }

  fetchData = () => {
    if (this.fetchTimer) clearTimeout(this.fetchTimer);
    this.fetchTimer = setTimeout(this._fetchData, 300)
  };

  _fetchData = () => {
    let sorts = [];
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
    let data = {
      page: this.state.page,
      pageSize: this.state.pageSize === 0 ? 10 : this.state.pageSize,
      sorts: sorts,
    };
    this.props.callApi(RestApi.getReservedNumberList, response => {
      if (response.ok) {
        this.setState({
          data: response.data.rows,
          total_page: response.data.totalPages
        })
      }
    }, data);
  };

  getNumberDetail = async (num) => {
    let message = query_number(this.props.somos.id, this.props.somos.ro, fix_num(num));
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': mod, 'message': message, 'timeout': timeout});
    if (res.ok && res.data && res.data.message) {
      let data = new MgiMessage(res.data.message);
      this.setState({
        status: data.value("STAT")[0],
        lact: data.value("LACT")[0],
        ncon: data.value("NCON")[0],
        ctel: data.value("CTEL")[0],
        until: data.value("RU")[0],
      });
    }
  };

  render() {
    const columns = [
      {
        Header: 'Toll Free Number',
        accessor: 'number',
        Cell: props => <div className="text-center">{props.value}</div>
      },
      {
        Header: 'ID',
        accessor: 'sms_id',
        Cell: props => <div className="text-center">{props.value}</div>
      },
      {
        Header: 'RO',
        accessor: 'ro',
        Cell: props => <div className="text-center">{props.value}</div>
      },
    ];
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Reserved Number List</strong></Label>
        <Row className="mt-3">
          <Col xs="12">
            <Card>
              <CardHeader>
                <span style={{fontSize: 20, fontWeight: 'bold'}}>Reserved Number List</span>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Col xs="6">
                    <ReactTable
                      manual
                      data={this.state.data}
                      onFetchData={this.fetchData}
                      columns={columns}
                      defaultPageSize={10}
                      onSortedChange={(sort) => {
                        let sorts = [];
                        sorts.push(sort);
                        this.setState({sort: sorts})
                      }}
                      onPageChange={(page) => {
                        this.setState({page})}
                      }
                      onPageSizeChange={(pageSize) => {this.setState({pageSize: pageSize})}}
                      getTrProps={(state, rowInfo) => {
                        return {onClick: () => {this.getNumberDetail(rowInfo.original.number)}}
                      }}
                      minRows={this.state.data.length && this.state.data.length}
                      pages={this.state.total_page}
                    />
                  </Col>
                  <Col xs="6">
                    <FormGroup row>
                      <Col xs="3"><Label>Contact Person:</Label></Col>
                      <Col xs="9"><Input type="text" value={this.state.ncon}/></Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="3"><Label>Contact Number:</Label></Col>
                      <Col xs="6"><Input type="text" value={this.state.ctel}/></Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="3">
                        <Label>Reserved Until:</Label>
                      </Col>
                      <Col xs="4">
                        <Input type="text" value={this.state.until}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="3">
                        <Label>Status:</Label>
                      </Col>
                      <Col xs="3">
                        <Input type="text" value={this.state.status}/>
                      </Col>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(RNL));
