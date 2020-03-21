import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Row} from 'reactstrap';
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader';
import RestApi from "../../service/RestApi";

const Header = cardHeader(true, false);
class ViewCDR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], page: 0, sort: [], filter: [],
      pageSize: 0, total_page: 0
    }
  }

  columns = [
    {
      Header: 'Row ANI',
      accessor: 'row_ani',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Cost',
      accessor: 'cost',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Duration',
      accessor: 'duration',
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
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Lrn',
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
      page: this.state.page,
      pageSize: this.state.pageSize === 0 ? 10 : this.state.pageSize,
      sorts: sorts,
      filters: filters
    };
    this.props.callApi(RestApi.searchCDR, response => {
      if (response.ok) {
        this.setState({data: response.data.rows, total_page: response.data.totalPages});
      }
    }, data);
  };

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <Header>View CDR</Header>
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
                onPageChange={(page) => {
                  this.setState({page})}
                }
                onPageSizeChange={(pageSize) => {this.setState({pageSize: pageSize})}}
                minRows={this.state.data.length && this.state.data.length}
                pages={this.state.total_page}
                onFetchData={this.fetchData}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default withLoadingAndNotification(ViewCDR);
