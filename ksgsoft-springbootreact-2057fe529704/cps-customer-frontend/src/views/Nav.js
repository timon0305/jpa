import produce from 'immer';
import Privileges from '../constants/Privileges';
import React from "react";

function MenuItem(name, url, icon, children){
  this.name = name;
  this.url = url;
  if (icon)
    this.icon = icon;
  if (children)
    this.children = children;
}

const CustomerAdmin = new MenuItem('Customer Administration', '/customer_admin');
const CustomerData = new MenuItem('Customer Admin Data', '/customer_admin/customer_data');
const PointerData = new MenuItem('Pointer Admin Data', '/customer_admin/pointer_data');

const TemplateAdmin = new MenuItem('Template Administration', '/template_admin');
const TemplateData = new MenuItem('Template Admin Data', '/template_admin/template_data');
const TemplateList = new MenuItem('Template Record List', '/template_admin/template_list');

const NumberAdmin = new MenuItem('Number Administration', '/number_admin');
const NumberSearch = new MenuItem('Number Search', '/number_admin/number_search');
const ReservationLimit = new MenuItem('Reservation Limit', '/number_admin/reservation_limit');
const RNL = new MenuItem('Reserved Number List', '/number_admin/rnl');
const NumberQuery = new MenuItem('Number Query', '/number_admin/number_query');
const NumberStatus = new MenuItem('Number Status', '/number_admin/number_status');
const Trouble = new MenuItem('Trouble Referral Number Query', '/number_admin/trouble');
const OneClick = new MenuItem('One Click Activation', '/number_admin/oneClick');

const systemAdmin = new MenuItem('System Automation Administration', '/system_admin');
const MRO = new MenuItem('Multi Dial Number Resp Org Change', '/system_admin/mro');
const MNQ = new MenuItem('Multi Dial Number Query', '/system_admin/mnq');
const MCP = new MenuItem('Multiple Conversion to Pointer Record', '/system_admin/mcp');

function menuItems(privileges){
  let result = [];

  // Customer Administration Menu
  let item = produce(CustomerAdmin, item => {
    item.children = [];
    if (privileges.includes(Privileges.CustomerRecord)) {
      item.children.push(CustomerData);
    }
    if (privileges.includes(Privileges.PointerRecord)) {
      item.children.push(PointerData);
    }
  });
  if (item.children.length)
    result.push(item);

  // Template Administration Menu
  item = produce(TemplateAdmin, item => {
    item.children = [];
    if (privileges.includes(Privileges.TemplateAdminData)) {
      item.children.push(TemplateData);
    }
    if (privileges.includes(Privileges.TemplateRecordList)) {
      item.children.push(TemplateList);
    }
  });
  if (item.children.length)
    result.push(item);

  // Number Administration Menu
  item = produce(NumberAdmin, item => {
    item.children = [];
    if (privileges.includes(Privileges.NumberSearch))
      item.children.push(NumberSearch);
    if (privileges.includes(Privileges.ReservedNumberList))
      item.children.push(RNL);
    if (privileges.includes(Privileges.NumberQueryUpdate))
      item.children.push(NumberQuery);
    if (privileges.includes(Privileges.NumberStatusChange))
      item.children.push(NumberStatus);
    if (privileges.includes(Privileges.OneClickActivate))
      item.children.push(OneClick);
    if (privileges.includes(Privileges.TroubleReferralNumberQuery))
      item.children.push(Trouble);
  });
  if (item.children.length)
    result.push(item);

  // System Automation Administration Menu
  item = produce(systemAdmin, item => {
    item.children = [];
    if (privileges.includes(Privileges.MultiNumberQuery))
      item.children.push(MNQ);
    if (privileges.includes(Privileges.MultiNumberChangeRespOrg))
      item.children.push(MRO);
    if (privileges.includes(Privileges.MultiConversionToPointerRecords))
      item.children.push(MCP);

  });
  if (item.children.length)
    result.push(item);

  return {items: result};
}

export default menuItems;
