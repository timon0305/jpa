import apisauce from 'apisauce';

const instance = (baseURL = process.env.REACT_APP_API_ENDPOINT) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  return apisauce.create({
    // base URL is read from the "constructor"
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 30000
  });
};

// Define api functions.

//login
const login = (api, username, password) => api.post('/session/login', {username, password});
const refreshToken = (api, token) => api.post('/session/refresh', {refreshToken: token});
//Account
const getVersions = (api) => api.get('/versions');
const getNotifications = (api) => api.get('/notifications');
//Profile
const getProfile = (api) => api.get('/profile');
const updateProfileAdditional = (api, req) => api.put('/profile/additional', req);
const updateProfileIps = (api, ips) => api.put('/profile/ips', ips);
const updateProfileMain = (api, req) => api.put('/profile/main', req);
const updatePassword = (api, req) => api.put('/profile/password', req);
//Role
const getRoles = (api) => api.get('/roles');
const getRoleDetails = (api, id) => api.get('/roles/'+ id);
const createRole = (api, req) =>  api.post('/roles', req);
const updateRole = (api, req) => api.put('/roles/' + req.id, req.req);
const deleteRole = (api, id) => api.delete('/roles/' + id);
//Users
const createUser = (api, req) => api.post('/users', req);
const activateUser = (api, id) => api.put('/users/'+id+'/activate');
const deactivateUser = (api, id) => api.put('/users/'+id+'/deactivate');
const deleteUserByID = (api, id) => api.delete('/users/' + id);
const getUserDetailByID = (api, id) => api.get('/users/' + id);
const getUsers = (api, req) => api.post('/users/search', req);
const updateUserAdditionalInformation = (api, id, req) => api.put('/users/' + id + '/additional', req);
const updateUserIpInformation = (api, id, req) => api.put('/users/' + id + '/ips', req);
const updateUserMainInformation = (api, id, req) => api.put('/users/' + id + '/main', req);
const updateUserPassword = (api, id, req) => api.put('/users/' + id + '/password', req);
//MGI Id and Ro
const deleteIdRo = (api, id) => api.delete('/mgi/users/' + id + '/idro');
const getAllIdRo = (api, req) => api.post('/mgi/users/idro', req);
const getUserIdRo = (api, id) => api.get('/mgi/users/' + id + '/idro');
const updateUserIdRo = (api, req) => api.post('/mgi/users/' + req.id + '/idro', req.req);
//MGI somos connections
const getSomosConnections = (api) => api.get('/mgi/connections');
const activateSMSConnection = (api, id) => api.put('/mgi/connections/' + id + '/activate');
const deactivateSMSConnection = (api, id) => api.put('/mgi/connections/' + id + '/deactivate');
const checkMGIConnectionStatus = (api) => api.get('/mgi/connections/status');
const createSMSConnection = (api, req) => api.post('/mgi/connections', req);
const deleteSMSConnection = (api, id) => api.delete('/mgi/connections/' + id);
const restartSMSConnections = (api) => api.get('/mgi/connections/restart');
const startSMSConncetions = (api) => api.get('/mgi/connections/start');
const stopSMSConncetions = (api) => api.get('/mgi/connections/stop');
const updateSMSConnection = (api, id, req) => api.put('/mgi/connections/' + id, req);
// CPRGen
const uploadLerg = (api, form) => {return api.post('/cprgen/lerg/upload', form, {headers:{'Content-Type': 'multipart/form-data'}, timeout: 3600000});};
const insertLerg = (api, req) => api.post('/cprgen/lerg/insert', req);
const searchLerg = (api, req) => api.post('/cprgen/lerg/search', req);
const uploadRate = (api, form) => {
  return api.post('/cprgen/rate/upload', form, {headers:{'Content-Type': 'multipart/form-data'}, timeout: 3600000});
};
const insertRate = (api, req) => api.post('/cprgen/rate/insert', req);
const searchRate = (api, req) => api.post('/cprgen/rate/search', req);
const uploadCDR = (api, form) => {
  return api.post('/cprgen/cdr/upload', form, {headers:{'Content-Type': 'multipart/form-data'}, timeout: 3600000});
};
const getRateDeckList = (api) => api.get("/cprgen/rate/list");
const renameRateDeck = (api, id, form) => api.put("/cprgen/rate/list/rename/" + id, form);
const deleteRateDeck = (api, id) => api.delete("/cprgen/rate/list/delete/" + id, {timeout: 3600000});
const insertCDR = (api, req) => api.post('/cprgen/cdr/insert', req);
const searchCDR = (api, req) => api.post('/cprgen/cdr/search', req);

const generateLCR = (api, req) => api.post('/cprgen/lcr_report', req);
const searchLCR = (api, req) => api.post('/cprgen/lcr_report/search', req);
const viewLCR = (api, id, req) => api.post('/cprgen/lcr_report/' + id, req);
const deleteLCR =  (api, id) => api.delete('/cprgen/lcr_report/' + id);
const getLCRReportList =  (api) => api.get('/cprgen/lcr_report/list');



const createCPRReport = (api, req) => api.post('/cprgen/cpr_report', req);
const getCPRReports = (api, req) => api.post('/cprgen/cpr_report/list', req);
const getCprReportDataById = (api, id, req) => api.post('/cprgen/cpr_report/' + id, req);
const getCprReportSummary = (api, id) => api.get('/cprgen/cpr_report/' + id + '/summary');

const generateLataNpanxxReport1 = (api) => api.post('/cprgen/lata_npanxx_report_1');
const generateLataNpanxxReport2 = (api, req) => api.post('/cprgen/lata_npanxx_report_2', req);
const searchLataNpanxxReport1 = (api, req) => api.post('/cprgen/lata_npanxx_report_1/search', req);
const searchLataNpanxxReport2 = (api, req) => api.post('/cprgen/lata_npanxx_report_2/search', req);
const searchLataNpanxxReport2DataById = (api, id, req) => api.post('/cprgen/lata_npanxx_report_2/' + id, req);
const deleteLataNpanxxReport2ById = (api, id) => api.delete('/cprgen/lata_npanxx_report_2/' + id);


const activityLog = (api, req) => api.post('/tools/activity_log', req);
const getSomosMessageById = (api, id) => api.get('/tools/activity_log/' + id);

export default{instance, login, refreshToken, getVersions, getNotifications, getProfile, updateProfileAdditional, updateProfileIps, updateProfileMain, updatePassword, getRoles,
  getRoleDetails, updateRole, deleteRole, createRole, createUser, activateUser, deactivateUser, deleteUserByID, getUserDetailByID, getUsers, updateUserAdditionalInformation,
  updateUserIpInformation, deleteIdRo, getAllIdRo, getUserIdRo, updateUserIdRo, getSomosConnections, activateSMSConnection, deactivateSMSConnection, checkMGIConnectionStatus,
  createSMSConnection, deleteSMSConnection, restartSMSConnections, startSMSConncetions, stopSMSConncetions, updateSMSConnection, uploadLerg, insertLerg, searchLerg, activityLog,
  getSomosMessageById, updateUserMainInformation, updateUserPassword,uploadCDR, insertCDR, searchCDR, uploadRate, insertRate, searchRate, getRateDeckList, generateLCR, searchLCR, viewLCR, deleteLCR,
  deleteRateDeck, renameRateDeck, getLCRReportList, createCPRReport, getCprReportDataById, getCPRReports, getCprReportSummary, generateLataNpanxxReport1, searchLataNpanxxReport1,
  generateLataNpanxxReport2, searchLataNpanxxReport2, searchLataNpanxxReport2DataById, deleteLataNpanxxReport2ById
}

