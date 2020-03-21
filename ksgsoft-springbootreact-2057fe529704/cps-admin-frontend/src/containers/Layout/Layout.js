import React, {Component, Suspense} from 'react';
import {Redirect, Switch, withRouter} from 'react-router-dom';
import {Container} from 'reactstrap';
import {connect} from 'react-redux';

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import getMenuItems from '../Nav';
// routes config
import getRoutes from '../Routes';
import AuthRoute from "../../components/AuthRoute";
import withSuspense from "../../components/HOC/withSuspense";

const Header = withSuspense(React.lazy(() => import('./Header')));
const Footer = withSuspense(React.lazy(() => import('./Footer')));
const WithRouterAppSidebarNav = withRouter(AppSidebarNav);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const routes = getRoutes(this.props.privileges);
    return (
      <div className="app">
        <AppHeader fixed>
          <Header/>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader/>
            <AppSidebarForm/>
            <Suspense>
              <WithRouterAppSidebarNav navConfig={getMenuItems(this.props.privileges)} {...this.props} />
            </Suspense>
            <AppSidebarFooter/>
            <AppSidebarMinimizer/>
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Switch>
                { routes.map( (route, idx) => (<AuthRoute path={route.path} exact={route.exact} component={route.component} key={idx} name={route.name}/>))}
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Footer/>
        </AppFooter>
      </div>
    );
  }
}

export default connect((state) => ({privileges: state.auth.privileges || []}))(Layout);
