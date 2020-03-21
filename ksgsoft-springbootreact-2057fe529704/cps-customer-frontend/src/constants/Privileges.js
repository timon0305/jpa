// Define privilege
function Privilege(name, displayName) {
  this.name = name;
  this.displayName = displayName;
}

const Privileges = {
  RecordAdmin : "ADMIN_RECORD",           // Customer Record Administration
  CustomerRecord : "CAD",        // Customer Record Admin Data
  PointerRecord : "PAD",         // Pointer Record Admin Data

  TemplateAdmin : "ADMIN_TEMPLATE",
  TemplateAdminData : "TAD",
  TemplateRecordList : "TRL",

  NumberAdmin : "ADMIN_NUMBER",
  NumberSearch : "SEARCH_NUM",
  ReservationLimit : "RESERVATION_LIMIT",
  ReservedNumberList : "RESERVED_NUMBER_LIST",
  NumberQueryUpdate : "NUMBER_QUERY_UPDATE",
  NumberStatusChange : "NUMBER_STATUS_CHANGE",
  TroubleReferralNumberQuery : "TROUBLE_REFFERAL_NUMBER_QUERY",
  OneClickActivate : "ONE_CLICK_ACTIVATE",

  SystemAutomationAdministration : "SYSTEM_AUTOMATION",
  MultiNumberChangeRespOrg : "MULTI_NUMBER_CH_RO",
  MultiNumberQuery : "MNQ",
  MultiConversionToPointerRecords : "MULTI_CONVERSION_PR",
};

export const DisplayNames = {

  [Privileges.RecordAdmin] : "Customer Record Admin",           // Customer Record Administration
  [Privileges.CustomerRecord] : "CAD",        // Customer Record Admin Data
  [Privileges.PointerRecord] : "PAD",         // Pointer Record Admin Data

  [Privileges.TemplateAdmin] : "Template Record Admin",
  [Privileges.TemplateAdminData] : "TAD",
  [Privileges.TemplateRecordList] : "TRL",

  [Privileges.NumberAdmin] : "Number Admin",
  [Privileges.NumberSearch] : "Search Number",
  [Privileges.ReservationLimit] : "Reservation Limit",
  [Privileges.ReservedNumberList] : "Reserved Number List",
  [Privileges.NumberQueryUpdate] : "Number Query Update",
  [Privileges.NumberStatusChange] : "Number Status Change",
  [Privileges.TroubleReferralNumberQuery] : "Trouble Referral Number Query",
  [Privileges.OneClickActivate] : "One Click Activate",

  [Privileges.SystemAutomationAdministration] : "System Automation Admin",
  [Privileges.MultiNumberChangeRespOrg] : "MRO",
  [Privileges.MultiNumberQuery] : "MNQ",
  [Privileges.MultiConversionToPointerRecords] : "MCP"
};

export default Privileges;
