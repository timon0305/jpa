import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const NumberSearch = Loadable({
  loader: () => import('./views/Number_admin/NumberSearch'),
  loading: Loading,
});

const ReservationLimit = Loadable({
  loader: () => import('./views/Number_admin/ReservationLimit'),
  loading: Loading,
});

const NumberQuery = Loadable({
  loader: () => import('./views/Number_admin/NumberQuery'),
  loading: Loading,
});

const NumberStatus = Loadable({
  loader: () => import('./views/Number_admin/NumberStatus'),
  loading: Loading,
});

const Trouble = Loadable({
  loader: () => import('./views/Number_admin/Trouble'),
  loading: Loading,
});

const OneClick = Loadable({
  loader: () => import('./views/Number_admin/OneClick'),
  loading: Loading,
});

const Bulk = Loadable({
  loader: () => import('./views/Number_admin/Bulk'),
  loading: Loading,
});

const CustomerData = Loadable({
  loader: () => import('./views/Customer_admin/Index'),
  loading: Loading,
});

const CustomerSelection = Loadable({
  loader: () => import('./views/Customer_admin/CustomerSelection'),
  loading: Loading,
});

const TemplateSelection = Loadable({
  loader: () => import('./views/Template_admin/TemplateSelection'),
  loading: Loading,
});

const PointerData = Loadable({
  loader: () => import('./views/Customer_admin/PointerData'),
  loading: Loading,
});

const Audit = Loadable({
  loader: () => import('./views/Customer_admin/Audit'),
  loading: Loading,
});

const TemplateList = Loadable({
  loader: () => import('./views/Template_admin/TemplateList'),
  loading: Loading,
});

const TAD = Loadable({
  loader: () => import('./views/Template_admin/TAD'),
  loading: Loading,
});

const RNL = Loadable({
  loader: () => import('./views/Number_admin/RNL'),
  loading: Loading,
});

const CPR = Loadable({
  loader: () => import('./views/Customer_admin/CPR'),
  loading: Loading,
});

const LAD = Loadable({
  loader: () => import('./views/Customer_admin/LAD'),
  loading: Loading,
});

const MRO = Loadable({
  loader: () => import('./views/System_admin/MRO'),
  loading: Loading,
});

const MNQ = Loadable({
  loader: () => import('./views/System_admin/MNQ'),
  loading: Loading
});

const MCP = Loadable({
  loader: () => import('./views/System_admin/MCP'),
  loading: Loading
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/number_admin', exact: true, name: 'Number Administration', component: NumberSearch },
  { path: '/number_admin/number_search', name: 'Number Search', component: NumberSearch },
  // { path: '/number_admin/reservation_limit', name: 'Reservation Limit', component: ReservationLimit },
  { path: '/number_admin/rnl', name: 'Reserved Number List', component: RNL },
  { path: '/number_admin/number_query', name: 'Number Query and Update', component: NumberQuery },
  { path: '/number_admin/number_status', name: 'Number Status Change', component: NumberStatus },
  { path: '/number_admin/trouble', name: 'Trouble Referral Number Query', component: Trouble },
  { path: '/number_admin/oneClick', name: 'One Click Activate', component: OneClick },
  { path: '/number_admin/bulk', name: 'NumberStatus Request List', component: Bulk },
  { path: '/system_admin', exact: true, name: 'System Automation Administration', component: MRO},
  { path: '/system_admin/mro', name: 'Multi Dial Number Resp Org Change', component: MRO},
  { path: '/system_admin/mnq', name: 'Multi Dial Number Query', component: MNQ},
  { path: '/system_admin/mcp', name: 'Multiple Conversion to Pointer Records', component: MCP},
  { path: '/customer_admin', exact: true, name: 'Customer Record Administration', component: CustomerData },
  { path: '/customer_admin/customer_data', name: 'Customer Record Admin Data', component: CustomerData },
  { path: '/customer_admin/customer_selection', name: 'Customer Record Selection', component: CustomerSelection },
  { path: '/customer_admin/pointer_data', name: 'Pointer Record Admin Data', component: PointerData },
  { path: '/customer_admin/cpr', name: 'Call Processing', component: CPR },
  { path: '/customer_admin/lad', name: 'Label Definition', component: LAD },
  { path: '/customer_admin/audit', name: 'Customer Record Audit/Resend', component: Audit },
  { path: '/customer_manage', name: 'Customer Record Management', component: TemplateList },
  { path: '/template_admin', exact: true, name: 'Template Administration', component: TAD },
  { path: '/template_admin/tad', name: 'Template Admin Data', component: TAD },
  { path: '/template_admin/template_selection', name: 'Template Record Selection', component: TemplateSelection },
  { path: '/template_admin/template_list', name: 'Template Record List', component: TemplateList },
];

export default routes;
