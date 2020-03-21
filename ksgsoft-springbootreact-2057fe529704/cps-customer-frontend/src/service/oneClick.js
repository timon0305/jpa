
export const verb = "REQ";

export const mod_reserve = "NSR";

export const mod_customer = "CRC";

export const id = "XQG01000";

export const ro = "XQG01";

export const timeout = "30";

export const ac_r = "R";

export const ac_n = "N";

export function search_reserve_ten_numbers(id, ro, nums, ncon, ctel, notes) {
  let numArray = nums.split(",");
  let numbers = "";
  for (let i = 0; i < numArray.length; i++) {
    numbers += "NUM=\"" + numArray[i].trim().toUpperCase() + "\","
  }
  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_r + "," + numbers + "QT=" + numArray.length + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"";
  return message;
}

export function search_reserve_numbers(id, ro, quantity, npa, nxx, line, num, cont, ncon, ctel, notes) {
  if (num !== null)
    num = num.toUpperCase();
  if (nxx !== null)
    nxx = nxx.toUpperCase();
  if (line !== null)
    line = line.toUpperCase();
  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_r;
  if (quantity === "1" && nxx === null && line === null) {
    if (npa !== "npa") {
      message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\""
    } else {
      message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\""
    }
  } else {
    if (num !== null && cont && nxx === null && line === null) {
      message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NUM=" + num + ",CONT=\"Y\"";
    } else if (nxx !== null && line === null) {
      if (npa !== "npa" && num === null) {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx;
      } else if (npa === "npa" && num === null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx;
      } else if (npa === "npa" && num !== null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx + ",NUM=" + num;
      }
    } else if (nxx !== null && line !== null) {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NXX=" + nxx + ",LINE=" + line;
      } else if (npa === "npa" && num === null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NXX=" + nxx + ",LINE=" + line;
      } else if (npa === "npa" && num !== null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=" + num;
      }
    } else if (nxx === null && line !== null) {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"" + ",LINE=" + line;
      } else if (npa === "npa" && num === null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"" + ",LINE=" + line;
      } else if (npa === "npa" && num !== null) {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=" + num + ",NXX=" + nxx;
      }
    } else {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"";
      } else {
        if (num === null && nxx === null && line === null) {
          message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"";
        } else {
          message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=" + num + ",NXX=" + nxx;
        }
      }
    }
  }
  return message;
}

export function customer_create(id, ro, num, ed, time, ctel, ncon, template, timezone, now, so, lns) {
  console.log(num);
  if (ed !== null) {
    let fix_date = ed.split("/");
    ed = fix_date[0] + "/" + fix_date[1] + "/" + fix_date[2].substring(2, 4);
  }

  if (time !== null) {
    if (time.includes("AM")){
      time = time.substring(0, 5) + "A/" + timezone;
    } else {
      time = time.substring(0, 5) + "P/" + timezone;
    }
  }

  if (now) {
    let current_time = new Date();
    let hour = current_time.getHours();
    let minute = current_time.getMinutes();
    if (minute >=0 && minute<15) {
      minute = "00";
    } else if (minute >= 15 && minute <30){
      minute = "15";
    } else if (minute >= 30 && minute < 45){
      minute = "30";
    } else if (minute >= 45 && minute <= 59) {
      minute = "45";
    }

    if (hour === 0)  time = '00:' + minute + 'A/' + timezone;
    else if (hour === 1)  time = '01:' + minute + 'A/' + timezone;
    else if (hour === 2)  time = '02:' + minute + 'A/' + timezone;
    else if (hour === 3)  time = '03:' + minute + 'A/' + timezone;
    else if (hour === 4)  time = '04:' + minute + 'A/' + timezone;
    else if (hour === 5)  time = '05:' + minute + 'A/' + timezone;
    else if (hour === 6)  time = '06:' + minute + 'A/' + timezone;
    else if (hour === 7)  time = '07:' + minute + 'A/' + timezone;
    else if (hour === 8)  time = '08:' + minute + 'A/' + timezone;
    else if (hour === 9)  time = '09:' + minute + 'A/' + timezone;
    else if (hour === 10)  time = '10:' + minute + 'A/' + timezone;
    else if (hour === 11)  time = '11:' + minute + 'A/' + timezone;
    else if (hour === 12)  time = '00:' + minute + 'P/' + timezone;
    else if (hour === 13)  time = '01:' + minute + 'P/' + timezone;
    else if (hour === 14)  time = '02:' + minute + 'P/' + timezone;
    else if (hour === 15)  time = '03:' + minute + 'P/' + timezone;
    else if (hour === 16)  time = '04:' + minute + 'P/' + timezone;
    else if (hour === 17)  time = '05:' + minute + 'P/' + timezone;
    else if (hour === 18)  time = '06:' + minute + 'P/' + timezone;
    else if (hour === 19)  time = '07:' + minute + 'P/' + timezone;
    else if (hour === 20)  time = '08:' + minute + 'P/' + timezone;
    else if (hour === 21)  time = '09:' + minute + 'P/' + timezone;
    else if (hour === 22)  time = '10:' + minute + 'P/' + timezone;
    else if (hour === 23)  time = '11:' + minute + 'P/' + timezone;

  }

  if (template !== null && template !== "") {
    let message = ':ID=' + id + ',RO=' + ro + ',AC=' + ac_n;
    message += ',NUM="' + num + '",ED="' +ed+ '",ET="' + time + '":IEC="CNT1=01,0288":SO=' + so + ':ANET="CNT6=01,US":CNT8=01:LN="No Listing Name Provided":CNT9=01:TEL="'+ num +'",LNS='+ lns + ',TMPLTPTR="'+ template + '"';
    return message;
  } else {
    let message = ':ID=' + id + ',RO=' + ro + ',AC=' + ac_n;
    message += ',NUM="' + num + '",ED="' +ed+ '",ET="' + time + '":IEC="CNT1=01,0288":SO=' + so + ':ANET="CNT6=01,US":CNT8=01:LN="No Listing Name Provided":CNT9=01:TEL="'+ num +'",LNS=' + lns;
    return message;
  }
}
