
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
%x STRING BSTRING

id                          [a-zA-Z_][a-zA-Z0-9]*
/* integer                     (0|[1-9][0-9]*) TODO */

%%

"//".*                      /* ignore comment */
[\s\t]+                   if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yytext)}`)
/* "\n"                        return 'NEWLINE' */
"struct"                    return 'STRUCT'
"{"                         return 'LBRACE'
"}"                         return 'RBRACE'
"("                         return 'LPAREN'
")"                         return 'RPAREN'
"["                         return 'LBRACKET'
"]"                         return 'RBRACKET'
";"                         return 'SEMICOLON';
","                         return 'COMMA';
"."                         return 'DOT';
\"                        this.begin('STRING');  this.more();
<STRING>[^\"\n]+    this.more();
<STRING>\"       this.begin('INITIAL'); return 'STRING'; 
"`"                        this.begin('BSTRING');  this.more();
<BSTRING>[^"`"\n]+    this.more();
<BSTRING>"`"       this.begin('INITIAL'); return 'BSTRING';
{id}                        return 'IDENT'
/* {integer}                        return 'INT' */
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
        {$$ = "struct {" + $3 + " }" ;}
    ;

FieldList
    : Field
        {$$ = $1 + "; "}
    | Field SEMICOLON
        {$$ = $1 + "; "}
    | Field FieldList
        {$$ = $1 + "; " + $2}
    | Field SEMICOLON FieldList
        {$$ = $1 + "; " + $3}
    ;

Field
    : IdList Type Tag
        {$$ = $1 + " " + $2 + " " + $3}
    | IdList Type
        {$$ = $1 + " " + $2}
    /* | EmbeddedField Tag
        {$$ = $1 + " " + $2 + " " + $3}
    | EmbeddedField
        {$$ = $1 + " " + $2 + " " + $3} */
    ;

/* EmbeddedField
    : ASTER TypeName TypeArgs
        {$$ = $1 + $2 + $3}
    | ASTER TypeName
        {$$ = $1 + $2}
    | TypeName TypeArgs
        {$$ = $1 + $2}
    | TypeName
        {$$ = $1}
    ; */

Id
    : IDENT
        {$$ = yytext}
    ;

IdList
    : Id
        {$$ = $1}
    | Id COMMA IdList
        {$$ = $1 + ", " + $3}
    ;

Tag
    : STRING
        {$$ = yytext}
    | BSTRING
        {$$ = yytext}
    ;

Type
    : TypeName
        {$$ = $1}
    /* | TypeName TypeArgs
        {$$ = $1 + $2} */
    | TypeLit
        {$$ = $1}
    | LPAREN Type RPAREN
        {$$ = $2}
    ;

TypeName
    : Id
        {$$ = yytext}
    /* | QualifiedIdent
        {$$ = $1} */
    ;

/* TypeArgs
    : LBRACKET TypeList RBRACKET
        {$$ = $2}
    | LBRACKET TypeList COMMA RBRACKET
        {$$ = $2}
    ; */

/* TypeList
    : Type
        {$$ = $1}
    | Type COMMA TypeList
        {$$ = $1 + ", " + $3}
    ; */

TypeLit
    /* : ArrayType
        {$$ = $1} */
    : StructType
        {$$ = $1}
    /* | PointerType
    | FunctionType
    | InterfaceType
    | SliceType
    | MapType
    | ChannelType */
    ;

/* ArrayType
    : LBRACKET ArrayLength RBRACKET ElementType
        {$$ = "[" + $2 + "]" + $4}
    ;

ArrayLength
    : INT // TODO
        {$$ = yytext}
    ;

ElementType
    : Type
        {$$ = $1}
    ; */

/* QualifiedIdent
    : PackageName DOT Id
        {$$ = $1 + "." + $3}
    ;

PackageName
    : Id
        {$$ = yytext}
    ; */