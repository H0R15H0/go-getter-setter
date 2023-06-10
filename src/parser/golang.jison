
/* description: Parses and executes mathematical expressions. */
%{
function hexlify (str:string): string {
  return str.split('')
    .map(ch => '0x' + ch.charCodeAt(0).toString(16))
    .join(', ')
}
%}

/* lexical grammar */
%lex
%verbose999           // change to 'verbose' to see lexer decisions
%no-break-if          (.*[^a-z] | '') 'return' ([^a-z].* | '') // elide trailing 'break;'
%x STRING BSTRING COMMENT

id                          [a-zA-Z_][a-zA-Z0-9]*

%%

"//".*                      /* ignore comment */
[\s\t]+                   if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yytext)}`)
/* "\n"                        return 'NEWLINE' */
"struct"                    return 'STRUCT'
"{"                         return 'LBRACE'
"}"                         return 'RBRACE'
";"                         return 'SEMICOLON';
\"                        this.begin('STRING');  this.more();
<STRING>[^\"\n]+    this.more();
<STRING>\"       this.begin('INITIAL'); return 'STRING'; 
"`"                        this.begin('BSTRING');  this.more();
<BSTRING>[^"`"\n]+    this.more();
<BSTRING>"`"       this.begin('INITIAL'); return 'BSTRING'; 
"//"                        this.begin('COMMENT'); this.more();
<COMMENT>\n       this.begin('INITIAL');
{id}                        return 'IDENT'
<<EOF>>                     return 'EOF'

/lex

/* operator associations and precedence */

%start pgm

%% /* language grammar */

pgm
    : StructType EOF
        { if (yy.trace) yy.trace('returning', $1);
          return $1; }
    ;

StructType
    : STRUCT LBRACE FieldList RBRACE
        {$$ = $3;}
    ;

FieldList
    : Field
        {$$ = $1 + "; "}
    | Field FieldList
        {$$ = $1 + "; " + $2}
    ;

Field
    : Id Type Tag SEMICOLON
        {$$ = $1 + " " + $2 + " " + $3}
    | Id Type Tag
        {$$ = $1 + " " + $2 + " " + $3}
    ;

Id
    : IDENT
        {$$ = yytext}
    ;

Type
    : IDENT
        {$$ = yytext}
    ;

Tag
    : STRING
        {$$ = yytext}
    | BSTRING
        {$$ = yytext}
    |
        {$$ = null}
    ;
