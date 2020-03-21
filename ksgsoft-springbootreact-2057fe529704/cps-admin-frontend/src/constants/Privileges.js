// Define privilege
function Privilege(name, displayName) {
  this.name = name;
  this.displayName = displayName;
}

const Privileges = {
  ReadRoles: 'READ_ROLES',
  WriteRoles: 'WRITE_ROLES',
  ReadUser: 'READ_USER',
  WriteUser: 'WRITE_USER',
  ReadSmsConnections: 'READ_SOMOS_CONNECTIONS',
  WriteSmsConnections: 'WRITE_SOMOS_CONNECTIONS',
  ReadIdRos: 'READ_IDROS',
  WriteIdRos: 'WRITE_IDROS',
  GeographicInformation: 'READ_GEOGRAPHIC',
  LergImport: 'IMPORT_LERG',
  ViewLerg: 'VIEW_LERG',
  RateImport: 'IMPORT_RATE',
  ViewRate: 'VIEW_RATE',
  CDRImport: 'IMPORT_CDR',
  ViewCDR: 'VIEW_CDR',
  LCRReport: 'LCR_REPORT',
  CPRReport: 'CPR_REPORT',
  ActivityLog: 'VIEW_ACTIVITY_LOG',



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
  [Privileges.ReadRoles]: 'Read Role',
  [Privileges.WriteRoles]: 'Write Role',
  [Privileges.ReadUser]: 'Read User',
  [Privileges.WriteUser]: 'Write User',
  [Privileges.ReadSmsConnections]: 'Read Sms Connections',
  [Privileges.WriteSmsConnections]: 'Write Sms Connections',
  [Privileges.ReadIdRos]: 'Read ID and ROs',
  [Privileges.WriteIdRos]: 'Write ID and ROs',
  [Privileges.GeographicInformation]: 'Geographic Information',
  [Privileges.LergImport]: 'Lerg Import',
  [Privileges.ViewLerg]: 'View Lerg',
  [Privileges.RateImport]: 'Rate Import',
  [Privileges.ViewRate]: 'View Rate',
  [Privileges.CDRImport]: 'CDR Import',
  [Privileges.ViewCDR]: 'View CDR',
  [Privileges.LCRReport]: 'LCR Report',
  [Privileges.CPRReport]: 'CPRgen Report',
  [Privileges.ActivityLog]: 'View Activity Log',

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

export const AdminPrivileges = [
  Privileges.ReadRoles, Privileges.WriteRoles, Privileges.ReadUser, Privileges.WriteUser, Privileges.ReadSmsConnections, Privileges.WriteSmsConnections,
  Privileges.ReadIdRos, Privileges.WriteIdRos, Privileges.GeographicInformation, Privileges.LergImport, Privileges.ViewLerg, Privileges.ActivityLog,
  Privileges.ViewCDR, Privileges.ViewRate, Privileges.CDRImport, Privileges.RateImport, Privileges.LCRReport, Privileges.CPRReport
];

export const NMSPrivileges = [
  Privileges.CustomerRecord, Privileges.PointerRecord, Privileges.TemplateAdminData, Privileges.TemplateRecordList,
  Privileges.NumberSearch, Privileges.ReservationLimit, Privileges.ReservedNumberList, Privileges.NumberQueryUpdate, Privileges.NumberStatusChange,
  Privileges.TroubleReferralNumberQuery, Privileges.OneClickActivate,
  Privileges.MultiNumberChangeRespOrg, Privileges.MultiNumberQuery, Privileges.MultiConversionToPointerRecords
];

export default Privileges;


/*
export const Privileges = {
  Empty: new Privilege(undefined, undefined),
  SmsEditModal: new Privilege("MENU_DASHBOARD", "SmsEditModal Menu"),
  SystemSettings: new Privilege("MENU_SYSTEM_SETTINGS", "Setting Menu"),
  ReadLogo: new Privilege("READ_LOGO", "Read Logo"),
  WriteLogo: new Privilege("WRITE_LOGO", "Write Logo"),
  ReadTimezone: new Privilege("READ_TIMEZONE", "Read TimeZone"),
  WriteTimezone: new Privilege("WRITE_TIMEZONE", "Write TimeZone"),
  Roles: new Privilege("MENU_ROLES", "Roles Menu"),
  ReadRoles: new Privilege("READ_ROLES", "Read Role"),
  WriteRoles: new Privilege("WRITE_ROLES", "Write Role"),
  Users: new Privilege("MENU_USERS", "Users Menu"),
  ReadUser: new Privilege("READ_USER", "Read Users"),
  WriteUser: new Privilege("WRITE_USER", "Write Users"),
  NMSManagement: new Privilege("MENU_NMS", "NMS Menu"),
  ReadNMS: new Privilege("READ_NMS", "Read NMS"),
  WriteNMS: new Privilege("WRITE_NMS", "Write NMS"),
  Mgi: new Privilege("MENU_MGI", "MGI Menu"),
  ReadSmsConnections: new Privilege("READ_SOMOS_CONNECTIONS", "Read SmsEditModal Connections"),
  WriteSmsConnections: new Privilege("WRITE_SOMOS_CONNECTIONS", "Write SmsEditModal Connections"),
  ReadIdRos: new Privilege("READ_IDROS", "Read ID and ROs"),
  WriteIdRos: new Privilege("WRITE_IDROS", "Write ID and Ros"),
  GeographicInformation: new Privilege("READ_GEOGRAPHIC", "Geographic Information")
};
*/
