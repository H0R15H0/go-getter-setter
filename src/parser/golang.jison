
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

id                          [a-zA-Z_][a-zA-Z0-9]*

%%

"//".*                      /* ignore comment */
[\s\t]+                   if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yytext)}`)
"struct"                    return 'STRUCT'
"{"                         return 'LBRACE'
"}"                         return 'RBRACE'
";"                         return 'SEMICOLON';
{id}                        return 'ID'
<<EOF>>                     return 'EOF'
"."                         throw 'Illegal character';

/lex

/* operator associations and precedence */

/* %left '+' '-'
%left AST '/'
%left '^'
%right '!'
%right '%'
%left UMINUS */

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
    : Id Type
        {$$ = $1 + " " + $2}
    ;

Id
    : ID
        {$$ = yytext}
    ;

Type
    : ID
        {$$ = yytext}
    ;
