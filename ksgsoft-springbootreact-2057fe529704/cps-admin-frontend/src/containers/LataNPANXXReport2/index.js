import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Label, Row} from 'reactstrap';
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import withLoadingAndNotification, {withAuthApiLoadingNotification} from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader';
import RestApi from "../../service/RestApi";
import './style.css'
import CardHeader from "reactstrap/es/CardHeader";
import produce from "immer";
import MultiSelectList from "../../components/MultiSelectList";
import ViewLCRModal from './ViewLCRModal'
import DeleteRateModal from './DeleteModal'
import RenameRateModal from './RenameModal'
import {Type} from "../../constants/Notifications";
import CardFooter from "reactstrap/es/CardFooter";
import FormGroup from "reactstrap/es/FormGroup";
import FormFeedback from "reactstrap/es/FormFeedback";

const Header = cardHeader(true, false);

class LCRReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rateNames: [], all: "", reportName: "", isReportName: false,
      chooseRateNames: [], choose: "",
      data: [], page: 0, sort: [], filter: [],
      pageSize: 0, total_page: 0,
      modal: {
        isOpen: false,
        data: [], page: 0, sort: [], filter: [],
        pageSize: 0, total_page: 0, id: null
      },
      deleteModal: {isOpen: false, data: ''},
      renameModal: {isOpen: false, data: ''},
      selectedRate: {}, originalData: [],
    }
  }

  componentDidMount() {
    this.getRateDeck();
  };

  getRateDeck = () => {
    this.props.callApi(RestApi.getRateDeckList, response => {
      if (response.ok) {
        this.setState({originalData: response.data});
        this.setState({rateNames: response.data.map((v) => v.name), chooseRateNames: []});
      }
    })
  };

  add = () => {
    let all = this.state.all;
    if (all === "")
      this.props.showNotification(Type.WARNING, "Please input Rate Deck!");
    let allRateNames = this.state.rateNames;
    let chooseRateNames = this.state.chooseRateNames;
    for (let j = 0; j < allRateNames.length; j++) {
      const index = allRateNames.indexOf(all);
      if (index !== -1) {
        allRateNames.splice(index, 1);
        chooseRateNames.push(all);
      }
    }
    this.setState({rateNames: allRateNames, chooseRateNames, all: "", choose: ""});
    this.setState({renameModal: produce(this.state.renameModal, m => {m.data = ""})});
    this.setState({deleteModal: produce(this.state.deleteModal, m => {m.data = ""})});
  };

  remove = () => {
    let choose = this.state.choose;
    if (choose === "")
      this.props.showNotification(Type.WARNING, "Please input Rate Deck!");
    let rateNames = this.state.rateNames;
    let chooseRateNames = this.state.chooseRateNames;
    for (let j = 0; j < chooseRateNames.length; j++) {
      const index = chooseRateNames.indexOf(choose);
      if (index !== -1) {
        chooseRateNames.splice(index, 1);
        rateNames.push(choose);
      }
    }
    this.setState({rateNames: rateNames, chooseRateNames, all: "", choose: ""})
    this.setState({renameModal: produce(this.state.renameModal, m => {m.data = ""})});
    this.setState({deleteModal: produce(this.state.deleteModal, m => {m.data = ""})});
  };

  rename = () => {
    if (this.state.renameModal.data === "") {
      this.props.showNotification(Type.WARNING, "Please select Rate Deck!");
      return;
    }
    this.setState({
      renameModal: produce(this.state.renameModal, m => {
        m.isOpen = true;
      })
    });
    let originalData = this.state.originalData;
    for (let i = 0; i < originalData.length; i++) {
      if (originalData[i].name === this.state.renameModal.data) {
        this.setState({selectedRate: originalData[i]})
      }
    }
  };

  delete = () => {
    if (this.state.deleteModal.data === "") {
      this.props.showNotification(Type.WARNING, "Please select Rate Deck!");
      return;
    }
    this.setState({
      deleteModal: produce(this.state.deleteModal, m => {
        m.isOpen = true;
      })
    });
    let originalData = this.state.originalData;
    for (let i = 0; i < originalData.length; i++) {
      if (originalData[i].name === this.state.deleteModal.data) {
        this.setState({selectedRate: originalData[i]})
      }
    }
  };

  lcrReport = () => {
    if (this.state.chooseRateNames.length === 0) {
      this.props.showNotification(Type.WARNING, "Please choose carrier for LCR Report");
      return false;
    }
    if (this.state.reportName === "") {
      this.setState({isReportName: true});
      return false;
    }
    this.props.callApi(RestApi.generateLCR, response => {
    }, {rateNames: this.state.chooseRateNames, name: this.state.reportName});
  };

  viewLCR = (id) => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m.isOpen = true;
        m.id = id
      })
    })
  };

  deleteLCR = (id) => {
    if (!window.confirm("Are you sure you want to delete this report?"))
      return;
    this.props.callApi(RestApi.deleteLCR, response => {
      if (response.ok){
        this.fetchData();
      }
    }, id);
  };

  columns = [
    {
      Header: 'Report name',
      accessor: 'name',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Compared Carriers',
      accessor: 'carriers',
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
        <Button size="sm" color="primary" onClick={() => this.viewLCR(props.value)}>View</Button>
        <Button size="sm" color="danger" className="ml-2" onClick={() => this.deleteLCR(props.value)}>Delete</Button>
        <Button size="sm" color="success" className="ml-2" onClick={() => {
          this.downloadForm.action = process.env.REACT_APP_API_ENDPOINT + "cprgen/lcr_report/" + props.value + "/download";
          this.textInput.value = this.props.auth.token;
          this.downloadForm.submit();
          this.textInput.value = "";
        }}>Download</Button>
      </div>
    },
  ];

  LCRcolumns = [
    {
      Header: 'NPANXX',
      accessor: 'npa_nxx',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Min Carrier',
      accessor: 'min_carrier',
      filterable: true,
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Min Rate',
      accessor: 'min_rate',
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
    this.props.callApi(RestApi.searchLCR, response => {
      if (response.ok) {
        this.setState({data: response.data.rows, total_page: response.data.totalPages});
      }
    }, data);
  };

  viewData = () => {
    this.fetchTimer && clearTimeout(this.fetchTimer);
    this.fetchTimer = setTimeout(this._viewData, 500)
  };

  _viewData = () => {
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
    this.props.callApi(RestApi.viewLCR, response => {
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

  render() {
    return (
      <Row>
        <Col lg="12">
          <Card>
            <Header>LCRReport</Header>
            <CardBody>
              <FormGroup row>
                <Col lg="5" className="row">
                  <Col lg="4">
                    <Label className="font-weight-bold">LCR Report Name:</Label>
                  </Col>
                  <Col lg="8">
                    <Input type="text" onChange={(ev)=> {this.setState({reportName: ev.target.value, isReportName: false});
                    }} className="form-control-sm" invalid={this.state.isReportName}/>
                    {this.state.isReportName ? <FormFeedback>Please input report name!</FormFeedback> : ""}
                  </Col>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col lg="5">
                  <Card>
                    <CardHeader>All of Rate List</CardHeader>
                    <CardBody style={{height: 300}}>
                      <MultiSelectList items={this.state.rateNames} selectedItem={this.state.all} toggleSelection={(value) => {
                        this.setState({all: value, choose: ""});
                        this.setState({renameModal: produce(this.state.renameModal, m => {m.data = value})});
                        this.setState({deleteModal: produce(this.state.deleteModal, m => {m.data = value})});
                      }} rowHeight={20}/>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="2" className="text-center">
                  <Button size="sm" color="success" onClick={this.add} style={{width: '70%'}} className="mt-5">ADD &#62;&#62;</Button><br/>
                  <Button size="sm" color="success" onClick={this.remove} style={{width: '70%'}} className="mt-2">&#60;&#60; REMOVE</Button>
                  <Button size="sm" color="success" onClick={this.rename} style={{width: '70%'}} className="mt-2">RENAME</Button>
                  <Button size="sm" color="success" onClick={this.delete} style={{width: '70%'}} className="mt-2">DELETE</Button>
                </Col>
                <Col lg="5">
                  <Card>
                    <CardHeader>Choose Rate List</CardHeader>
                    <CardBody style={{height: 300}}>
                      <MultiSelectList items={this.state.chooseRateNames} selectedItem={this.state.choose} toggleSelection={(value) => {
                        this.setState({choose: value, all: ""});
                        this.setState({renameModal: produce(this.state.renameModal, m => {m.data = value})});
                        this.setState({deleteModal: produce(this.state.deleteModal, m => {m.data = value})});
                      }} rowHeight={20}/>
                    </CardBody>
                  </Card>
                </Col>
              </FormGroup>
            </CardBody>
            <CardFooter>
              <Button size="md" color="primary" onClick={this.lcrReport}>LCR Report</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Row>
                <Col><strong className="card-title-big">LCR Report List</strong></Col>
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
        <ViewLCRModal
          isOpen={this.state.modal.isOpen}
          toggle={this.toggleModal}
          columns={this.LCRcolumns}
          data={this.state.modal.data}
          fetchData={this.viewData}
          total_page={this.state.modal.total_page}
          handler={this.handleUpdate}
        />
        <RenameRateModal
          isOpen={this.state.renameModal.isOpen}
          data={this.state.renameModal.data}
          toggle={this.toggleRenameModal}
          handler={this.handleRename}
          rename={this.updateRename}
        />
        <DeleteRateModal
          isOpen={this.state.deleteModal.isOpen}
          data={this.state.deleteModal.data}
          toggle={this.toggleDeleteModal}
          handler={this.handleDelete}
          delete={this.updateDelete}
        />
        <form ref={(node)=> {this.downloadForm = node}} action="" target="_blank" method="post">
          <input type="hidden" ref={(input)=> {this.textInput = input}} name="access_token" value=""/>
        </form>
      </Row>
    );
  }

  updateRename = () => {
    if (this.state.renameModal.data === this.state.selectedRate.name) {
      this.props.showNotification(Type.WARNING, "Rate Deck name was not changed!");
      return false;
    }
    let data = new FormData();
    data.append("newName", this.state.renameModal.data);
    this.props.callApi(RestApi.renameRateDeck, response => {
      if (response.ok) {
        this.setState({
          renameModal: produce(this.state.renameModal, m => {
            m.isOpen = false;
          })
        });
        this.setState({
          rateNames:this.state.rateNames.map((rate) => {
            if (rate === this.state.selectedRate.name) return this.state.renameModal.data;
            else return rate;
          }),
          chooseRateNames: this.state.chooseRateNames.map((rate) => {
            if (rate === this.state.selectedRate.name) return this.state.renameModal.data;
            else return rate;
          })
        });
      }
    }, this.state.selectedRate.id, data)
  };

  updateDelete = () => {
    this.props.callApi(RestApi.deleteRateDeck, response => {
      if (response.ok) {
        this.setState({deleteModal: produce(this.state.deleteModal, m => {m.isOpen = false;})});
        this.setState({
          rateNames:this.state.rateNames.filter((item) => {
            return item !== this.state.selectedRate.name
          }),
          chooseRateNames:this.state.chooseRateNames.filter((item) => {
            return item !== this.state.selectedRate.name
          }),
        });
      }
    }, this.state.selectedRate.id)
  };

  toggleModal = () => {
    const modal = produce(this.state.modal, m => {
      m.isOpen = !m.isOpen;
    });
    this.setState({modal});

  };

  toggleRenameModal = () => {
    const renameModal = produce(this.state.renameModal, m => {
      m.isOpen = !m.isOpen;
    });
    this.setState({renameModal});
  };

  toggleDeleteModal = () => {
    const deleteModal = produce(this.state.deleteModal, m => {
      m.isOpen = !m.isOpen;
    });
    this.setState({deleteModal});
  };

  handleUpdate = (type, value) => {
    this.setState({
      modal: produce(this.state.modal, m => {
        m[type] = value
      })
    })
  };

  handleRename = (value) => {
    this.setState({
      renameModal: produce(this.state.renameModal, m => {
        m.data = value
      })
    });

  };

  handleDelete = (value) => {
    this.setState({
      deleteModal: produce(this.state.deleteModal, m => {
        m.data = value
      })
    })
  }
}

export default withAuthApiLoadingNotification(LCRReport);
