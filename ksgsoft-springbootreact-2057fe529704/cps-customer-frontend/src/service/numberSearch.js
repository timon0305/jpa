export const verb = "REQ";

export const mod = "NSR";

export const ac_s = "S";

export const ac_q = "Q";

export const ac_r = "R";

export const timeout = "30";

export function search_number(id, ro, quantity, npa, nxx, line, cont, num) {
  if (num !== "")
    num = num.toUpperCase();
  if (nxx !== "")
    nxx = nxx.toUpperCase();
  if (line !== "")
    line = line.toUpperCase();
  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_s;

  if (quantity === "1" && npa !== "npa" && nxx === "" && line === "") {
    message += ",NPA=" + npa;
  } else {
    if (npa !== "npa" && nxx === "" && line === "") {
      if (cont) {
        message += ",QT=" + quantity + ",NPA=" + npa + ",CONT=\"Y\"";
      } else {
        message += ",NPA=" + npa + ",QT=" + quantity;
      }
    } else if (npa === "npa" && nxx === "" && line === "") {
      if (num !== "" && cont) {
        message += ",CONT=\"Y\"" + ",QT=" + quantity + ",NUM=\"" + num + "\"";
      } else if (num !== "" && !cont) {
        message += ",QT=" + quantity + ",NUM=\"" + num + "\"";
      } else if (num === "" && cont) {
        message += ",CONT=\"Y\"" + ",QT=" + quantity;
      } else if (num === "" && !cont) {
        message += ",QT=" + quantity;
      }
    }
  }

  if (npa !== "npa" && nxx !== "" && line === "") {
    if (cont) {
      message += ",NPA=" + npa + ",NXX=" + nxx + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else {
      message += ",NPA=" + npa + ",NXX=" + nxx + ",QT=" + quantity;
    }
  } else if (npa === "npa" && nxx !== "" && line === "") {
    if (num === "") {
      message += ",NXX=" + nxx + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else {
      message += ",NXX=" + nxx + ",NUM=\"" + num + "\",CONT=\"Y\"" + ",QT=" + quantity;
    }
  } else if (npa !== "npa" && nxx === "" && line !== "") {
    if (cont) {
      message += ",NPA=" + npa + ",LINE=" + line + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else {
      message += ",NPA=" + npa + ",LINE=" + line + ",QT=" + quantity;
    }
  } else if (npa === "npa" && nxx === "" && line !== "") {
    if (num === "" && cont) {
      message += ",LINE=" + line + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else if (num === "" && !cont) {
      message += ",LINE=" + line + ",QT=" + quantity;
    } else if (num !== "" && cont) {
      message += ",LINE=" + line + ",NUM=\"" + num + "\",CONT=\"Y\"" + ",QT=" + quantity;
    } else if (num !== "" && !cont) {
      message += ",LINE=" + line + ",NUM=\"" + num + "\",QT=" + quantity;
    }
  } else if (npa !== "npa" && nxx !== "" && line !== "") {
    if (cont) {
      message += ",NPA=" + npa + ",NXX=" + nxx + ",LINE=" + line + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else {
      message += ",NPA=" + npa + ",NXX=" + nxx + ",LINE=" + line + ",QT=" + quantity;
    }
  } else if (npa === "npa" && nxx !== "" && line !== "") {
    if (num === "" && cont) {
      message += ",NXX=" + nxx + ",LINE=" + line + ",CONT=\"Y\"" + ",QT=" + quantity;
    } else if (num === "" && !cont) {
      message += ",NXX=" + nxx + ",LINE=" + line + ",QT=" + quantity;
    } else if (num !== "" && cont) {
      message += ",NXX=" + nxx + ",LINE=" + line + ",NUM=\"" + num + "\",CONT=\"Y\"" + ",QT=" + quantity;
    } else if (num !== "" && !cont) {
      message += ",NXX=" + nxx + ",LINE=" + line + ",NUM=\"" + num + "\",QT=" + quantity;
    }
  }
  return message;
}

export function query_number(id, ro, num) {
  if (num !== "")
    num = num.toUpperCase();

  let message = "";
  if (num !== null) {
    message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_q + ",NUM=\"" + num + "\"";
  }
  return message
}

export function search_ten_numbers(id, ro, nums) {
  let numArray = nums.split(",");
  let numbers = "";
  for (let i = 0; i < numArray.length; i++) {
    if (i === numArray.length - 1) {
      numbers += "NUM=\"" + numArray[i].trim().toUpperCase() + "\"";
    } else {
      numbers += "NUM=\"" + numArray[i].trim().toUpperCase() + "\","
    }
  }

  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_s + "," + "QT=" + numArray.length +","+ numbers ;
  return message;
}

export function search_reserve_ten_numbers(id, ro, nums, ncon, ctel, notes) {
  let numArray = nums.split(",");
  let numbers = "";
  for (let i = 0; i < numArray.length; i++) {
    if (i === numArray.length -1) {
      numbers += "NUM=\"" + numArray[i].trim().toUpperCase() + "\""
    } else {
      numbers += "NUM=\"" + numArray[i].trim().toUpperCase() + "\","
    }
  }
  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_r + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel +"\",QT=" + numArray.length + ","+ numbers;
  return message;
}

export function search_reserve_numbers(id, ro, quantity, npa, nxx, line, num, cont, ncon, ctel, notes) {
  if (num !== "")
    num = num.toUpperCase();
  if (nxx !== "")
    nxx = nxx.toUpperCase();
  if (line !== "")
    line = line.toUpperCase();
  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_r;
  if (quantity === "1" && nxx === "" && line === "") {
    if (npa !== "npa") {
      message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\""
    } else {
      message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\""
    }
  } else {
    if (num !== "" && cont && nxx === "" && line === "") {
      message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NUM=\"" + num + "\",CONT=\"Y\"";
    } else if (nxx !== "" && line === "") {
      if (npa !== "npa" && num === "") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx;
      } else if (npa === "npa" && num === "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx;
      } else if (npa === "npa" && num !== "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"" + ",NXX=" + nxx + ",NUM=\"" + num+"\"";
      }
    } else if (nxx !== "" && line !== "") {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NXX=" + nxx + ",LINE=" + line;
      } else if (npa === "npa" && num === "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",NXX=" + nxx + ",LINE=" + line;
      } else if (npa === "npa" && num !== "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=\"" + num+"\"";
      }
    } else if (nxx === "" && line !== "") {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"" + ",LINE=" + line;
      } else if (npa === "npa" && num === "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"" + ",LINE=" + line;
      } else if (npa === "npa" && num !== "") {
        message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=\"" + num + "\",NXX=" + nxx;
      }
    } else {
      if (npa !== "npa") {
        message += ",NPA=" + npa + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",NOTES=" + notes + ",QT=" + quantity + ",CONT=\"Y\"";
      } else {
        if (num === "" && nxx === "" && line === "") {
          message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",CONT=\"Y\"";
        } else {
          message += ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"" + ",QT=" + quantity + ",LINE=" + line + ",NUM=\"" + num + "\",NXX=" + nxx;
        }
      }

    }
  }

  return message;
}
export function reserve_numbers(id, ro, nums, ncon, ctel) {
  let numbers = "";
  for (let i = 0; i < nums.length; i++) {
    numbers += "NUM=\"" + nums[i].trim() + "\","
  }

  let message = ":ID=" + id + ",RO=" + ro + ",AC=" + ac_r + "," + numbers + "QT=" + nums.length + ",NCON=\"" + ncon + "\",CTEL=\"" + ctel + "\"";
  return message;
}

export function trouble_number(id, ro, num) {
  if (num !== "")
    num = num.toUpperCase();
  let numArray = num.split(",");
  let numbers = "";
  for (let i = 0; i < numArray.length; i++) {
    numbers += "NUM=\"" + numArray[i].trim() + "\","
  }
  let message = ":ID=" + id + ",RO=" + ro + ",QT=" + numArray.length + "," + numbers;
  return message;
}

export function template_list(id, ro, entity, template) {
  let message = ":ID=" + id + ",RO=" + ro;
  if (entity !== "" && template === "") {
    message += ",TREN=" + entity;
  } else if (entity === "" && template !== "") {
    message += ",STMPLTNM=" + template;
  } else if (entity !== "" && template !== "") {
    message += ",TREN=" + entity + ",STMPLTNM=" + template;
  }
  return message;
}

export function reserve_to_spare(id, ro, num) {
  return ":ID=" + id + ",RO=" + ro + ",AC=S,NUM=\"" + num + "\"";
}

export function number_status(id, ro, num, ro_c, ncon, ctel, notes, ru, state) {
  console.log(ru);
  if (ru && ru.length) {
    let fix_date = ru.split("/");
    ru = fix_date[0] + "/" + fix_date[1] + "/" + fix_date[2].substring(2, 4);
  }
  let message = "";
  if (state === "SPARE") {
    message += ':ID=' + id + ',RO=' + ro + ',AC=S,NUM="' + num + '"';
  } else if (state === "RESERVE") {
    message += ':ID=' + id + ',RO=' + ro + ',AC=C,NUM="' + num + '"';
    if (ro_c !== "" && ro_c !== ro) {
      message += ',NEWRO=' + ro_c;
    }
    if (ru !== "") {
      message += ',RU=' + ru;
    }
    if (ncon !== "") {
      message += ',NCON="' + ncon + '"';
    }
    if (ctel !== "") {
      message += ',CTEL="' + ctel + '"';
    }
    if (notes !== "") {
      message += ',NOTES="' + notes + '"';
    }
  }

  return message;
}

export function fix_num(num) {
  console.log(num)
  if (num.includes("-")) {
    num = num.split("-").join("");
  }
  return num.trim();
}

export function multi_resp_change(id, ro, newro, nums){
  let message = ':ID=' + id + ',RO=' + ro + ',NEWRO=' + newro;
  if (nums.includes(",")){
    nums = nums.split(",");
    message += ':QT=' + nums.length + ':NUML=';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += '"' + nums[i].trim() + '"';
      } else {
        message += '"' + nums[i].trim() + '",';
      }
    }
  } else if (nums.includes("\n")) {
    nums = nums.split("\n");
    message += ':QT=' + nums.length + ':NUML="';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += nums[i].trim() + '"';
      } else {
        message += nums[i].trim() + ',';
      }
    }
  } else if (nums.includes(",") && nums.includes('\n')){
    nums.replace(/\,/g,"");
    nums = nums.split("\n");
    message += ':QT=' + nums.length + ':NUML="';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += nums[i].trim() + '"';
      } else {
        message += nums[i].trim() + ',';
      }
    }
  } else {
    message += ':QT=1:NUML="' + nums + '"';
  }

  return message;
}

export function multi_query(id, ro, nums) {
  let message = ':ID=' + id + ',RO=' + ro;
  if (nums.includes(",")){
    nums = nums.split(",");
    message += ':QT=' + nums.length + ':NUML=';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += '"' + nums[i].trim() + '"';
      } else {
        message += '"' + nums[i].trim() + '",';
      }
    }
  } else if (nums.includes("\n")) {
    nums = nums.split("\n");
    message += ':QT=' + nums.length + ':NUML=';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += '"' + nums[i].trim() + '"';
      } else {
        message += '"' + nums[i].trim() + '",';
      }
    }
  } else if (nums.includes(",") && nums.includes('\n')){
    nums.replace(/\,/g,"");
    nums = nums.split("\n");
    message += ':QT=' + nums.length + ':NUML="';
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += nums[i].trim() + '"';
      } else {
        message += nums[i].trim() + ',';
      }
    }
  }else {
    message += ':QT=1:NUML="' + nums + '"';
  }

  return message;
}

export function multi_conversion(id, ro, nums, date, template, notes) {
  let message = ':ID=' + id + ',RO=' + ro + ',AC=C';
  if (nums.includes(",")){
    nums = nums.split(",");
    message += ':QT=' + nums.length ;
    for (let i = 0; i<nums.length; i++) {
      if (i === nums.length -1) {
        message += ':NUML="' + nums[i].trim() + '"';
      } else {
        message += ':NUML="' + nums[i].trim() + '",';
      }
    }
  } else {
    message += ':QT=1:NUML="' + nums + '"';
  }
  if (date.trim() === "NOW") {
    message += ':ED="' + date;
  } else {
    date = date.split(" ");
    message += ':ED="' +  date[0] + '",ET="' + date[1]
  }

  message += '",TMPLTPTR="' + template + '"';
  return message;
}
