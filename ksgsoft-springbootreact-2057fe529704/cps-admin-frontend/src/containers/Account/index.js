import React from 'react'
import {withAuthApiLoadingNotification} from "../../components/HOC/withLoadingAndNotification";
import {Col, Row} from "reactstrap";
import MainInfo from "./MainInfo";
import ChangePassword from "./ChangePassword";
import Additional from "./Additional";
import EditIP from "./EditIP";
import API from '../../service/RestApi'
import produce from 'immer'
import {profileUpdated} from "../../redux/AuthRedux";
import {connect} from "react-redux";

const defaultPassword = {old: '', new: '', confirm: '', oldError: '', newError: '', confirmError: ''};

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main: {},
      additional: {},
      ips: [],
      password: {}
    };
    this.originalState = {...this.state};
  }

  componentDidMount() {
    const callApi = this.props.callApi;
    callApi(API.getProfile, this.showProfileData);
  }

  render() {
    return (
      <Row>
        <Col lg="6">
          <MainInfo data={this.state.main} isCollapsible hasFooter handleChange={this.handleChange('main')} resetHandler={this.resetMainForm} updateHandler={this.updateMainForm}/>
          <EditIP data={this.state.ips} isCollapsible hasFooter addIp={this.addIp} removeIp={this.removeIp} resetHandler={this.resetIPForm} updateHandler={this.updateIPForm}/>
        </Col>
        <Col lg="6">
          <ChangePassword data={this.state.password} isCollapsible hasFooter handleChange={this.handleChange('password')} resetHandler={this.resetPassword}
                          updateHandler={this.updatePassword} showOldPassword/>
          <Additional data={this.state.additional} isCollapsible hasFooter handleChange={this.handleChange('additional')} resetHandler={this.resetAddForm}
                      updateHandler={this.updateAddForm}/>
        </Col>
      </Row>)
  }

  showProfileData = (response) => {
    console.log(response);
    if (!response.ok) {
      return;
    }
    const {main, additional, ips} = response.data;
    this.setState({main: main, additional: additional, ips: ips.slice(0)});
    this.originalState = produce(this.state, old => {
    });
    this.props.updateProfile(this.state.main.firstName, this.state.main.lastName)
  };

  handleChange = (key) => {
    return (obj) => {
      this.setState({[key]: {...this.state[key], ...obj}});
    };
  };

  addIp = (ip) => {
    const ips = produce(this.state.ips, ips => {
      ips.push(ip);
    });
    this.setState({ips: ips});
  };

  removeIp = (ip) => {
    const ips = produce(this.state.ips, ips => {
      const index = ips.indexOf(ip);
      if (index !== -1) {
        ips.splice(index, 1);
      }
    });
    this.setState({ips: ips});
  };

  updateMainForm = (data) => {
    const callApi = this.props.callApi;
    callApi(API.updateProfileMain, (response) => {
      this.originalState.main = {...this.state.main};
      if (response.ok) {
        this.props.updateProfile(this.state.main.firstName,
          this.state.main.lastName);
      }
    }, data);
  };

  updatePassword = (data) => {
    // Validation Password
    if (data.old === undefined || data.old === "") {
      const oldError = produce(this.state.password, m => {
        m.oldError = "Please input Old Password!";
      });
      this.setState({password: oldError});
      return false;
    }
    if (data.new === undefined || data.new === "") {
      const newError = produce(this.state.password, m => {
        m.newError = "Please input New Password!";
      });
      this.setState({password: newError});
      return false;
    }
    if (data.confirm === undefined || data.confirm === "") {
      const confirmError = produce(this.state.password, m => {
        m.confirmError = "Please confirm new Password!";
      });
      this.setState({password: confirmError});
      return false;
    }
    if (data.new !== data.confirm) {
      const confirmError = produce(this.state.password, m => {
        m.confirmError = "Password does not match";
      });
      this.setState({password: confirmError});
      return false;
    }
    let req = {oldPassword: data.old, newPassword: data.new};
    const callApi = this.props.callApi;
    callApi(API.updatePassword, (response) => {
      if (response.ok) {
        this.setState({password: defaultPassword})
      }
    }, req);
  };

  updateAddForm = (data) => {
    const callApi = this.props.callApi;
    callApi(API.updateProfileAdditional, (response) => {
      if (response.ok){
        this.originalState.additional = {...this.state.additional}
      }
    }, data)
  };

  updateIPForm = (data) => {
    const callApi = this.props.callApi;
    callApi(API.updateProfileIps, (response) => {
      if (response.ok){
        this.originalState.ips = this.state.ips.slice(0);
      }
    }, data);
  };

  resetMainForm = () => {
    this.setState({main: {...this.originalState.main}})
  };

  resetPassword = () => {
    this.setState({password: defaultPassword})
  };

  resetAddForm = () => {
    this.setState({additional: {...this.originalState.additional}})
  };

  resetIPForm = () => {
    this.setState({ips: this.originalState.ips.slice(0)});
  }
}

export default connect(undefined, dispatch => ({
  updateProfile:(firstName, lastName) => dispatch(profileUpdated({firstName, lastName}))
  })
)(withAuthApiLoadingNotification(Account));


