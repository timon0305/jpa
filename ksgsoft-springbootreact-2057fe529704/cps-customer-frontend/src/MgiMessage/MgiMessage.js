const antlr4 = require('antlr4/index');
const ApplicationMessageParser = require('./ApplicationMessageParser').ApplicationMessageParser;
const ApplicationMessageLexer = require('./ApplicationMessageLexer').ApplicationMessageLexer;
const ApplicationMessageListener = require('./ApplicationMessageListener').ApplicationMessageListener;

/**
 * M
 * @param keys
 * @param values
 * @returns {MessageBlock}
 * @constructor
 */
function MessageBlock(keys, values){
  this.keys = keys;
  this.values = values;
  return this;
}

MessageBlock.prototype.toString = function(){
  if (!this.keys.length)
    return "No Content";
  let array = [];
  for (let i = 0; i < this.keys.length; i ++) {
    array.push(this.keys[i] + '=' + this.values[i]);
  }
  return array.join(",");
};

MessageBlock.prototype.value = function(key) {
  if (!this.keys || !this.keys.length) {
    return [];
  }
  let result = [];
  for (let i = 0; i < this.keys.length; i++) {
    if (key == this.keys[i]) {
      result.push(this.values[i]);
    }
  }
  return result;
  /*
  if (result.length == 1) {
    return result[0];
  } else if (result.length) {
    return result;
  } else {
    return undefined;
  }
  */
};

/**
 *
 * @param str
 * @returns {MgiMessage}
 * @constructor
 */
function MgiMessage(str) {
  const chars = new antlr4.InputStream(str);
  const lexer = new ApplicationMessageLexer(chars);
  const tokens  = new antlr4.CommonTokenStream(lexer);
  const parser = new ApplicationMessageParser(tokens);
  parser.buildParseTrees = true;

  this._isSuccess = true;

  // Common parse
  const parseCommon = (dateCtx, timeCtx, statusCtx) => {
    if (dateCtx) {
      this._year = parseInt(dateCtx.year().getText());
      this._month = parseInt(dateCtx.month().getText());
      this._day = parseInt(dateCtx.day().getText());
    }

    if (timeCtx) {
      this._hour = parseInt(timeCtx.hour().getText());
      this._minute = parseInt(timeCtx.minute().getText());
      this._second = parseInt(timeCtx.second().getText());
      this._timezone = timeCtx.timeZone().getText();
    }

    if (statusCtx) {
      const termRept = statusCtx.termRept();
      if (termRept) {
        this._statusTermRept = termRept.getText();
      }

      const errorCode = statusCtx.errorCode();
      if (termRept) {
        this._statusErrorCode = errorCode.getText();
      }
    }
  };

  const parseBlocks = (list) => {
    if (!list || !list.length) {
      return;
    }

    this._blocks = [];
    for (let i = 0; i < list.length; i++) {
      let block = list[i];
      const params = block.parameter();
      if (!params || !params.length) {
        continue;
      }

      let keys = [];
      let values = [];

      for (let j = 0; j < params.length; j++){
        let param = params[j];
        const name = param.parameterName();
        if (!name || !name.getText())
          continue;
        const value = param.parameterValue();
        if (!value)
          continue;

        if (value.Identifier()) {
          keys.push(name.getText());
          values.push(value.Identifier().getText());
        } else if (value.Text()) {
          const t = value.Text();
          keys.push(name.getText());
          values.push(t.getText().slice(1, t.getText().length - 1));
        } else if (value.DecimalNumber()) {
          const decimal = parseInt(value.DecimalNumber().getText());
          keys.push(name.getText());
          values.push(decimal);
        }
      }

      if (keys.length) {
        this._blocks.push(new MessageBlock(keys, values));
      }
    }
  };


  // Parse Test Capabilities messages
  const parseTestCapMessage = (verb) => {
    const ctx = parser.test();
    if (!ctx.EOF()){
      this._isSuccess = false;
      return;
    }
    this._verb = verb;
    this._mod = "TEST";

    parseCommon(ctx.date(), ctx.time(), ctx.status());

    const sequence = ctx.sequence();
    if (sequence) {
      this._sequence = sequence.getText();
    }

    const text = ctx.Text();
    if (text) {
      // Remove quote here
      if (text.getText()) {
        this._testMessage = text.getText().slice(1, text.getText().length - 2)
      }
    }
  };

  const parseUnsolicited = (verb) =>  {
    const ctx = parser.uns();
    if (!ctx.EOF()) {
      this._isSuccess = false;
      return;
    }

    this._verb = verb;
    const mod = ctx.Mod();
    if (mod) {
      this._mod = mod.getText();
    }

    parseCommon(ctx.date(), ctx.time());
    if (ctx.block() && ctx.block().parameterBlock()) {
      parseBlocks(ctx.block().parameterBlock());
    }
  };

  const parseResponse = () => {
    const ctx = parser.response();
    this._verb = "RSP";
    const mod = ctx.Mod();

    if (mod) {
      this._mod = mod.getText();
    }

    parseCommon(ctx.date(), ctx.time(), ctx.status());
    if (ctx.block() && ctx.block().parameterBlock()) {
      parseBlocks(ctx.block().parameterBlock());
    }
  };

  // Retrieve Application Status Information (Request packet)
  if (str.startsWith("RTRV-ASR")) {
    this._verb = "RTRV";
    this._mod = "ASR";
  } else if (str.startsWith("RSP-TEST")) {
    parseTestCapMessage("RSP");
  } else if (str.startsWith("REQ-TEST")) {
    parseTestCapMessage("REQ");
  } else if (str.startsWith("REPT")) {
    parseUnsolicited("REPT");
  } else if (str.startsWith("REQ")) {
    parseUnsolicited("REQ");
  } else if (str.startsWith("RSP")){
    parseResponse();
  }
  return this;
}

MgiMessage.prototype.value = function(key, isArray) {
  if (!this._blocks || !this._blocks.length){
    return [];
  }
  // Single key
  let result = [];
  if (Array.isArray(key)){
    for (let i = 0; i < this._blocks.length; i++) {
      let obj = {};
      for (let j = 0; j < key.length; j++) {
        const val = this._blocks[i].value(key[j]);
        if (val && val.length) {
          if (val.length == 1 && !isArray )
            obj[key[j]] = val[0];
          else
            obj[key[j]] = val;
        }
      }
      if (Object.keys(obj).length === 0 && obj.constructor === Object){
        continue;
      }
      result.push(obj);
    }
  } else {
    // result
    for (let i = 0; i < this._blocks.length; i++){
      const r = this._blocks[i].value(key);
      if (!r || !r.length) continue;
      result = result.concat(r);
    }
  }

  return result;
  /*
  if (!result.length)
    return undefined;
  else if (result.length == 1) {
    return result[0];
  }
  return result;
  */
};

MgiMessage.prototype.getVerb = function(){
  return this._verb;
};

MgiMessage.prototype.getMod = function(){
  return this._mod;
};

MgiMessage.prototype.getTermRept = function(){
  return this._statusTermRept;
};

MgiMessage.prototype.getErrorCode = function(){
  return this._statusErrorCode;
};


module.exports.MessageBlock = MessageBlock;
module.exports.MgiMessage = MgiMessage;
