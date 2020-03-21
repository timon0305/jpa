import {id, ro} from "./customer";
import {formatInt} from "../utils";

export function create_pointer_record(id, ro, action, num, ed, abn, dau, dat, dd, hdd, li, rao, so, sf, note, agent, telco, cus, newro, la, cbi, ncon, ctel, ln, tel, city, fso, lns, hml, lsis, lso, sfg, stn, uts,lads, types, datas, template) {
  if (action === "" || action === null)
    action = "N";
  let message = ':ID='+id+',RO='+ro+',AC='+ action +',NUM="'+num+'"';
  if (ed === "NOW") {
    message += ',ED="' + ed + '"';
  } else {
    let date = ed.split(" ");
    message += ',ED="' + date[0] + '",ET="' + date[1] + '"';
  }
  if (template !== "") message += ',TMPLTPTR="' + template + '"';
  if (abn !== "") message += ':ABN="' + abn + '"';
  if (dau !== "") message += ',DAU=' + dau;
  if (dat !== "") message += ',DAT=' + dat;
  if (dd !== "") message += ',DD="' + dd +'"';
  if (hdd !== "") message += ',HDD='+hdd;
  if (li !== "") message += ',LI="'+li + '"';
  if (rao !== "") message += ',RAO="'+rao + '"';
  if (so !== "") message += ':SO='+ so;
  if (sf !== "") message += ',SF="'+sf + '"';
  if (agent !== "") message += ',AGENT="'+agent + '"';
  if (telco !== "") message += ',TELCO="'+ telco + '"';
  if (cus !== "") message += ',CUS="'+ cus + '"';
  if (newro !== "" && newro !== "XQG01") message += ',NEWRO=' + newro;
  if (la !== "") message += ',LA="'+ la+ '"';
  if (cbi!== "") message += ',CBI="'+ cbi + '"';
  if (ncon !== "" && ncon !== "KEELE,RICKY") message += ',NCON="'+ ncon+ '"';
  if (ctel!== "" && ctel !== "8887673300") message += ',CTEL="'+ ctel + '"';
  if (note !== "") message += ',NOTE="'+note + '"';
  ln !== "" ? message += ':CNT8=01:LN="'+ ln + '"' : message += ':CNT8=01:LN="No Listing Name Provided"';
  if (tel !== "") message += ':CNT9=01:TEL="'+ tel+ '"';
  if (city !== "") message += ',CITY="'+ city+ '"';
  if (fso !== "") message += ',FSO="'+ fso+ '"';
  if (lns !== "") message += ',LNS=' + lns;
  if (hml !== "") message += ',HML="'+ hml+ '"';
  if (lsis !== "") message += ',LSIS="'+ lsis+ '"';
  if (lso !== "") message += ',LSO="'+ lso+ '"';
  if (sfg !== "") message += ',SFG="'+ sfg+ '"';
  if (stn !== "") message += ',STN="'+ stn+ '"';
  if (uts !== "") message += ',UTS="'+ uts+ '"';
  let cpr_mess = "", lad_mess = '';
  message += add_cpr(types, datas, cpr_mess);
  message += add_lad(lads, lad_mess);
  return message;
}

export function update_pointer_record(id, ro, action, num, copy_sfed, abn, dau, dat, dd, hdd, li, rao, so, sf, note, agent, telco, cus, newro, la, cbi, ncon, ctel, ln, tel, city, fso, lns, hml, lsis, lso, sfg, stn, uts,lads, types, datas, template, cpr, cr, lad) {
  let message = ':ID=' + id + ',RO=' + ro + ',AC=' + action + ',NUM="' + num + '"';
  if (copy_sfed.trim() !== "NOW") {
    let date = copy_sfed.split(" ");
    message += ',ED="' + date[0] + '",ET="' + date[1] + '"';
  } else {
    message += ',ED="' + copy_sfed.trim() + '"';
  }
  if (template !== "") message += ',TMPLTPTR="' + template +'"';
  if (cr) {
    if (abn !== "") message += ':ABN="' + abn + '"';
    // if (dau !== "") message += ',DAU=' + dau;
    // if (dat !== "") message += ',DAT=' + dat;
    // if (dd !== "") message += ',DD="' + dd +'"';
    if (hdd !== "") message += ',HDD='+hdd;
    if (li !== "") message += ',LI="'+li + '"';
    if (rao !== "") message += ',RAO="'+rao + '"';
    if (so !== "") message += ':SO='+ so;
    if (sf !== "") message += ',SF="'+sf + '"';
    if (agent !== "") message += ',AGENT="'+agent + '"';
    if (telco !== "") message += ',TELCO="'+ telco + '"';
    if (cus !== "") message += ',CUS="'+ cus + '"';
    if (newro !== "" && newro !== "XQG01") message += ',NEWRO=' + newro;
    if (la !== "") message += ',LA="'+ la+ '"';
    if (cbi!== "") message += ',CBI="'+ cbi + '"';
    if (ncon !== "" && ncon !== "KEELE,RICKY") message += ',NCON="'+ ncon+ '"';
    if (ctel!== "" && ctel !== "8887673300") message += ',CTEL="'+ ctel + '"';
    if (note !== "") message += ',NOTE="'+note + '"';
    ln !== "" ? message += ':CNT8=01:LN="'+ ln + '"' : message += ':CNT8=01:LN="No Listing Name Provided"';
    if (tel !== "") message += ':CNT9=01:TEL="'+ tel+ '"';
    if (city !== "") message += ',CITY="'+ city+ '"';
    if (fso !== "") message += ',FSO="'+ fso+ '"';
    if (lns !== "") message += ',LNS=' + lns;
    if (hml !== "") message += ',HML="'+ hml+ '"';
    if (lsis !== "") message += ',LSIS="'+ lsis+ '"';
    if (lso !== "") message += ',LSO="'+ lso+ '"';
    if (sfg !== "") message += ',SFG="'+ sfg+ '"';
    if (stn !== "") message += ',STN="'+ stn+ '"';
    if (uts !== "") message += ',UTS="'+ uts+ '"';
  }
  if (cpr) {
    let cpr_mess = "";
    message += add_cpr(types, datas, cpr_mess);
  }
  if (lad) {
    let lad_mess = "";
    message += add_lad(lads, lad_mess);
  }
  return message;
}

export function disconnect_pointer(id, ro, action, num, date, refer, eint) {
  let message = ':ID=' + id + ',RO=' + ro + ',AC=' + action + ',NUM="' + num + '"';
  if (date.toUpperCase().trim() !== "NOW") {
    date = date.split(" ");
    message += ',ED="' + date[0] + '",ET="' + date[1] + '"';
  } else {
    message += ',ED="' + date.trim() + '"';
  }
  message += ',REFER=' + refer + ',EINT="' + eint + '"';
  return message;
}

export function resend_pointer(id, ro, action, num, date) {
  let message = ':ID=' + id + ',RO=' + ro + ',AC=' + action + ',NUM="' + num + '"';
  if (date.toUpperCase().trim() !== "NOW") {
    date = date.split(" ");
    message += ',ED="' + date[0] + '",ET="' + date[1] + '"';
  } else {
    message += ',ED="' + date.trim() + '"';
  }
  return message;
}

export function add_lad(lads, message) {
  if (lads && lads.length) {
    message += ':CNT12=' + lads.length;
    for (let i=0; i<lads.length;i++) {
      let lad = lads[i];
      let def = lad.def;
      message +=':TYPE=' + lad.type + ',LBL="' + lad.label + '",DEF="CNT13=' + formatInt(def.length, 3);
      for (let j = 0; j<lad.def.length; j++) {
        message += ',' + lad.def[j]
      }
      message += '"';
    }
  }
  return message;
}

export function add_cpr(types, datas, message) {
  if (types && datas && datas[0].length) {
    datas = datas.filter( arr => !arr.isAllEmpty());
    let rotated = [];
    if (datas && datas[0]) {
      message += ':NODE="CNT10=' + formatInt(types.length, 3);
      for (let i = 0; i<types.length; i++) {
        message += ',' + types[i];
      }
      for (let i = 0; i < datas[0].length; i++) {
        rotated.push(Array(datas.length).fill(""));
      }
      for (let i = 0; i<datas.length; i++){
        for (let j=0; j<datas[i].length; j++) {
          rotated[j][i] = datas[i][j];
        }
      }
      rotated = rotated.filter( arr => !arr.isAllEmpty());
      message +='":CNT11=' + formatInt(rotated.length, 1);
      for (let i = 0; i < rotated.length; i++) {
        message +=':V="';
        for (let j = 0; j < rotated[i].length; j++ ) {
          if (j === rotated[i].length -1) {
            message += rotated[i][j] + '"';
          } else {
            message += rotated[i][j] + ',';
          }
        }
      }
    }
  }
  return message;
}
