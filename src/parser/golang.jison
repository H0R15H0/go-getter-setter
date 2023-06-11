
/* description: Parses and executes mathematical expressions. */
%{
function hexlify (str:string): string {
  return str.split('')
    .map(ch => '0x' + ch.charCodeAt(0).toString(16))
    .join(', ')
}

type Struct = {
    name: string,
    fields: Field[],
}

function makeStruct(structName:string, fields:Field[]): Struct {
    return {name: structName, fields: fields}
}

type Field = {
    name: string,
    type: string,
}

function makeField(fieldName:string, type:string): Field {
    return {name: fieldName, type: type}
}
%}

/* lexical grammar */
%lex
%verbose999           // change to 'verbose' to see lexer decisions
%no-break-if          (.*[^a-z] | '') 'return' ([^a-z].* | '') // elide trailing 'break;'
%x STRING BSTRING DDDTYPE

id                          [a-zA-Z_][a-zA-Z0-9_]*
integer                     [0]|([1-9][0-9]*) /* TODO */

%%

"//".*                      /* ignore comment */
[\s\t]+                   if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yytext)}`)
/* "\n"                        return 'NEWLINE' */
"struct"                    return 'STRUCT'
"type"                      return 'TYPE'
"map"                       return 'MAP'
"chan"                      return 'CHAN'
"func"                      return 'FUNC'
"{"                         return 'LBRACE'
"}"                         return 'RBRACE'
"("                         return 'LPAREN'
")"                         return 'RPAREN'
"["                         return 'LBRACKET'
"]"                         return 'RBRACKET'
";"                         return 'SEMICOLON';
"|"                         return 'VARTICALBAR';
"*"                         return 'ASTER';
"~"                         return 'TILDE';
","                         return 'COMMA';
/* "..."                       return 'DOTDOTDOT'; */
"..."                       this.begin('DDDTYPE'); this.more();
<DDDTYPE>^[a-zA-Z0-9_]+            this.begin('INITIAL'); return 'DDDTYPE'; 
<DDDTYPE>.+               this.more();
"."                         return 'DOT';
"<-"                        return 'LARROW';
\"                        this.begin('STRING');  this.more();
<STRING>[^\"\n]+    this.more();
<STRING>\"       this.begin('INITIAL'); return 'STRING'; 
"`"                        this.begin('BSTRING');  this.more();
<BSTRING>[^"`"\n]+    this.more();
<BSTRING>"`"       this.begin('INITIAL'); return 'BSTRING';
{id}                        return 'IDENT'
0[0-9]*                        throw 'integer must be [0]|([1-9][0-9]*)'
{integer}                        return 'INT'
<<EOF>>                     return 'EOF'

/lex

/* operator associations and precedence */

%start pgm

%% /* language grammar */

pgm
    : TYPE Id StructType EOF
        { if (yy.trace) yy.trace('returning', $1);
          return makeStruct($2, $3 )}
    | TYPE Id TypeParameters StructType EOF
        { if (yy.trace) yy.trace('returning', $1);
          return makeStruct($2+$3, $4)}
    ;

StructType
    : STRUCT LBRACE FieldList RBRACE
        {$$ = $3}
    ;

FieldList
    : Field
        {
            $$ = [$1];
        }
    | Field SEMICOLON
        {
            $$ = [$1];
        }
    | Field FieldList
        {
            $2.push($1);
            $$ = $2
        }
    | Field SEMICOLON FieldList
        {
            $3.push($1);
            $$ = $3
        }
    ;

Field
    : IdList Type Tag
        {$$ = makeField($1, $2)}
    | IdList Type
        {$$ = makeField($1, $2)}
    /* TODO: support embedded field*/
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
    | DDDTYPE // NOTE: Use ...type as identifier to aviod conflict caused by ParameterDecl
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

TypeParameters
    : LBRACKET TypeParamList RBRACKET
        {$$ = "[" + $2 + "]"}
    | LBRACKET TypeParamList COMMA RBRACKET
        {$$ = "[" + $2 + "]"}
    ;

TypeParamList
    : TypeParamDecl
        {$$ = $1}
    | TypeParamList COMMA TypeParamDecl
        {$$ = $1 + " , " + $3}
    ;

TypeParamDecl
    : IdList TypeConstraint
        {$$ = $1 + " " + $2}
    ;

TypeConstraint
    : TypeElem
        {$$ = $1}
    ;

TypeElem
    : TypeTerm
        {$$ = $1}
    | TypeElem VARTICALBAR TypeTerm
        {$$ = $1 + " | " + $3}
    ;

TypeTerm
    : Type
        {$$ = $1}
    | UnderlyingType
        {$$ = $1}
    ;

UnderlyingType
    : TILDE Type
        {$$ = $1 + $2}
    ;

Type
    : TypeName
        {$$ = $1}
    | TypeName TypeArgs
        {$$ = $1 + $2}
    | TypeLit
        {$$ = $1}
    | LPAREN Type RPAREN
        {$$ = $2}
    ;

TypeName
    : Id
        {$$ = $1}
    | QualifiedIdent
        {$$ = $1}
    ;

TypeArgs
    : LBRACKET TypeList RBRACKET
        {$$ = "[" + $2 + "]"}
    | LBRACKET TypeList COMMA RBRACKET
        {$$ = "[" + $2 + "]"}
    ;

TypeList
    : Type
        {$$ = $1}
    | TypeList COMMA Type
        {$$ = $1 + ", " + $3}
    ;

TypeLit
    : ArrayType
        {$$ = $1}
    | StructType
        {$$ = "struct{ " + $1.map((f: Field) => (f.name + " " + f.type)).join(", ") + " }"}
    | PointerType
        {$$ = $1}
    | FunctionType
        {$$ = $1}
    /* | InterfaceType */
    | SliceType
        {$$ = $1}
    | MapType
        {$$ = $1}
    | ChannelType
        {$$ = $1}
    | DDDTYPE
        {$$ = yytext}
    ;

SliceType
    : LBRACKET RBRACKET ElementType
        {$$ = "[]" + $3}
    ;

MapType
    : MAP LBRACKET Type RBRACKET ElementType
        {$$ = "map[" + $3 + "]" + $5}
    ;

ChannelType
    : CHAN ElementType
        {$$ = "chan " + $2}
    | CHAN LARROW ElementType
        {$$ = "chan <-" + $3}
    | LARROW CHAN ElementType
        {$$ = "<-chan " + $3}
    ;

ArrayType
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
    ;

PointerType
    : ASTER BaseType
        {$$ = "*" + $2}
    ;

BaseType
    : Type
        {$$ = $1}
    ;

FunctionType
    : FUNC Signature
        {$$ = $1 + " " + $2}
    ;

Signature
    : Parameters
        {$$ = $1}
    | Parameters Result
        {$$ = $1 + " " + $2}
    ;

Result
    : LPAREN RPAREN
        {$$ = "()"}
    | LPAREN ParameterList RPAREN
        {$$ = "(" + $2 + ")"}
    | LPAREN ParameterList COMMA RPAREN
        {$$ = "(" + $2 + ")"}
    /* TODO: support non paren return */
    ;

Parameters
    : LPAREN RPAREN
        {$$ = "()"}
    | LPAREN ParameterList RPAREN
        {$$ = "(" + $2 + ")"}
    | LPAREN ParameterList COMMA RPAREN
        {$$ = "(" + $2 + ")"}
    ;

ParameterList
    : ParameterDecl
        {$$ = $1}
    | ParameterList COMMA ParameterDecl
        {$$ = $1 + ", " + $3}
    ;

ParameterDecl
    : IdList //NOTE: use IdList instead of Type to aviod conflict
        {$$ = $1}
    | IdList Type
        {$$ = $1 + " " + $2}
    /* | IdList DDDTYPE
        {$$ = $1 + " ..." + $2} */
    /* | DDDTYPE
        {$$ = "..." + $1} */
    ;

QualifiedIdent
    : Id DOT Id //TODO: packagename
        {$$ = $1 + "." + $3}
    ;
