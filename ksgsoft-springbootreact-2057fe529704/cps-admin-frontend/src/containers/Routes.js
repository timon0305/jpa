import React from 'react';
import Privileges from "../constants/Privileges";
import {Redirect} from "react-router-dom";

const Dashboard = React.lazy( () => import('./Dashboard'));
const Account = React.lazy( () => import('./Account'));
const Roles = React.lazy( () => import('./Roles'));
const Users = React.lazy( () => import('./Users'));
const Sms = React.lazy( () => import('./Somos'));
const IdAndRo = React.lazy( () => import('./IdAndRo'));
const GeographicInfo = React.lazy( () => import('./GeographicInfo'));
const LergImport = React.lazy( () => import('./LergImport'));
const ViewLerg = React.lazy( () => import('./ViewLerg'));
const ActivityLog = React.lazy(() => import('./ActivityLog'));
const ViewCDR = React.lazy(() => import('./ViewCDR'));
const CDRImport = React.lazy(() => import('./CDRImport'));
const ViewRate = React.lazy(() => import('./ViewRate'));
const RateImport = React.lazy(() => import('./RateImport'));
const LCRReport = React.lazy(()=> import('./LCRReport'));
const CPRReport = React.lazy(() => import('./CPRReport'));
const LataNPANXXReport2 = React.lazy(()=> import('./LataNPANXXReport2'));

const getRoutes = (privileges) => {
  const result = [
    { path: '/', exact: true, name: 'Home', component: (props) => <Redirect to="/dashboard"/> },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/account', name: 'Account', component: Account }
  ];

  // Configuration Menu
  let route = {path: '/configuration', exact:true, name:'Configuration'};
  result.push(route);
  if (privileges.includes(Privileges.ReadRoles) || privileges.includes(Privileges.WriteRoles)) {
    result.push({ path: '/configuration/roles', name: 'Roles', component: Roles });
    if (!route.component)
      route.component = (props) => <Redirect to="/configuration/roles"/>
  }
  if (privileges.includes(Privileges.ReadUser) || privileges.includes(Privileges.WriteUser)) {
    result.push({ path: '/configuration/users', name: 'Users', component: Users });
    if (!route.component)
      route.component = (props) => <Redirect to="/configuration/users"/>
  }
  if (!route.component){
    result.pop();
  }

  // MGI Setting Menu
  route = {path: '/mgi', exact:true, name:'MGI Setting'};
  result.push(route);
  if (privileges.includes(Privileges.ReadSmsConnections) || privileges.includes(Privileges.WriteSmsConnections)) {
    result.push({ path: '/mgi/sms', name: 'SMS Connection', component: Sms });
    if (!route.component)
      route.component = (props) => <Redirect to="/mgi/sms"/>
  }
  if (privileges.includes(Privileges.ReadIdRos) || privileges.includes(Privileges.WriteIdRos)){
    result.push({ path: '/mgi/idAndRo', name: 'ID and RO Management', component: IdAndRo });
    if (!route.component)
      route.component = (props) => <Redirect to="/mgi/idAndRo"/>
  }
  if (!route.component){
    result.pop(); // Remove added item again.
  }

  // Tools Menu
  route = {path: '/tools', exact:true, name: 'Tools'};
  result.push(route);
  if (privileges.includes(Privileges.GeographicInformation)) {
    result.push({ path: '/tools/geographicInfo', name: 'GeographicInfo', component: GeographicInfo});
    if (!route.component)
      route.component = (props) => <Redirect to="/tools/geographicInfo"/>
  }
  if (privileges.includes(Privileges.ActivityLog)){
    result.push({ path: '/tools/activity_log', name: 'Activity Log', component: ActivityLog});
    if (!route.component)
      route.component = (props) => <Redirect to="/tools/activity_log"/>
  }
  if (!route.component){
    result.pop(); // Remove added item again.
  }

  //CPRgen
  route = {path: '/cprgen', exact:true, name: 'CPRGen'};
  result.push(route);
  if (privileges.includes(Privileges.LergImport)) {
    result.push({ path: '/cprgen/lerg_import', name: 'Lerg Import', component: LergImport});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/lerg_import"/>
  }
  if (privileges.includes(Privileges.ViewLerg)) {
    result.push({ path: '/cprgen/view_lerg', name: 'View Lerg', component: ViewLerg});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/view_lerg"/>
  }
  if (privileges.includes(Privileges.CDRImport)) {
    result.push({ path: '/cprgen/cdr_import', name: 'CDR Import', component: CDRImport});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/cdr_import"/>
  }
  if (privileges.includes(Privileges.ViewCDR)) {
    result.push({ path: '/cprgen/view_cdr', name: 'View CDR', component: ViewCDR});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/view_cdr"/>
  }
  if (privileges.includes(Privileges.RateImport)) {
    result.push({ path: '/cprgen/rate_import', name: 'Rate Import', component: RateImport});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/rate_import"/>
  }
  if (privileges.includes(Privileges.ViewRate)) {
    result.push({ path: '/cprgen/view_rate', name: 'View Rate Decks', component: ViewRate});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/view_rate"/>
  }
  if (privileges.includes(Privileges.LCRReport)) {
    result.push({ path: '/cprgen/lcr_report', name: 'LCR Report', component: LCRReport});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/lcr_report"/>
  }
  if (privileges.includes(Privileges.CDRImport)) {
    result.push({ path: '/cprgen/lata_npanxx_report_2', name: 'LATA, NPANXX Report 2', component: LataNPANXXReport2});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/lata_npanxx_report_2"/>
  }
  if (privileges.includes(Privileges.CPRReport)) {
    result.push({ path: '/cprgen/cprgen_report', name: 'CPRgen Report', component: CPRReport});
    if (!route.component)
      route.component = (props) => <Redirect to="/cprgen/cprgen_report"/>
  }
  if (!route.component){result.pop()}
  return result;
};

export default getRoutes;
