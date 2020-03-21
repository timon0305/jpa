import React from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import ReactTable from "react-table";
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import '../../scss/react-table.css'
import RoleEditModal from "./RoleEditModal";
import produce from 'immer';
import API from "../../service/RestApi";
import {connect} from 'react-redux';
import {refreshRolesSuccess} from "../../redux/AuthRedux";

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      modal: {
        isOpen: false,
        role: {privileges: [], id: 0, name: '', description: ''},
        isEditable: true,
      }
    };
    this.originalState = {...this.state};
  }

  defaultRole = {
    privileges: [], id: 0, name: '', description: ''
  };
  componentDidMount() {
    this.props.callApi(API.getRoles, (response) => {
      if (response.ok) {
        this.setState({roles: response.data});
      }
    })
  };

  columns = [
    {
      Header: 'Role Name',
      accessor: 'name',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: (row) => {
        let id = row.row.id;
        return <div className="text-center">
          <a color="link" className="mr-2" onClick={() => this.viewRoleModal(id)}><i className="fa fa-search"/></a>
          <a color="link" className="mr-2" onClick={() => this.editRoleModal(id)}><i className="fa fa-edit"/></a>
          <a color="link" onClick={() => this.deleteRole(id)}><i className="fa fa-trash"/></a>
        </div>
      }
    },
  ];

  viewRoleModal = (id) => {
    this.props.callApi(API.getRoleDetails, (response) => {
      if (response.ok) {
        this.setState({modal: {role: response.data, isEditable: false, isOpen: true}});
      }
    }, id)
  };

  editRoleModal = (id) => {
    this.props.callApi(API.getRoleDetails, (response) => {
      if (response.ok) {
        this.setState({modal: {role: response.data, isEditable: true, isOpen: true}});
        this.originalState.modal.role = {...response.data}
      }
    }, id)
  };

  deleteRole = (id) => {
    const result = window.confirm("Are you sure you want to delete this role?");
    if (result) {
      this.props.callApi(API.deleteRole, response => {
        if (response.ok) {
          this.props.callApi(API.getRoles, (response) => {
            if (response.ok) {
              this.setState({roles: response.data});
            }
          })
        }
      }, id)
    }
  };

  openNewRoleModal = () => {
    const modal = {
      isOpen: true,
      role: {privileges: [], id: '', name: '', description: ''},
      isEditable: true
    };
    this.setState({modal});
    this.originalState = {...modal.role}
  };

  refreshRoles = () => {
    window.location.reload();
  };

  toggleModal = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.isOpen = !m.isOpen
      })
    });
  };

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <Row>
                <Col xs="6">
                  <strong className="card-title-big">Roles</strong>
                </Col>
                <Col xs="6">
                  <div className="text-right">
                    <Button size="md" color="link" onClick={this.openNewRoleModal}><i className="fa fa-plus"/> Add New
                      Role</Button>
                    <Button size="md" color="link" onClick={this.refreshRoles}><i className="fa fa-refresh"/> Refresh</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            {/*Roles Table*/}
            <CardBody>
              <ReactTable data={this.state.roles} columns={this.columns} defaultPageSize={10} minRows={this.state.roles.length} className="-striped -highlight"/>
            </CardBody>
          </Card>
        </Col>
        {/*Role Edit Modal*/}
        <RoleEditModal updateHandler={this.updateRole}
                       role={this.state.modal.role}
                       isOpen={this.state.modal.isOpen}
                       toggle={this.toggleModal}
                       resetHandler={this.resetRole}
                       handleRoleUpdate={this.handleUpdateRole}
                       isEditable={this.state.modal.isEditable}
        />
      </Row>
    )
  }

  handleUpdateRole = (role) => {
    const modal = produce(this.state.modal, m => {
      m.role = role;
    });
    this.setState({modal});
  };

  resetRole = () => {
    this.setState({modal: produce(this.state.modal, m => {
      m.role = {...this.originalState.modal.role}
      })})
  };

  updateRole = (id) => {
    this.toggleModal();
    if (id) {
      this.props.callApi(API.updateRole, (response) => {
        if (response.ok) {
          this.props.callApi(API.getRoles, (response) => {
            if (response.ok) {
              this.setState({roles: response.data});
              this.originalState.modal.role = {...response.data};
              let roles = [];
              let data = response.data;
              for (let i = 0; i < data.length; i++) {
                roles.push({
                  "id": data[i].id,
                  "name": data[i].name
                })
              }
              this.props.updateRoles(roles);
            }
          })
        }
      }, {id, req: this.state.modal.role})
    } else {
      this.props.callApi(API.createRole, (response) => {
        if (response.ok) {
          this.props.callApi(API.getRoles, (response) => {
            if (response.ok) {
              this.setState({roles: response.data});
              let roles = [];
              let data = response.data;
              for (let i = 0; i < data.length; i++) {
                roles.push({
                  "id": data[i].id,
                  "name": data[i].name
                })
              }
              this.props.updateRoles(roles);
            }
          })
        }
      }, this.state.modal.role)
    }

  };

}

export default connect(
  state => ({roles: state.auth.profile.roles}),
  dispatch => ({updateRoles: (roles) => dispatch(refreshRolesSuccess(roles))})
)(withLoadingAndNotification(Roles));
