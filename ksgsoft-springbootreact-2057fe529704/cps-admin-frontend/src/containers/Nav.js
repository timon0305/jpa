import produce from 'immer';
import Privileges from '../constants/Privileges';

function MenuItem(name, url, icon, children){
  this.name = name;
  this.url = url;
  if (icon)
    this.icon = icon;
  if (children)
    this.children = children;
}

const dashboard = new MenuItem('Dashboard', '/dashboard', 'icon-speedometer');
const account = new MenuItem('Account', '/account', 'icon-user');

const configuration = new MenuItem('Configuration', '/configuration', 'icon-puzzle');
const roles = new MenuItem('Roles', '/configuration/roles');
const users = new MenuItem('Users', '/configuration/users');

const mgi = new MenuItem('MGI Setting', '/mgi', 'icon-settings');
const sms = new MenuItem('SMS Connection', '/mgi/sms');
const idRos = new MenuItem('ID and RO Management', '/mgi/idAndRo');

const tools = new MenuItem('Tools', '/tools','icon-wrench');
const activityLog = new MenuItem('Activity Log', '/tools/activity_log');
const graphicsInfo = new MenuItem('Geographic Information', '/tools/geographicInfo');

const cprgen = new MenuItem('CPRGen', '/cprgen', 'icon-cloud-download');
const lergImport = new MenuItem('RGLE Import', '/cprgen/lerg_import');
const viewLerg = new MenuItem('View RGLE', '/cprgen/view_lerg');
const cdrImport = new MenuItem('CDR Import', '/cprgen/cdr_import');
const viewCdr = new MenuItem('View CDR', '/cprgen/view_cdr');
const rateImport = new MenuItem('Rate Decks Import', '/cprgen/rate_import');
const viewRate = new MenuItem('View Rate Decks', '/cprgen/view_rate');
const lcrReport = new MenuItem('LCR Report', '/cprgen/lcr_report');
const LataNPANXXReport2 = new MenuItem('LATA, NPANXX Report 2', '/cprgen/lata_npanxx_report_2');
const cprReport = new MenuItem('CPRgen Report', '/cprgen/cprgen_report');

// Get menu items from privileges
function menuItems(privileges){
  let result = [];
  result.push(dashboard);
  result.push(account);

  // Configuration Menu
  let item = produce(configuration, item => {
    item.children = [];
    if (privileges.includes(Privileges.ReadRoles) || privileges.includes(Privileges.WriteRoles)) {
      item.children.push(roles);
    }
    if (privileges.includes(Privileges.ReadUser) || privileges.includes(Privileges.WriteUser)) {
      item.children.push(users);
    }
  });
  if (item.children.length)
    result.push(item);


  // MGI Setting Menu
  item = produce(mgi, item => {
    item.children = [];
    if (privileges.includes(Privileges.ReadSmsConnections) || privileges.includes(Privileges.WriteSmsConnections)) {
      item.children.push(sms);
    }
    if (privileges.includes(Privileges.ReadIdRos) || privileges.includes(Privileges.WriteIdRos)) {
      item.children.push(idRos);
    }
  });
  if (item.children.length)
    result.push(item);

  // Tools Menu
  item = produce(tools, item => {
    item.children = [];
    if (privileges.includes(Privileges.GeographicInformation))
      item.children.push(graphicsInfo);
    if (privileges.includes(Privileges.ActivityLog))
      item.children.push(activityLog)
  });
  if (item.children.length)
    result.push(item);

  //CPRgen Menu
  item = produce(cprgen, item => {
    item.children = [];
    if (privileges.includes(Privileges.LergImport))
      item.children.push(lergImport);
    if (privileges.includes(Privileges.ViewLerg))
      item.children.push(viewLerg);
    if (privileges.includes(Privileges.CDRImport))
      item.children.push(cdrImport);
    if (privileges.includes(Privileges.ViewCDR))
      item.children.push(viewCdr);
    if (privileges.includes(Privileges.RateImport))
      item.children.push(rateImport);
    if (privileges.includes(Privileges.ViewRate))
      item.children.push(viewRate);
    if (privileges.includes(Privileges.LCRReport))
      item.children.push(lcrReport);
    // if (privileges.includes(Privileges.CDRImport))
    //   item.children.push(LataNPANXXReport2);
    if (privileges.includes(Privileges.CPRReport))
      item.children.push(cprReport)
  });
  if (item.children.length)
    result.push(item);

  return {items: result};
}

export default menuItems;
