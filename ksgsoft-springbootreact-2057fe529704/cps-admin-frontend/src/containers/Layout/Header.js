import React, {Component} from 'react';
import {Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink} from 'reactstrap';
import PropTypes from 'prop-types';
import {AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
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
        <AppNavbarBrand
          full={{ src: logo, width: 210, height: 55, alt: 'user', position: 'responsive' }}
        />
        <Nav className="ml-auto" navbar>
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-bell"/><Badge pill color="danger">5</Badge></NavLink>*/}
          {/*</NavItem>&nbsp;&nbsp;*/}
          <span>
            {
              (() => {
                if (profile.firstName || profile.lastName) {
                  return profile.firstName + " " + profile.lastName
                } else {
                  return profile.username
                }
              })()
            }
          </span>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src='../assets/img/avatars/avatar.png' className="img-avatar" style={{width: 30, height: 30}}/>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {/*<DropdownItem><i className="fa fa-user"/> Profile</DropdownItem>*/}
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
