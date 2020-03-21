// Generated from ApplicationMessage.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var ApplicationMessageListener = require('./ApplicationMessageListener').ApplicationMessageListener;
var grammarFileName = "ApplicationMessage.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003-\u00bc\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0005\u00022\n\u0002\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0005\u0003J\n\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u0004d",
    "\n\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005z\n\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t",
    "\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003",
    "\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\r\u0003",
    "\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u0010\u0003",
    "\u0010\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0012\u0003",
    "\u0012\u0003\u0013\u0003\u0013\u0003\u0013\u0007\u0013\u00a7\n\u0013",
    "\f\u0013\u000e\u0013\u00aa\u000b\u0013\u0003\u0014\u0003\u0014\u0003",
    "\u0014\u0007\u0014\u00af\n\u0014\f\u0014\u000e\u0014\u00b2\u000b\u0014",
    "\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0016\u0003\u0016",
    "\u0003\u0017\u0003\u0017\u0003\u0017\u0002\u0002\u0018\u0002\u0004\u0006",
    "\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*",
    ",\u0002\u0006\u0003\u0002\r\u000f\u0003\u0002\u0013$\u0003\u0002%&\u0003",
    "\u0002),\u0002\u00ac\u00021\u0003\u0002\u0002\u0002\u0004I\u0003\u0002",
    "\u0002\u0002\u0006c\u0003\u0002\u0002\u0002\by\u0003\u0002\u0002\u0002",
    "\n}\u0003\u0002\u0002\u0002\f\u007f\u0003\u0002\u0002\u0002\u000e\u0085",
    "\u0003\u0002\u0002\u0002\u0010\u0087\u0003\u0002\u0002\u0002\u0012\u0089",
    "\u0003\u0002\u0002\u0002\u0014\u008b\u0003\u0002\u0002\u0002\u0016\u0093",
    "\u0003\u0002\u0002\u0002\u0018\u0095\u0003\u0002\u0002\u0002\u001a\u0097",
    "\u0003\u0002\u0002\u0002\u001c\u0099\u0003\u0002\u0002\u0002\u001e\u009b",
    "\u0003\u0002\u0002\u0002 \u009f\u0003\u0002\u0002\u0002\"\u00a1\u0003",
    "\u0002\u0002\u0002$\u00a3\u0003\u0002\u0002\u0002&\u00ab\u0003\u0002",
    "\u0002\u0002(\u00b3\u0003\u0002\u0002\u0002*\u00b7\u0003\u0002\u0002",
    "\u0002,\u00b9\u0003\u0002\u0002\u0002.2\u0005\u0004\u0003\u0002/2\u0005",
    "\u0006\u0004\u000202\u0005\b\u0005\u00021.\u0003\u0002\u0002\u00021",
    "/\u0003\u0002\u0002\u000210\u0003\u0002\u0002\u00022\u0003\u0003\u0002",
    "\u0002\u000234\u0007\u0003\u0002\u000245\u0007(\u0002\u000256\u0007",
    "\u0004\u0002\u000267\u0005\f\u0007\u000278\u0007\u0005\u0002\u00028",
    "9\u0005\u0014\u000b\u00029:\u0007\u0006\u0002\u0002:;\u0005\u001e\u0010",
    "\u0002;<\u0007\u0007\u0002\u0002<=\u0005$\u0013\u0002=>\u0007\b\u0002",
    "\u0002>J\u0003\u0002\u0002\u0002?@\u0007\u0003\u0002\u0002@A\u0007(",
    "\u0002\u0002AB\u0007\u0004\u0002\u0002BC\u0005\f\u0007\u0002CD\u0007",
    "\u0005\u0002\u0002DE\u0005\u0014\u000b\u0002EF\u0007\u0006\u0002\u0002",
    "FG\u0005\u001e\u0010\u0002GH\u0007\t\u0002\u0002HJ\u0003\u0002\u0002",
    "\u0002I3\u0003\u0002\u0002\u0002I?\u0003\u0002\u0002\u0002JK\u0003\u0002",
    "\u0002\u0002KL\u0007\u0002\u0002\u0003L\u0005\u0003\u0002\u0002\u0002",
    "MN\u0007\n\u0002\u0002NO\u0005\f\u0007\u0002OP\u0007\u0005\u0002\u0002",
    "PQ\u0005\u0014\u000b\u0002QR\u0007\u0007\u0002\u0002RS\u0005\n\u0006",
    "\u0002ST\u0007\u000b\u0002\u0002TU\u0005\u001e\u0010\u0002UV\u0007\u0007",
    "\u0002\u0002VW\u0007+\u0002\u0002WX\u0007\b\u0002\u0002Xd\u0003\u0002",
    "\u0002\u0002YZ\u0007\f\u0002\u0002Z[\u0005\f\u0007\u0002[\\\u0007\u0005",
    "\u0002\u0002\\]\u0005\u0014\u000b\u0002]^\u0007\u0007\u0002\u0002^_",
    "\u0005\n\u0006\u0002_`\u0007\u0006\u0002\u0002`a\u0007+\u0002\u0002",
    "ab\u0007\b\u0002\u0002bd\u0003\u0002\u0002\u0002cM\u0003\u0002\u0002",
    "\u0002cY\u0003\u0002\u0002\u0002de\u0003\u0002\u0002\u0002ef\u0007\u0002",
    "\u0002\u0003f\u0007\u0003\u0002\u0002\u0002gh\t\u0002\u0002\u0002hi",
    "\u0007(\u0002\u0002ij\u0007\u0004\u0002\u0002jk\u0005\f\u0007\u0002",
    "kl\u0007\u0005\u0002\u0002lm\u0005\u0014\u000b\u0002mn\u0007\u0010\u0002",
    "\u0002no\u0005$\u0013\u0002op\u0007\b\u0002\u0002pz\u0003\u0002\u0002",
    "\u0002qr\t\u0002\u0002\u0002rs\u0007(\u0002\u0002st\u0007\u0004\u0002",
    "\u0002tu\u0005\f\u0007\u0002uv\u0007\u0005\u0002\u0002vw\u0005\u0014",
    "\u000b\u0002wx\u0007\u0011\u0002\u0002xz\u0003\u0002\u0002\u0002yg\u0003",
    "\u0002\u0002\u0002yq\u0003\u0002\u0002\u0002z{\u0003\u0002\u0002\u0002",
    "{|\u0007\u0002\u0002\u0003|\t\u0003\u0002\u0002\u0002}~\u0007)\u0002",
    "\u0002~\u000b\u0003\u0002\u0002\u0002\u007f\u0080\u0005\u000e\b\u0002",
    "\u0080\u0081\u0007\u0012\u0002\u0002\u0081\u0082\u0005\u0010\t\u0002",
    "\u0082\u0083\u0007\u0012\u0002\u0002\u0083\u0084\u0005\u0012\n\u0002",
    "\u0084\r\u0003\u0002\u0002\u0002\u0085\u0086\u0007*\u0002\u0002\u0086",
    "\u000f\u0003\u0002\u0002\u0002\u0087\u0088\u0007*\u0002\u0002\u0088",
    "\u0011\u0003\u0002\u0002\u0002\u0089\u008a\u0007*\u0002\u0002\u008a",
    "\u0013\u0003\u0002\u0002\u0002\u008b\u008c\u0005\u0016\f\u0002\u008c",
    "\u008d\u0007\u0012\u0002\u0002\u008d\u008e\u0005\u0018\r\u0002\u008e",
    "\u008f\u0007\u0012\u0002\u0002\u008f\u0090\u0005\u001a\u000e\u0002\u0090",
    "\u0091\u0007\u0012\u0002\u0002\u0091\u0092\u0005\u001c\u000f\u0002\u0092",
    "\u0015\u0003\u0002\u0002\u0002\u0093\u0094\u0007*\u0002\u0002\u0094",
    "\u0017\u0003\u0002\u0002\u0002\u0095\u0096\u0007*\u0002\u0002\u0096",
    "\u0019\u0003\u0002\u0002\u0002\u0097\u0098\u0007*\u0002\u0002\u0098",
    "\u001b\u0003\u0002\u0002\u0002\u0099\u009a\t\u0003\u0002\u0002\u009a",
    "\u001d\u0003\u0002\u0002\u0002\u009b\u009c\u0005 \u0011\u0002\u009c",
    "\u009d\u0007\u0005\u0002\u0002\u009d\u009e\u0005\"\u0012\u0002\u009e",
    "\u001f\u0003\u0002\u0002\u0002\u009f\u00a0\t\u0004\u0002\u0002\u00a0",
    "!\u0003\u0002\u0002\u0002\u00a1\u00a2\u0007*\u0002\u0002\u00a2#\u0003",
    "\u0002\u0002\u0002\u00a3\u00a8\u0005&\u0014\u0002\u00a4\u00a5\u0007",
    "\u000b\u0002\u0002\u00a5\u00a7\u0005&\u0014\u0002\u00a6\u00a4\u0003",
    "\u0002\u0002\u0002\u00a7\u00aa\u0003\u0002\u0002\u0002\u00a8\u00a6\u0003",
    "\u0002\u0002\u0002\u00a8\u00a9\u0003\u0002\u0002\u0002\u00a9%\u0003",
    "\u0002\u0002\u0002\u00aa\u00a8\u0003\u0002\u0002\u0002\u00ab\u00b0\u0005",
    "(\u0015\u0002\u00ac\u00ad\u0007\u0005\u0002\u0002\u00ad\u00af\u0005",
    "(\u0015\u0002\u00ae\u00ac\u0003\u0002\u0002\u0002\u00af\u00b2\u0003",
    "\u0002\u0002\u0002\u00b0\u00ae\u0003\u0002\u0002\u0002\u00b0\u00b1\u0003",
    "\u0002\u0002\u0002\u00b1\'\u0003\u0002\u0002\u0002\u00b2\u00b0\u0003",
    "\u0002\u0002\u0002\u00b3\u00b4\u0005*\u0016\u0002\u00b4\u00b5\u0007",
    "\'\u0002\u0002\u00b5\u00b6\u0005,\u0017\u0002\u00b6)\u0003\u0002\u0002",
    "\u0002\u00b7\u00b8\u0007)\u0002\u0002\u00b8+\u0003\u0002\u0002\u0002",
    "\u00b9\u00ba\t\u0005\u0002\u0002\u00ba-\u0003\u0002\u0002\u0002\b1I",
    "cy\u00a8\u00b0"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'RSP-'", "':,'", "','", "':::'", "'::'", "';'",
                     "':;'", "'RSP-TEST:,'", "':'", "'REQ-TEST:,'", "'UNS-'",
                     "'REPT-'", "'REQ-'", "':::::'", "'::::;'", "'-'", "'NST'",
                     "'NDT'", "'AST'", "'ADT'", "'EST'", "'EDT'", "'CST'",
                     "'CDT'", "'MDT'", "'MST'", "'PST'", "'PDT'", "'YST'",
                     "'YDT'", "'HST'", "'HDT'", "'BST'", "'BDT'", "'COMPLD'",
                     "'DENIED'", "'='" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null,
                      null, null, null, null, null, null, null, null, null,
                      null, null, null, null, null, null, null, null, null,
                      null, null, null, null, null, null, null, null, null,
                      null, null, "Mod", "Identifier", "DecimalNumber",
                      "Text", "BinaryData", "WS" ];

var ruleNames =  [ "message", "response", "test", "uns", "sequence", "date",
                   "year", "month", "day", "time", "hour", "minute", "second",
                   "timeZone", "status", "termRept", "errorCode", "block",
                   "parameterBlock", "parameter", "parameterName", "parameterValue" ];

function ApplicationMessageParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

ApplicationMessageParser.prototype = Object.create(antlr4.Parser.prototype);
ApplicationMessageParser.prototype.constructor = ApplicationMessageParser;

Object.defineProperty(ApplicationMessageParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

ApplicationMessageParser.EOF = antlr4.Token.EOF;
ApplicationMessageParser.T__0 = 1;
ApplicationMessageParser.T__1 = 2;
ApplicationMessageParser.T__2 = 3;
ApplicationMessageParser.T__3 = 4;
ApplicationMessageParser.T__4 = 5;
ApplicationMessageParser.T__5 = 6;
ApplicationMessageParser.T__6 = 7;
ApplicationMessageParser.T__7 = 8;
ApplicationMessageParser.T__8 = 9;
ApplicationMessageParser.T__9 = 10;
ApplicationMessageParser.T__10 = 11;
ApplicationMessageParser.T__11 = 12;
ApplicationMessageParser.T__12 = 13;
ApplicationMessageParser.T__13 = 14;
ApplicationMessageParser.T__14 = 15;
ApplicationMessageParser.T__15 = 16;
ApplicationMessageParser.T__16 = 17;
ApplicationMessageParser.T__17 = 18;
ApplicationMessageParser.T__18 = 19;
ApplicationMessageParser.T__19 = 20;
ApplicationMessageParser.T__20 = 21;
ApplicationMessageParser.T__21 = 22;
ApplicationMessageParser.T__22 = 23;
ApplicationMessageParser.T__23 = 24;
ApplicationMessageParser.T__24 = 25;
ApplicationMessageParser.T__25 = 26;
ApplicationMessageParser.T__26 = 27;
ApplicationMessageParser.T__27 = 28;
ApplicationMessageParser.T__28 = 29;
ApplicationMessageParser.T__29 = 30;
ApplicationMessageParser.T__30 = 31;
ApplicationMessageParser.T__31 = 32;
ApplicationMessageParser.T__32 = 33;
ApplicationMessageParser.T__33 = 34;
ApplicationMessageParser.T__34 = 35;
ApplicationMessageParser.T__35 = 36;
ApplicationMessageParser.T__36 = 37;
ApplicationMessageParser.Mod = 38;
ApplicationMessageParser.Identifier = 39;
ApplicationMessageParser.DecimalNumber = 40;
ApplicationMessageParser.Text = 41;
ApplicationMessageParser.BinaryData = 42;
ApplicationMessageParser.WS = 43;

ApplicationMessageParser.RULE_message = 0;
ApplicationMessageParser.RULE_response = 1;
ApplicationMessageParser.RULE_test = 2;
ApplicationMessageParser.RULE_uns = 3;
ApplicationMessageParser.RULE_sequence = 4;
ApplicationMessageParser.RULE_date = 5;
ApplicationMessageParser.RULE_year = 6;
ApplicationMessageParser.RULE_month = 7;
ApplicationMessageParser.RULE_day = 8;
ApplicationMessageParser.RULE_time = 9;
ApplicationMessageParser.RULE_hour = 10;
ApplicationMessageParser.RULE_minute = 11;
ApplicationMessageParser.RULE_second = 12;
ApplicationMessageParser.RULE_timeZone = 13;
ApplicationMessageParser.RULE_status = 14;
ApplicationMessageParser.RULE_termRept = 15;
ApplicationMessageParser.RULE_errorCode = 16;
ApplicationMessageParser.RULE_block = 17;
ApplicationMessageParser.RULE_parameterBlock = 18;
ApplicationMessageParser.RULE_parameter = 19;
ApplicationMessageParser.RULE_parameterName = 20;
ApplicationMessageParser.RULE_parameterValue = 21;

function MessageContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_message;
    return this;
}

MessageContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MessageContext.prototype.constructor = MessageContext;

MessageContext.prototype.response = function() {
    return this.getTypedRuleContext(ResponseContext,0);
};

MessageContext.prototype.test = function() {
    return this.getTypedRuleContext(TestContext,0);
};

MessageContext.prototype.uns = function() {
    return this.getTypedRuleContext(UnsContext,0);
};

MessageContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterMessage(this);
	}
};

MessageContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitMessage(this);
	}
};




ApplicationMessageParser.MessageContext = MessageContext;

ApplicationMessageParser.prototype.message = function() {

    var localctx = new MessageContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, ApplicationMessageParser.RULE_message);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 47;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case ApplicationMessageParser.T__0:
            this.state = 44;
            this.response();
            break;
        case ApplicationMessageParser.T__7:
        case ApplicationMessageParser.T__9:
            this.state = 45;
            this.test();
            break;
        case ApplicationMessageParser.T__10:
        case ApplicationMessageParser.T__11:
        case ApplicationMessageParser.T__12:
            this.state = 46;
            this.uns();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ResponseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_response;
    return this;
}

ResponseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ResponseContext.prototype.constructor = ResponseContext;

ResponseContext.prototype.EOF = function() {
    return this.getToken(ApplicationMessageParser.EOF, 0);
};

ResponseContext.prototype.Mod = function() {
    return this.getToken(ApplicationMessageParser.Mod, 0);
};

ResponseContext.prototype.date = function() {
    return this.getTypedRuleContext(DateContext,0);
};

ResponseContext.prototype.time = function() {
    return this.getTypedRuleContext(TimeContext,0);
};

ResponseContext.prototype.status = function() {
    return this.getTypedRuleContext(StatusContext,0);
};

ResponseContext.prototype.block = function() {
    return this.getTypedRuleContext(BlockContext,0);
};

ResponseContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterResponse(this);
	}
};

ResponseContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitResponse(this);
	}
};




ApplicationMessageParser.ResponseContext = ResponseContext;

ApplicationMessageParser.prototype.response = function() {

    var localctx = new ResponseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, ApplicationMessageParser.RULE_response);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 71;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
        switch(la_) {
        case 1:
            this.state = 49;
            this.match(ApplicationMessageParser.T__0);
            this.state = 50;
            this.match(ApplicationMessageParser.Mod);
            this.state = 51;
            this.match(ApplicationMessageParser.T__1);
            this.state = 52;
            this.date();
            this.state = 53;
            this.match(ApplicationMessageParser.T__2);
            this.state = 54;
            this.time();
            this.state = 55;
            this.match(ApplicationMessageParser.T__3);
            this.state = 56;
            this.status();
            this.state = 57;
            this.match(ApplicationMessageParser.T__4);
            this.state = 58;
            this.block();
            this.state = 59;
            this.match(ApplicationMessageParser.T__5);
            break;

        case 2:
            this.state = 61;
            this.match(ApplicationMessageParser.T__0);
            this.state = 62;
            this.match(ApplicationMessageParser.Mod);
            this.state = 63;
            this.match(ApplicationMessageParser.T__1);
            this.state = 64;
            this.date();
            this.state = 65;
            this.match(ApplicationMessageParser.T__2);
            this.state = 66;
            this.time();
            this.state = 67;
            this.match(ApplicationMessageParser.T__3);
            this.state = 68;
            this.status();
            this.state = 69;
            this.match(ApplicationMessageParser.T__6);
            break;

        }
        this.state = 73;
        this.match(ApplicationMessageParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function TestContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_test;
    return this;
}

TestContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TestContext.prototype.constructor = TestContext;

TestContext.prototype.EOF = function() {
    return this.getToken(ApplicationMessageParser.EOF, 0);
};

TestContext.prototype.date = function() {
    return this.getTypedRuleContext(DateContext,0);
};

TestContext.prototype.time = function() {
    return this.getTypedRuleContext(TimeContext,0);
};

TestContext.prototype.sequence = function() {
    return this.getTypedRuleContext(SequenceContext,0);
};

TestContext.prototype.status = function() {
    return this.getTypedRuleContext(StatusContext,0);
};

TestContext.prototype.Text = function() {
    return this.getToken(ApplicationMessageParser.Text, 0);
};

TestContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterTest(this);
	}
};

TestContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitTest(this);
	}
};




ApplicationMessageParser.TestContext = TestContext;

ApplicationMessageParser.prototype.test = function() {

    var localctx = new TestContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, ApplicationMessageParser.RULE_test);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 97;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case ApplicationMessageParser.T__7:
            this.state = 75;
            this.match(ApplicationMessageParser.T__7);
            this.state = 76;
            this.date();
            this.state = 77;
            this.match(ApplicationMessageParser.T__2);
            this.state = 78;
            this.time();
            this.state = 79;
            this.match(ApplicationMessageParser.T__4);
            this.state = 80;
            this.sequence();
            this.state = 81;
            this.match(ApplicationMessageParser.T__8);
            this.state = 82;
            this.status();
            this.state = 83;
            this.match(ApplicationMessageParser.T__4);
            this.state = 84;
            this.match(ApplicationMessageParser.Text);
            this.state = 85;
            this.match(ApplicationMessageParser.T__5);
            break;
        case ApplicationMessageParser.T__9:
            this.state = 87;
            this.match(ApplicationMessageParser.T__9);
            this.state = 88;
            this.date();
            this.state = 89;
            this.match(ApplicationMessageParser.T__2);
            this.state = 90;
            this.time();
            this.state = 91;
            this.match(ApplicationMessageParser.T__4);
            this.state = 92;
            this.sequence();
            this.state = 93;
            this.match(ApplicationMessageParser.T__3);
            this.state = 94;
            this.match(ApplicationMessageParser.Text);
            this.state = 95;
            this.match(ApplicationMessageParser.T__5);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 99;
        this.match(ApplicationMessageParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function UnsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_uns;
    return this;
}

UnsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
UnsContext.prototype.constructor = UnsContext;

UnsContext.prototype.EOF = function() {
    return this.getToken(ApplicationMessageParser.EOF, 0);
};

UnsContext.prototype.Mod = function() {
    return this.getToken(ApplicationMessageParser.Mod, 0);
};

UnsContext.prototype.date = function() {
    return this.getTypedRuleContext(DateContext,0);
};

UnsContext.prototype.time = function() {
    return this.getTypedRuleContext(TimeContext,0);
};

UnsContext.prototype.block = function() {
    return this.getTypedRuleContext(BlockContext,0);
};

UnsContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterUns(this);
	}
};

UnsContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitUns(this);
	}
};




ApplicationMessageParser.UnsContext = UnsContext;

ApplicationMessageParser.prototype.uns = function() {

    var localctx = new UnsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, ApplicationMessageParser.RULE_uns);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 119;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        switch(la_) {
        case 1:
            this.state = 101;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << ApplicationMessageParser.T__10) | (1 << ApplicationMessageParser.T__11) | (1 << ApplicationMessageParser.T__12))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 102;
            this.match(ApplicationMessageParser.Mod);
            this.state = 103;
            this.match(ApplicationMessageParser.T__1);
            this.state = 104;
            this.date();
            this.state = 105;
            this.match(ApplicationMessageParser.T__2);
            this.state = 106;
            this.time();
            this.state = 107;
            this.match(ApplicationMessageParser.T__13);
            this.state = 108;
            this.block();
            this.state = 109;
            this.match(ApplicationMessageParser.T__5);
            break;

        case 2:
            this.state = 111;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << ApplicationMessageParser.T__10) | (1 << ApplicationMessageParser.T__11) | (1 << ApplicationMessageParser.T__12))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 112;
            this.match(ApplicationMessageParser.Mod);
            this.state = 113;
            this.match(ApplicationMessageParser.T__1);
            this.state = 114;
            this.date();
            this.state = 115;
            this.match(ApplicationMessageParser.T__2);
            this.state = 116;
            this.time();
            this.state = 117;
            this.match(ApplicationMessageParser.T__14);
            break;

        }
        this.state = 121;
        this.match(ApplicationMessageParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SequenceContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_sequence;
    return this;
}

SequenceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SequenceContext.prototype.constructor = SequenceContext;

SequenceContext.prototype.Identifier = function() {
    return this.getToken(ApplicationMessageParser.Identifier, 0);
};

SequenceContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterSequence(this);
	}
};

SequenceContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitSequence(this);
	}
};




ApplicationMessageParser.SequenceContext = SequenceContext;

ApplicationMessageParser.prototype.sequence = function() {

    var localctx = new SequenceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, ApplicationMessageParser.RULE_sequence);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 123;
        this.match(ApplicationMessageParser.Identifier);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DateContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_date;
    return this;
}

DateContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DateContext.prototype.constructor = DateContext;

DateContext.prototype.year = function() {
    return this.getTypedRuleContext(YearContext,0);
};

DateContext.prototype.month = function() {
    return this.getTypedRuleContext(MonthContext,0);
};

DateContext.prototype.day = function() {
    return this.getTypedRuleContext(DayContext,0);
};

DateContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterDate(this);
	}
};

DateContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitDate(this);
	}
};




ApplicationMessageParser.DateContext = DateContext;

ApplicationMessageParser.prototype.date = function() {

    var localctx = new DateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, ApplicationMessageParser.RULE_date);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 125;
        this.year();
        this.state = 126;
        this.match(ApplicationMessageParser.T__15);
        this.state = 127;
        this.month();
        this.state = 128;
        this.match(ApplicationMessageParser.T__15);
        this.state = 129;
        this.day();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function YearContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_year;
    return this;
}

YearContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
YearContext.prototype.constructor = YearContext;

YearContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

YearContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterYear(this);
	}
};

YearContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitYear(this);
	}
};




ApplicationMessageParser.YearContext = YearContext;

ApplicationMessageParser.prototype.year = function() {

    var localctx = new YearContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, ApplicationMessageParser.RULE_year);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 131;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function MonthContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_month;
    return this;
}

MonthContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MonthContext.prototype.constructor = MonthContext;

MonthContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

MonthContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterMonth(this);
	}
};

MonthContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitMonth(this);
	}
};




ApplicationMessageParser.MonthContext = MonthContext;

ApplicationMessageParser.prototype.month = function() {

    var localctx = new MonthContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, ApplicationMessageParser.RULE_month);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 133;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DayContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_day;
    return this;
}

DayContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DayContext.prototype.constructor = DayContext;

DayContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

DayContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterDay(this);
	}
};

DayContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitDay(this);
	}
};




ApplicationMessageParser.DayContext = DayContext;

ApplicationMessageParser.prototype.day = function() {

    var localctx = new DayContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, ApplicationMessageParser.RULE_day);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 135;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function TimeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_time;
    return this;
}

TimeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimeContext.prototype.constructor = TimeContext;

TimeContext.prototype.hour = function() {
    return this.getTypedRuleContext(HourContext,0);
};

TimeContext.prototype.minute = function() {
    return this.getTypedRuleContext(MinuteContext,0);
};

TimeContext.prototype.second = function() {
    return this.getTypedRuleContext(SecondContext,0);
};

TimeContext.prototype.timeZone = function() {
    return this.getTypedRuleContext(TimeZoneContext,0);
};

TimeContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterTime(this);
	}
};

TimeContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitTime(this);
	}
};




ApplicationMessageParser.TimeContext = TimeContext;

ApplicationMessageParser.prototype.time = function() {

    var localctx = new TimeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, ApplicationMessageParser.RULE_time);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 137;
        this.hour();
        this.state = 138;
        this.match(ApplicationMessageParser.T__15);
        this.state = 139;
        this.minute();
        this.state = 140;
        this.match(ApplicationMessageParser.T__15);
        this.state = 141;
        this.second();
        this.state = 142;
        this.match(ApplicationMessageParser.T__15);
        this.state = 143;
        this.timeZone();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function HourContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_hour;
    return this;
}

HourContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
HourContext.prototype.constructor = HourContext;

HourContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

HourContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterHour(this);
	}
};

HourContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitHour(this);
	}
};




ApplicationMessageParser.HourContext = HourContext;

ApplicationMessageParser.prototype.hour = function() {

    var localctx = new HourContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, ApplicationMessageParser.RULE_hour);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 145;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function MinuteContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_minute;
    return this;
}

MinuteContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MinuteContext.prototype.constructor = MinuteContext;

MinuteContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

MinuteContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterMinute(this);
	}
};

MinuteContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitMinute(this);
	}
};




ApplicationMessageParser.MinuteContext = MinuteContext;

ApplicationMessageParser.prototype.minute = function() {

    var localctx = new MinuteContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, ApplicationMessageParser.RULE_minute);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 147;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SecondContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_second;
    return this;
}

SecondContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SecondContext.prototype.constructor = SecondContext;

SecondContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

SecondContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterSecond(this);
	}
};

SecondContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitSecond(this);
	}
};




ApplicationMessageParser.SecondContext = SecondContext;

ApplicationMessageParser.prototype.second = function() {

    var localctx = new SecondContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, ApplicationMessageParser.RULE_second);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 149;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function TimeZoneContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_timeZone;
    return this;
}

TimeZoneContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimeZoneContext.prototype.constructor = TimeZoneContext;


TimeZoneContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterTimeZone(this);
	}
};

TimeZoneContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitTimeZone(this);
	}
};




ApplicationMessageParser.TimeZoneContext = TimeZoneContext;

ApplicationMessageParser.prototype.timeZone = function() {

    var localctx = new TimeZoneContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, ApplicationMessageParser.RULE_timeZone);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 151;
        _la = this._input.LA(1);
        if(!(((((_la - 17)) & ~0x1f) == 0 && ((1 << (_la - 17)) & ((1 << (ApplicationMessageParser.T__16 - 17)) | (1 << (ApplicationMessageParser.T__17 - 17)) | (1 << (ApplicationMessageParser.T__18 - 17)) | (1 << (ApplicationMessageParser.T__19 - 17)) | (1 << (ApplicationMessageParser.T__20 - 17)) | (1 << (ApplicationMessageParser.T__21 - 17)) | (1 << (ApplicationMessageParser.T__22 - 17)) | (1 << (ApplicationMessageParser.T__23 - 17)) | (1 << (ApplicationMessageParser.T__24 - 17)) | (1 << (ApplicationMessageParser.T__25 - 17)) | (1 << (ApplicationMessageParser.T__26 - 17)) | (1 << (ApplicationMessageParser.T__27 - 17)) | (1 << (ApplicationMessageParser.T__28 - 17)) | (1 << (ApplicationMessageParser.T__29 - 17)) | (1 << (ApplicationMessageParser.T__30 - 17)) | (1 << (ApplicationMessageParser.T__31 - 17)) | (1 << (ApplicationMessageParser.T__32 - 17)) | (1 << (ApplicationMessageParser.T__33 - 17)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function StatusContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_status;
    return this;
}

StatusContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StatusContext.prototype.constructor = StatusContext;

StatusContext.prototype.termRept = function() {
    return this.getTypedRuleContext(TermReptContext,0);
};

StatusContext.prototype.errorCode = function() {
    return this.getTypedRuleContext(ErrorCodeContext,0);
};

StatusContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterStatus(this);
	}
};

StatusContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitStatus(this);
	}
};




ApplicationMessageParser.StatusContext = StatusContext;

ApplicationMessageParser.prototype.status = function() {

    var localctx = new StatusContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, ApplicationMessageParser.RULE_status);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 153;
        this.termRept();
        this.state = 154;
        this.match(ApplicationMessageParser.T__2);
        this.state = 155;
        this.errorCode();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function TermReptContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_termRept;
    return this;
}

TermReptContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TermReptContext.prototype.constructor = TermReptContext;


TermReptContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterTermRept(this);
	}
};

TermReptContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitTermRept(this);
	}
};




ApplicationMessageParser.TermReptContext = TermReptContext;

ApplicationMessageParser.prototype.termRept = function() {

    var localctx = new TermReptContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, ApplicationMessageParser.RULE_termRept);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 157;
        _la = this._input.LA(1);
        if(!(_la===ApplicationMessageParser.T__34 || _la===ApplicationMessageParser.T__35)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ErrorCodeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_errorCode;
    return this;
}

ErrorCodeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ErrorCodeContext.prototype.constructor = ErrorCodeContext;

ErrorCodeContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

ErrorCodeContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterErrorCode(this);
	}
};

ErrorCodeContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitErrorCode(this);
	}
};




ApplicationMessageParser.ErrorCodeContext = ErrorCodeContext;

ApplicationMessageParser.prototype.errorCode = function() {

    var localctx = new ErrorCodeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, ApplicationMessageParser.RULE_errorCode);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 159;
        this.match(ApplicationMessageParser.DecimalNumber);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BlockContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_block;
    return this;
}

BlockContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BlockContext.prototype.constructor = BlockContext;

BlockContext.prototype.parameterBlock = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ParameterBlockContext);
    } else {
        return this.getTypedRuleContext(ParameterBlockContext,i);
    }
};

BlockContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterBlock(this);
	}
};

BlockContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitBlock(this);
	}
};




ApplicationMessageParser.BlockContext = BlockContext;

ApplicationMessageParser.prototype.block = function() {

    var localctx = new BlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, ApplicationMessageParser.RULE_block);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 161;
        this.parameterBlock();
        this.state = 166;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===ApplicationMessageParser.T__8) {
            this.state = 162;
            this.match(ApplicationMessageParser.T__8);
            this.state = 163;
            this.parameterBlock();
            this.state = 168;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterBlockContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_parameterBlock;
    return this;
}

ParameterBlockContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterBlockContext.prototype.constructor = ParameterBlockContext;

ParameterBlockContext.prototype.parameter = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ParameterContext);
    } else {
        return this.getTypedRuleContext(ParameterContext,i);
    }
};

ParameterBlockContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterParameterBlock(this);
	}
};

ParameterBlockContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitParameterBlock(this);
	}
};




ApplicationMessageParser.ParameterBlockContext = ParameterBlockContext;

ApplicationMessageParser.prototype.parameterBlock = function() {

    var localctx = new ParameterBlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, ApplicationMessageParser.RULE_parameterBlock);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 169;
        this.parameter();
        this.state = 174;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===ApplicationMessageParser.T__2) {
            this.state = 170;
            this.match(ApplicationMessageParser.T__2);
            this.state = 171;
            this.parameter();
            this.state = 176;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_parameter;
    return this;
}

ParameterContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterContext.prototype.constructor = ParameterContext;

ParameterContext.prototype.parameterName = function() {
    return this.getTypedRuleContext(ParameterNameContext,0);
};

ParameterContext.prototype.parameterValue = function() {
    return this.getTypedRuleContext(ParameterValueContext,0);
};

ParameterContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterParameter(this);
	}
};

ParameterContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitParameter(this);
	}
};




ApplicationMessageParser.ParameterContext = ParameterContext;

ApplicationMessageParser.prototype.parameter = function() {

    var localctx = new ParameterContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, ApplicationMessageParser.RULE_parameter);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 177;
        this.parameterName();
        this.state = 178;
        this.match(ApplicationMessageParser.T__36);
        this.state = 179;
        this.parameterValue();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_parameterName;
    return this;
}

ParameterNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterNameContext.prototype.constructor = ParameterNameContext;

ParameterNameContext.prototype.Identifier = function() {
    return this.getToken(ApplicationMessageParser.Identifier, 0);
};

ParameterNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterParameterName(this);
	}
};

ParameterNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitParameterName(this);
	}
};




ApplicationMessageParser.ParameterNameContext = ParameterNameContext;

ApplicationMessageParser.prototype.parameterName = function() {

    var localctx = new ParameterNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, ApplicationMessageParser.RULE_parameterName);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 181;
        this.match(ApplicationMessageParser.Identifier);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = ApplicationMessageParser.RULE_parameterValue;
    return this;
}

ParameterValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterValueContext.prototype.constructor = ParameterValueContext;

ParameterValueContext.prototype.Identifier = function() {
    return this.getToken(ApplicationMessageParser.Identifier, 0);
};

ParameterValueContext.prototype.DecimalNumber = function() {
    return this.getToken(ApplicationMessageParser.DecimalNumber, 0);
};

ParameterValueContext.prototype.Text = function() {
    return this.getToken(ApplicationMessageParser.Text, 0);
};

ParameterValueContext.prototype.BinaryData = function() {
    return this.getToken(ApplicationMessageParser.BinaryData, 0);
};

ParameterValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.enterParameterValue(this);
	}
};

ParameterValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof ApplicationMessageListener ) {
        listener.exitParameterValue(this);
	}
};




ApplicationMessageParser.ParameterValueContext = ParameterValueContext;

ApplicationMessageParser.prototype.parameterValue = function() {

    var localctx = new ParameterValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, ApplicationMessageParser.RULE_parameterValue);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 183;
        _la = this._input.LA(1);
        if(!(((((_la - 39)) & ~0x1f) == 0 && ((1 << (_la - 39)) & ((1 << (ApplicationMessageParser.Identifier - 39)) | (1 << (ApplicationMessageParser.DecimalNumber - 39)) | (1 << (ApplicationMessageParser.Text - 39)) | (1 << (ApplicationMessageParser.BinaryData - 39)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.ApplicationMessageParser = ApplicationMessageParser;
