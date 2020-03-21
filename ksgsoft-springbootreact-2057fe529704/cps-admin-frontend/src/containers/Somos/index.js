import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Button, Badge} from 'reactstrap';

import produce from 'immer';
import mutate from 'immer';
import ReactTable from 'react-table';
import '../../scss/react-table.css'
import SmsEditModal from './SmsEditModal';
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import RestApi from "../../service/RestApi";
import CardFooter from "reactstrap/es/CardFooter";

class Somos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      somoses: [],
      modal: {isOpen: false,
        sms: {id: 0, remoteAddr: "", srcNodeName: "", destNodeName:"", port: "", active: false}
      },
      isEditable: true,
    };
  }

  componentDidMount() {
    this.props.callApi(RestApi.getSomosConnections, (response) => {
      if (response.ok) {
        this.setState({ somoses: response.data});
      }
    })
  }

  openNewSmsModal = () => {
    this.setState({isEditable: true,
      modal: produce(this.state.modal, m => {
        m.isOpen = true;m.sms.id = 0; m.sms.remoteAddr = ''; m.sms.srcNodeName = "";
        m.sms.destNodeName = ""; m.sms.port = ""; m.sms.active = false
      })
    });

  };

  activeSms = (id) => {
    let data = this.state.somoses;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        let active = data[i].active;
        if (active) {
          this.props.callApi(RestApi.deactivateSMSConnection, response => {
            if (response.ok) {
              this.props.callApi(RestApi.getSomosConnections, (response) => {
                if (response.ok) {
                  this.setState({ somoses: response.data});
                }
              })
            }
          }, id);
        } else {
          this.props.callApi(RestApi.activateSMSConnection, response => {
            if (response.ok) {
              this.props.callApi(RestApi.getSomosConnections, (response) => {
                if (response.ok) {
                  this.setState({ somoses: response.data});
                }
              })            }
          }, id);
        }
      }
    }
  };

  viewSms = (id) => {
    let data = this.state.somoses;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        this.setState({modal: produce(this.state.modal, m => {
          m.sms.id = data[i].id; m.sms.remoteAddr= data[i].remoteAddr;
          m.sms.srcNodeName = data[i].srcNodeName; m.sms.destNodeName = data[i].destNodeName;
          m.sms.active = data[i].active; m.sms.port = data[i].port;m.isOpen = true
        })});
      }
    }
    this.setState({isEditable: false});
    //this.toggleModal();
  };

  editSms = (id) => {
    let data = this.state.somoses;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        this.setState({modal: produce(this.state.modal, m => {
            m.sms.id = data[i].id; m.sms.remoteAddr= data[i].remoteAddr;
            m.sms.srcNodeName = data[i].srcNodeName; m.sms.destNodeName = data[i].destNodeName;
            m.sms.active = data[i].active; m.sms.port = data[i].port;m.isOpen = true
          })});
        this.originalSms = {...data[i]};
        break;
      }
    }
    this.setState({isEditable: true});
  };

  deleteSms = (id) => {
    const result = window.confirm("Are you sure you want to delete this SMS Connection?");
    if (result) {
     this.props.callApi(RestApi.deleteSMSConnection, (response) => {
       if (response.ok) {
         this.props.callApi(RestApi.getSomosConnections, response => {
           if (response.ok) {
             this.setState({somoses: response.data});
           }
         })
       }
     }, id)
    }
  };

  columns = [
    {
      Header: 'Server Address',
      accessor: 'remoteAddr',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Port',
      accessor: 'port',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Source',
      accessor: 'srcNodeName',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Destination',
      accessor: 'destNodeName',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Status',
      accessor: 'active',
      Cell: (row) => {
        return <div className="text-center">
          {row.row.active ? <Badge className="mr-1" color="success">Active</Badge> :
            <Badge className="mr-1" color="secondary">Inactive</Badge>
          }
        </div>
      }
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: (row) => {
        let id = row.row.id;
        let active = row.row.active;
        return <div className="text-center">
          <a color="link" className="mr-2" onClick={() => this.activeSms(id)}><i className={active ? "fa fa-eye" : "fa fa-eye-slash"}/></a>
          <a color="link" className="mr-2" onClick={() => this.viewSms(id)}><i className="fa fa-search"/></a>
          <a color="link" className="mr-2" onClick={() => this.editSms(id)}><i className="fa fa-edit"/></a>
          <a color="link" onClick={() => this.deleteSms(id)}><i className="fa fa-trash"/></a>
        </div>
      }
    },
  ];

  updateSMS = (id) => {
    if (id === 0) {
      this.props.callApi(RestApi.createSMSConnection, (response) => {
        if (response.ok) {
          this.toggleModal();
          this.props.callApi(RestApi.getSomosConnections, (response) => {
            if (response.ok) {
              this.setState({somoses: response.data});
            }
          })
        }
      }, this.state.modal.sms)
    } else {
      this.props.callApi(RestApi.updateSMSConnection, (response) => {
        if (response.ok) {
          this.toggleModal();
          this.props.callApi(RestApi.getSomosConnections, (response) => {
            if (response.ok) {
              this.setState({somoses: response.data});
            }
          })
        }
      }, id, this.state.modal.sms)
    }

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
        data.sms = {...data.sms, ...value};
      })
    });
  };

  resetForm = (value) => {
    this.setState({
      modal: mutate(this.state.modal, m => {
        m.sms = {...this.originalSms};
      })
    });
  };

  refresh = () => {
    window.location.reload();
  };

  restartSMSConnection = ()=> {
    this.props.callApi(RestApi.startSMSConncetions, response => {})
  };

  stopSMSConnection = () => {
    this.props.callApi(RestApi.stopSMSConncetions, response => {})
  };

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <Row>
                <Col xs="6">
                  <strong className="card-title-big">SMS Connection</strong>
                </Col>
                <Col xs="6">
                  <div className="text-right">
                    <Button size="md" color="link" onClick={this.openNewSmsModal}><i className="fa fa-plus"/> Add New SMS Connection</Button>
                    <Button size="md" color="link" onClick={this.refresh}><i className="fa fa-refresh"/> Refresh</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <ReactTable data={this.state.somoses} columns={this.columns} defaultPageSize={10} minRows="1" className="-striped -highlight"/>
            </CardBody>
            <CardFooter>
              <Button size="md" color="primary" onClick={this.restartSMSConnection}>Restart SMS Connection</Button>
              <Button size="md" color="danger" onClick={this.stopSMSConnection} className="ml-4">Stop SMS Connection</Button>
            </CardFooter>
          </Card>
        </Col>
        <SmsEditModal
          isEditable={this.state.isEditable}
          updateHandler={this.updateSMS}
          sms={this.state.modal.sms}
          isOpen={this.state.modal.isOpen}
          toggle={this.toggleModal}
          handleChange={this.handleChange}
          resetForm={this.resetForm}
        />
      </Row>
    );
  }
}

export default withLoadingAndNotification(Somos);
