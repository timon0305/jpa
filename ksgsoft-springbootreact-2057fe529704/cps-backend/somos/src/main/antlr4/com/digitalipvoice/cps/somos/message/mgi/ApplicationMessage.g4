grammar ApplicationMessage;

/*
 Application MgiMessage format
*/
message
    :
    (response | test | uns)
    ;

response
    :
    (('RSP-' Mod ':,' date ',' time ':::' status '::' block ';') | ('RSP-' Mod ':,' date ',' time ':::' status ':;')) EOF
    ;

test
    :
    (('RSP-TEST:,' date ',' time '::' sequence ':' status '::' Text ';') | ('REQ-TEST:,' date ',' time '::' sequence ':::' Text ';'))
    EOF
    ;

uns
    :
    ((('UNS-' | 'REPT-' | 'REQ-') Mod ':,' date ',' time ':::::' block ';') | (('UNS-' | 'REPT-' | 'REQ-') Mod ':,' date ',' time '::::;')) EOF
    ;

sequence
    :
    Identifier
    ;

Mod
    :
    'NSR' | 'NSC' | 'RSV' | 'MNQ' | 'CRA' | 'CRC' | 'TRL' | 'TRC' | 'CRQ' | 'CRV' | 'SNA' | 'APR' | 'APP' | 'ACT' | 'DAP' | 'TRN' | 'MRO'
           | 'SCP' | 'BBM' | 'RCH' | 'CRO' | 'ROC' | 'RRO' | 'ASL' | 'GSL' | 'ASI' | 'TEST'
    ;

date
    :
    year '-' month '-' day
    ;

year
    :
    DecimalNumber
    ;  // can be 1xxx, 2xxx year

month
    :
    DecimalNumber
    ;

day
    :
    DecimalNumber
    ;

time
    :
    hour '-' minute '-' second '-' timeZone
    ;

hour
    :
    DecimalNumber
    ;

minute
    :
    DecimalNumber
    ;

second
    :
    DecimalNumber
    ;

timeZone
    :
    'NST' | 'NDT' | 'AST' | 'ADT' | 'EST' | 'EDT' | 'CST' | 'CDT' | 'MDT' | 'MST' | 'PST' | 'PDT' | 'YST' | 'YDT' | 'HST' | 'HDT' | 'BST' | 'BDT'
    ;

status
    :
    termRept ',' errorCode
    ;

termRept
    :
    'COMPLD' | 'DENIED'
    ;

errorCode
    :
    DecimalNumber
    ;

block:
    parameterBlock (':' parameterBlock)*
    ;

parameterBlock
    :
    parameter (',' parameter)*
    ;

parameter
    :
    parameterName '=' parameterValue
    ;

parameterName
    :
    Identifier
    ;

parameterValue
    :
    Identifier | DecimalNumber | Text | BinaryData
    ;

Identifier
    :
    Letter (Digit | Letter)*
    ;

DecimalNumber
    :
    (Digit)+
    ;

Text
    :
    '"' (Letter | Digit | Graphics | ' ')* '"'
    ;

BinaryData
    :
    '$' Byte Byte Byte Byte (Byte)*
    ;

/*
Define basic symbols
*/
fragment
Digit
    :
    [0-9]
    ;

fragment
Letter
    :
    [A-Z]
    ;

fragment
Graphics
    :
    '!' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '[' | ']' | '_' | '`' | '{' | '}' | '|' | '‘'
    ;

fragment
Byte
    :
    '\u0000' .. '\u00FF'
    ;

WS
    :(' '|'\r'|'\t'|'\u000C'|'\n') -> skip
    ;