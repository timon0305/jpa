import React, {Component} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
} from 'reactstrap';
import ReactTable from 'react-table';
import produce from 'immer';

import '../../scss/react-table.css'
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import IdAndRoEditModal from './IdAndRoEditModal';
import mutate from "immer/dist/immer";
import RestApi from "../../service/RestApi";

class IdAndRo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idAndRos: [],
      modal: {
        isOpen: false,
        idAndRo: {
          somos_id: "",
          ro: "",
          id: 0,
        }
      }
    };

    this.originalState = {...this.state}
  }

  fetchData = (state) => {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    this.fetchTimer = setTimeout(this._fetchData, 500, state)
  };

  _fetchData = (state) => {
    let sorts = [];
    if (state.sorted.length) {
      let column = state.sorted[0].id;
      let direction = state.sorted[0].desc;
      if (direction === false)
        direction = "asc";
      else if (direction === true)
        direction = "desc";
      let sort = {
        "column": column,
        "direction": direction
      };
      sorts.push(sort)
    }
    let filters = [];
    if (state.filtered.length) {
      let column = state.filtered[0].id;
      let contain = state.filtered[0].value;
      let filter = {
        "column": column,
        "contains": contain,
      };
      filters.push(filter);
    }
    let data = {
      page: state.page,
      pageSize: state.pageSize,
      sorts: sorts,
      filters: filters
    };

    this.props.callApi(RestApi.getAllIdRo, response => {
      if (response.ok) {
        this.setState({idAndRos: response.data.rows})
      }
    }, data);
  };

  editIdAndRo = (id) => {
    let data = this.state.idAndRos;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        this.setState({
          modal: produce(this.state.modal, m => {
            m.idAndRo.somos_id = data[i].somos_id;
            m.idAndRo.ro = data[i].ro;
            m.idAndRo.id = id;
            m.isOpen = true
          })
        });
        this.originalState.modal.idAndRo.somos_id = data[i].somos_id ? data[i].somos_id : "";
        this.originalState.modal.idAndRo.ro = data[i].ro ? data[i].ro: "";
      }
    }
  };

  deleteIdAndRo = (id) => {
    const result = window.confirm("Are you sure to delete Id and Ro?");
    if (result) {
      this.props.callApi(RestApi.deleteIdRo, response => {
        if (response.ok) {
          window.location.reload()
        }
      }, id)
    }
  };

  columns = [
    {
      Header: 'Username',
      accessor: 'username',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'ID',
      accessor: 'somos_id',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'RO',
      accessor: 'ro',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },

    {
      Header: 'Created By',
      accessor: 'created_by',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Updated By',
      accessor: 'updated_by',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Updated At',
      accessor: 'updated_at',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: (row) => {
        let id = row.row.id;
        return <div className="text-center">
          <a color="link" className="mr-2" onClick={() => this.editIdAndRo(id)}><i className="fa fa-edit"/></a>
          <a color="link" onClick={() => this.deleteIdAndRo(id)}><i className="fa fa-trash"/></a>
        </div>
      }
    }
  ];

  updateIdAndRo = (id) => {
    this.props.callApi(RestApi.updateUserIdRo, response => {
      if (response.ok) {
        window.location.reload()
      }
    }, {id, req: {id: this.state.modal.idAndRo.somos_id, ro: this.state.modal.idAndRo.ro}});
  };

  resetIdAndRo = () => {
    this.setState({modal: produce(this.state.modal, m=> {
        m.idAndRo = {...this.originalState.modal.idAndRo}
      })
    })
  };

  toggleModal = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.isOpen = !m.isOpen
      })
    });
  };

  handleChange = (value) => {
    this.setState({
      modal: mutate(this.state.modal, data => {
        data.idAndRo = {...data.idAndRo, ...value};
      })
    });
  };

  refresh = () => {
    window.location.reload()
  };

  render() {

    return (
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <Row>
                <Col xs="6"><strong className="card-title-big">Id and Ro Management </strong></Col>
                <Col xs="6">
                  <div className="text-right">
                    <Button size="md" color="link" onClick={this.refresh}><i className="fa fa-refresh"/> Refresh</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <ReactTable data={this.state.idAndRos} onFetchData={this.fetchData} columns={this.columns} defaultPageSize={10} minRows="1" className="-striped -highlight"/>
            </CardBody>
          </Card>
        </Col>
        <IdAndRoEditModal updateHandler={this.updateIdAndRo} resetHandler={this.resetIdAndRo} idAndRo={this.state.modal.idAndRo} isOpen={this.state.modal.isOpen}
                          toggle={this.toggleModal} handleChange={this.handleChange}/>
      </Row>
    );
  }
}

export default withLoadingAndNotification(IdAndRo);
