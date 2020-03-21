import React, {Component} from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader';
import RestApi from "../../service/RestApi";
const Header = cardHeader(true, false);
class ViewRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], page: 0, sort: [], filter: [],
      pageSize: 0, total_page: 0, carriers: [], rateNames:[]
    }
  }

  componentDidMount() {
    this.props.callApi(RestApi.getRateDeckList, response => {
      console.log(response);
      if (response.ok) {
        let carriers = [];
        for (let i = 0; i< response.data.length; i++) {
          if (carriers.indexOf(response.data[i].carrier)===-1) {
            carriers.push(response.data[i].carrier);
          }
        }
        this.setState({carriers, rateNames: response.data.map((v)=> v.name)})
      }
    })
  }

  columns = [
    {
      Header: 'NPANXX',
      accessor: 'npa_nxx',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Rate Name',
      accessor: 'name',
      Cell: props => <div className="text-center">{props.value}</div>,
      filterable: true,
      filterMethod: (filter, row) => {
        return row[filter.id] === filter.value;
      },
      Filter: ({filter, onChange}) => {
        return <select
          onChange={event => onChange(event.target.value)}
          style={{width: "100%"}}
          value={filter ? filter.value : "all"} className="form-control-sm"
        >
          <option value="all">All</option>
          {this.state.rateNames.map((value) => {
            return <option value={value}>
              {value}
            </option>
          })}
        </select>
      }
    },
    {
      Header: 'Carrier Name',
      accessor: 'carrier',
      filterable: true,
      width: 100,
      Cell: props => <div className="text-center">{props.value}</div>,
      filterMethod: (filter, row) => {
        return row[filter.id] === filter.value;
      },
      Filter: ({filter, onChange}) => {
        return <select
          onChange={event => onChange(event.target.value)}
          style={{width: "100%"}}
          value={filter ? filter.value : "all"} className="form-control-sm"
        >
          <option value="all">All</option>
          {this.state.carriers.map((value) => {
            return <option value={value}>
              {value}
            </option>
          })}
        </select>
      }
    },
    {
      Header: 'Interstate Rate',
      accessor: 'inter_rate',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Intrastate Rate',
      accessor: 'intra_rate',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Effective Date',
      accessor: 'eff_date',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'LATA',
      accessor: 'lata',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'OCN',
      accessor: 'ocn',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Init Duration',
      accessor: 'init_duration',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Increment Duration',
      accessor: 'increment_duration',
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
        if (filtered[i].id === "carrier" || filtered[i].id === "name") {
          if (filtered[i].value === "all") {
            filter = {};
          } else {
            filter = {
              "column": filtered[i].id,
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
    this.props.callApi(RestApi.searchRate, response => {
      console.log(response.data.rows);
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
            <Header>View Rate Decks</Header>
            <CardBody>
              <ReactTable
                manual
                data={this.state.data}
                columns={this.columns}
                defaultPageSize={10}
                onFilteredChange={(filter) => {
                  console.log(filter);
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

export default withLoadingAndNotification(ViewRate);
