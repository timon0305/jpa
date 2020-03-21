import React, {Component} from 'react';
import {Badge, DropdownItem, DropdownMenu, DropdownToggle, Label, Nav, NavItem, NavLink} from 'reactstrap';
import PropTypes from 'prop-types';
import {AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import {connect} from "react-redux";
import { logout as logOutActionCreator } from '../../redux/AuthRedux';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    const { children, profile, ...attributes } = this.props;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <Label><strong style={{fontSize: 40}} className="ml-5">CPS</strong></Label>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"/><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src='../assets/img/avatars/avatar.png' className="img-avatar" style={{width: 30, height: 30}}/>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem><i className="fa fa-user"/> Profile</DropdownItem>
              <DropdownItem onClick={this.props.logout}><i className="fa fa-lock"/> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;


export default connect(
  state => ({
    profile: state.auth.profile
  }),
  dispatch => ({ logout: () => dispatch(logOutActionCreator()) }))(Header)
