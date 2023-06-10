import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType } from '@ts-jison/parser';
/**
 * parser generated by  @ts-jison/parser-generator 0.4.1-alpha.2
 * @returns Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */

function hexlify (str:string): string {
  return str.split('')
    .map(ch => '0x' + ch.charCodeAt(0).toString(16))
    .join(', ')
}

export class GoParser extends JisonParser implements JisonParserApi {
    $?: any;
    symbols_: SymbolsType = {"error":2,"pgm":3,"StructType":4,"EOF":5,"STRUCT":6,"LBRACE":7,"FieldList":8,"RBRACE":9,"Field":10,"Id":11,"Type":12,"ID":13,"$accept":0,"$end":1};
    terminals_: TerminalsType = {2:"error",5:"EOF",6:"STRUCT",7:"LBRACE",9:"RBRACE",13:"ID"};
    productions_: ProductionsType = [0,[3,2],[4,4],[8,1],[8,2],[10,2],[11,1],[12,1]];
    table: Array<StateType>;
    defaultActions: {[key:number]: any} = {4:[2,1],9:[2,6],10:[2,2],11:[2,4]};

    constructor (yy = {}, lexer = new GoLexer(yy)) {
      super(yy, lexer);

      // shorten static method to just `o` for terse STATE_TABLE
      const $V0=[1,9],$V1=[9,13];
      const o = JisonParser.expandParseTable;
      this.table = [{3:1,4:2,6:[1,3]},{1:[3]},{5:[1,4]},{7:[1,5]},{1:[2,1]},{8:6,10:7,11:8,13:$V0},{9:[1,10]},{8:11,9:[2,3],10:7,11:8,13:$V0},{12:12,13:[1,13]},{13:[2,6]},{5:[2,2]},{9:[2,4]},o($V1,[2,5]),o($V1,[2,7])];
    }

    performAction (yytext:string, yyleng:number, yylineno:number, yy:any, yystate:number /* action[1] */, $$:any /* vstack */, _$:any /* lstack */): any {
/* this == yyval */
          var $0 = $$.length - 1;
        switch (yystate) {
case 1:
 if (yy.trace) yy.trace('returning', $$[$0-1]);
          return $$[$0-1]; 
break;
case 2:
this.$ = $$[$0-1];
break;
case 3:
this.$ = $$[$0] + "; "
break;
case 4:
this.$ = $$[$0-1] + "; " + $$[$0]
break;
case 5:
this.$ = $$[$0-1] + " " + $$[$0]
break;
case 6: case 7:
this.$ = yytext
break;
        }
    }
}


/* generated by @ts-jison/lexer-generator 0.4.1-alpha.2 */
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';

export class GoLexer extends JisonLexer implements JisonLexerApi {
    options: any = {"moduleName":"Go"};
    constructor (yy = {}) {
        super(yy);
    }

    rules: RegExp[] = [
        /^(?:\/\/.*)/,
        /^(?:[\s\t]+)/,
        /^(?:struct\b)/,
        /^(?:\{)/,
        /^(?:\})/,
        /^(?:;)/,
        /^(?:[a-zA-Z_][a-zA-Z0-9]*)/,
        /^(?:$)/,
        /^(?:\.)/
    ];
    conditions: any = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8],"inclusive":true}}
    performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
          var YYSTATE=YY_START;
        switch($avoiding_name_collisions) {
    case 0:/* ignore comment */
      break;
    case 1:if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yy_.yytext)}`)
      break;
    case 2:return 6
    case 3:return 7
    case 4:return 9
    case 5:return 'SEMICOLON';
    case 6:return 13
    case 7:return 5
    case 8:throw 'Illegal character';
      break;
        }
    }
}


