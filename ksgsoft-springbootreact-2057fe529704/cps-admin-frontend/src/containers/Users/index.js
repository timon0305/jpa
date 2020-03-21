import React, {Component, Fragment} from 'react'
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {Badge, Button, Card, Col, Row} from 'reactstrap'
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import ReactTable from 'react-table';
import '../../scss/react-table.css'
import EditUserModal from "./EditUserModal";
import produce from 'immer';
import RestApi from "../../service/RestApi";
import {connect} from "react-redux";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      modal: {
        isOpen: false,
        isEditable: false,
        disabled: false,
        hasFooter: false,
        user: {
          main: {},
          ips: [],
          additional: {},
          password: {},
          id: 0
        }
      },
      page: 0, sort: [], filter: [],
      pageSize: 0, total_page: 0
    };
    this.originalState = {...this.state}
  }

  emptyUser = {
    id: 0,
    main: {},
    additional: {},
    password: {},
    ips: [],
  };

  columns = [
    {
      Header: 'Username',
      filterable: true,
      accessor: 'username',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Role',
      filterable: true,
      accessor: 'role',
      width: 150,
      Cell: props => <div className="text-center">{props.value}</div>,
      filterMethod: (filter, row) => {
        return row[filter.id] === filter.value;
      },
      Filter: ({filter, onChange}) => {
        let roles = this.props.roles;
        for (let i = 0; i< roles.length; i++) {
          let obj = roles[i];
          if (obj.name === "ROLE_SUPER_ADMIN"){
            roles.splice(i, 1);
          }
        }
        return <select
          onChange={event => onChange(event.target.value)}
          style={{width: "100%"}}
          value={filter ? filter.value : "all"} className="form-control-sm"
        >
          <option value="all">ALL</option>
          {roles.map(({id, name}) => {
            return <option value={id}>
              {name}
            </option>
          })}
        </select>
      }
    },
    {
      Header: 'First Name',
      accessor: 'first_name',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Last Name',
      accessor: 'last_name',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: props => <div className="text-center">{props.value}</div>,
      width: 200
    },
    {
      Header: 'Status',
      accessor: 'is_active',
      Cell: (row) => {
        return <div className="text-center">
          {row.row.is_active ? <Badge className="mr-1" color="success">Active</Badge> :
            <Badge className="mr-1" color="secondary">Inactive</Badge>
          }
        </div>
      }
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: props => <div className="text-center">{props.value}</div>,
      width: 200
    },
    {
      Header: 'Updated At',
      accessor: 'updated_at',
      Cell: props => <div className="text-center">{props.value}</div>,
      width: 200
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
      Header: 'Action',
      accessor: 'id',
      Cell: (row) => {
        let id = row.row.id;
        let active = row.row.is_active;
        return <div className="text-center">
          <span color="link" className="mr-2" onClick={() => this.activeUser(id)}><i className={active ? "fa fa-eye" : "fa fa-eye-slash"}/></span>
          <span color="link" className="mr-2" onClick={() => this.viewUser(id)}><i className="fa fa-search"/></span>
          <span color="link" className="mr-2" onClick={() => this.editUser(id)}><i className="fa fa-edit"/></span>
          <span color="link" onClick={() => this.deleteUser(id)}><i className="fa fa-trash"/></span>
        </div>
      }
    },
  ];

  activeUser = (id) => {
    let users = this.state.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        let active = users[i].is_active;
        if (active) {
          this.props.callApi(RestApi.deactivateUser, response => {
            if (response.ok) {
              window.location.reload()
            }
          }, id);
        } else {
          this.props.callApi(RestApi.activateUser, response => {
            if (response.ok) {
              window.location.reload()
            }
          }, id);
        }
      }
    }
  };

  viewUser = (id) => {
    this.props.callApi(RestApi.getUserDetailByID, response => {
      if (response.ok) {
        this.setState({
          modal: produce(this.state.modal, m => {
            m.disabled = true;
            m.isOpen = true;
            m.isEditable = false;
            m.user = response.data;
            m.id = id
          })
        })
      }
    }, id);

  };

  editUser = (id) => {
    this.props.callApi(RestApi.getUserDetailByID, response => {
      if (response.ok) {
        this.setState({
          modal: produce(this.state.modal, m => {
            m.disabled = false;
            m.isOpen = true;
            m.isEditable = true;
            m.user = response.data;
            m.hasFooter = true;
            m.id = id
          })
        });
        this.originalState.modal.user = {...response.data};
      }
    }, id);
  };

  deleteUser = (id) => {
    let confirm = window.confirm("Are you sure to delete user?");
    if (confirm) {
      this.props.callApi(RestApi.deleteUserByID, response => {
        if (response.ok) {
          window.location.reload();
        }
      }, id);
    }
  };

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
    this.props.callApi(RestApi.getUsers, response => {
      if (response.ok) {
        this.setState({users: response.data.rows, total_page: response.data.totalPages});
      }
    }, data);
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col><strong className="card-title-big">User Management</strong></Col>
                  <Col>
                    <div className="text-right">
                      <Button size="md" color="link" onClick={this.handleAddUser}><i className="fa fa-plus"/> Add New User</Button>
                      <Button size="md" color="link" onClick={this.handleRefresh}><i className="fa fa-refresh"/> Refresh</Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <ReactTable
                  manual
                  data={this.state.users}
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
                  minRows={this.state.users.length && this.state.users.length}
                  pages={this.state.total_page}
                  onFetchData={this.fetchData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/*Modal*/}
        <EditUserModal
          isOpen={this.state.modal.isOpen}
          user={this.state.modal.user}
          isEditable={this.state.modal.isEditable}
          resetHandler={this.resetUser}
          updateHandler={this.updateUser}
          handleChange={this.handleChange}
          handleRoleChange={this.handleRoleChange}
          toggle={this.toggleModal}
          addIp={this.addIp} removeIp={this.removeIp}
          disabled={this.state.modal.disabled}
          hasFooter={this.state.modal.hasFooter}
          updateMainHandler={this.updateMainHandler}
          updateIpsHandler={this.updateIpsHandler}
          updateAdditionalHandler={this.updateAdditionalHandler}
          updatePasswordHandler={this.updatePasswordHandler}
          resetMainHandler={this.resetMainHandler}
          resetIpsHandler={this.resetIpsHandler}
          resetAdditionalHandler={this.resetAdditionalHandler}
          resetPasswordHandler={this.resetPasswordHandler}
        />
      </Fragment>
    )
  }

  updateMainHandler = () => {
    this.props.callApi(RestApi.updateUserMainInformation, res => {
      if (res.ok) {

      }
    }, this.state.modal.id, this.state.modal.user.main);
  };

  updateIpsHandler = () => {
    this.props.callApi(RestApi.updateUserIpInformation, res => {
      if (res.ok) {

      }
    }, this.state.modal.id, this.state.modal.user.ips);
  };

  updateAdditionalHandler = () => {
    this.props.callApi(RestApi.updateUserAdditionalInformation, res => {
      if (res.ok) {

      }
    }, this.state.modal.id, this.state.modal.user.additional);
  };

  updatePasswordHandler = () => {
    // Validation Password
    if (this.state.modal.user.password.new === undefined || this.state.modal.user.password.new === "") {
      this.setState({
        modal: produce(this.state.modal, m => {
          m.user.password.newError = "Please input New Password!"
        })
      });
      return false;
    }
    if (this.state.modal.user.password.confirm === undefined || this.state.modal.user.password.confirm === "") {
      this.setState({
        modal: produce(this.state.modal, m => {
          m.user.password.confirmError = "Please input Confirm Password!";
        })
      });
      return false;
    }
    if (this.state.modal.user.password.new !== this.state.modal.user.password.confirm) {
      this.setState({
        modal: produce(this.state.modal, m => {
          m.user.password.confirmError = "Please does not match!";
        })
      });
      return false;
    }
    let req = {newPassword: this.state.modal.user.password.new};
    this.props.callApi(RestApi.updateUserPassword, (response) => {
      if (response.ok) {
        this.resetPasswordHandler();
      }
    }, this.state.modal.id, req);
  };

  resetMainHandler = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.main = {...this.originalState.modal.user.main};
      })
    });
  };

  resetIpsHandler = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.ips = this.originalState.modal.user.ips;
      })
    });
  };

  resetAdditionalHandler = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.additional = {...this.originalState.modal.user.additional};
      })
    });
  };

  resetPasswordHandler = () => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.password.new = "";
        m.user.password.confirm = "";
      })
    });
  };

  addIp = (ip) => {
    const ips = produce(this.state.modal.user.ips, ips => {
      ips.push(ip);
    });
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.ips = ips;
      })
    });
  };

  removeIp = (ip) => {
    const ips = produce(this.state.modal.user.ips, ips => {
      const index = ips.indexOf(ip);
      index !== -1 && ips.splice(index, 1);
    });
    this.setState({
      modal: produce(this.state.modal, m => {
        m.user.ips = ips;
      })
    });
  };

  handleChange = ({main, ips, password, additional}) => {
    this.setState({
      modal: produce(this.state.modal, m => {
        if (main) {
          m.user.main = {...m.user.main, ...main}
        }
        if (ips) {
          m.user.ips = ips.slice(0)
        }
        if (additional) {
          m.user.additional = {...m.user.additional, ...additional}
        }
        if (password) {
          m.user.password = {...m.user.password, ...password}
        }
      })
    });
  };

  handleRoleChange = (evt) => {
    let role = evt.target.value.split(" ");
    this.setState({modal: produce(this.state.modal, m=> {
        m.user.main.roleId = role[0];
        m.user.main.role = role[1];
      })
    })
  };

  resetUser = () => {
    this.setState({
      modal: {user: this.emptyUser}
    })
  };

  updateUser = (id) => {
    let user = this.state.modal.user;
    if (!user.main.username) {this.setState({modal: produce(this.state.modal, m=> {m.user.main.usernameError = "Please input username!"})}); return false;}
    if (!user.main.email) {this.setState({modal: produce(this.state.modal, m=> {m.user.main.emailError = "Please input email!"})}); return false;}
    if (!user.main.firstName) {this.setState({modal: produce(this.state.modal, m=> {m.user.main.firstNameError = "Please input first name!"})}); return false;}
    if (!user.main.lastName) {this.setState({modal: produce(this.state.modal, m=> {m.user.main.lastNameError = "Please input last name!"})}); return false;}
    if (!user.password.new) {this.setState({modal: produce(this.state.modal, m=> {m.user.password.newError = "Please input new password!"})}); return false;}
    if (!user.password.confirm) {this.setState({modal: produce(this.state.modal, m=> {m.user.password.confirmError = "Please input confirm password!"})}); return false;}
    if (id === 0) {
      this.props.callApi(RestApi.createUser, response => {
        if (response.ok) {
          this.setState({modal: produce(this.state.modal, m => {
              m.isOpen = false;
            })
          });
          this.fetchData();
        }
      }, {
        username: user.main.username, role: user.main.roleId ? user.main.roleId : this.props.roles[0].id, email: user.main.email,
        firstName: user.main.firstName, lastName: user.main.lastName, password: user.password.new, country: user.additional.country,
        address: user.additional.address, province: user.additional.province, city: user.additional.city, zipcode: user.additional.zipcode,
        tel1: user.additional.tel1, tel2: user.additional.tel2, mobile: user.additional.mobile, fax: user.additional.fax, ips: user.ips
      })
    }
  };

  handleAddUser = () => {
    const modal = {
      user: this.emptyUser,
      isOpen: true,
      isEditable: true
    };
    this.setState({modal})
  };

  handleRefresh = () => {
    this.fetchData();
  };

  toggleModal = () => {
    const modal = produce(this.state.modal, m => {
      m.isOpen = !m.isOpen;
    });
    this.setState({modal});
    this.fetchData();
  };
}

export default connect(state => ({roles: state.auth.profile.roles}))(withLoadingAndNotification(Users))
