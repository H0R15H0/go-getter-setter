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

export class TsCalcParser extends JisonParser implements JisonParserApi {
    $?: any;
    symbols_: SymbolsType = {"error":2,"expressions":3,"e":4,"EOF":5,"+":6,"-":7,"*":8,"/":9,"^":10,"!":11,"%":12,"(":13,")":14,"NUMBER":15,"E":16,"PI":17,"$accept":0,"$end":1};
    terminals_: TerminalsType = {2:"error",5:"EOF",6:"+",7:"-",8:"*",9:"/",10:"^",11:"!",12:"%",13:"(",14:")",15:"NUMBER",16:"E",17:"PI"};
    productions_: ProductionsType = [0,[3,2],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,2],[4,3],[4,1],[4,1],[4,1]];
    table: Array<StateType>;
    defaultActions: {[key:number]: any} = {8:[2,1]};

    constructor (yy = {}, lexer = new TsCalcLexer(yy)) {
      super(yy, lexer);

      // shorten static method to just `o` for terse STATE_TABLE
      const $V0=[1,3],$V1=[1,4],$V2=[1,5],$V3=[1,6],$V4=[1,7],$V5=[1,9],$V6=[1,10],$V7=[1,11],$V8=[1,12],$V9=[1,13],$Va=[1,14],$Vb=[1,15],$Vc=[5,6,7,8,9,10,11,12,14],$Vd=[5,6,7,14],$Ve=[5,6,7,8,9,14];
      const o = JisonParser.expandParseTable;
      this.table = [{3:1,4:2,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{1:[3]},{5:[1,8],6:$V5,7:$V6,8:$V7,9:$V8,10:$V9,11:$Va,12:$Vb},{4:16,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{4:17,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},o($Vc,[2,11]),o($Vc,[2,12]),o($Vc,[2,13]),{1:[2,1]},{4:18,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{4:19,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{4:20,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{4:21,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},{4:22,7:$V0,13:$V1,15:$V2,16:$V3,17:$V4},o($Vc,[2,7]),o($Vc,[2,8]),o($Vc,[2,9]),{6:$V5,7:$V6,8:$V7,9:$V8,10:$V9,11:$Va,12:$Vb,14:[1,23]},o($Vd,[2,2],{8:$V7,9:$V8,10:$V9,11:$Va,12:$Vb}),o($Vd,[2,3],{8:$V7,9:$V8,10:$V9,11:$Va,12:$Vb}),o($Ve,[2,4],{10:$V9,11:$Va,12:$Vb}),o($Ve,[2,5],{10:$V9,11:$Va,12:$Vb}),o([5,6,7,8,9,10,14],[2,6],{11:$Va,12:$Vb}),o($Vc,[2,10])];
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
this.$ = $$[$0-2]+$$[$0];
break;
case 3:
this.$ = $$[$0-2]-$$[$0];
break;
case 4:
this.$ = $$[$0-2]*$$[$0];
break;
case 5:
this.$ = $$[$0-2]/$$[$0];
break;
case 6:
this.$ = Math.pow($$[$0-2], $$[$0]);
break;
case 7:

          this.$ = (function fact (n): any { return n==0 ? 1 : fact(n-1) * n })($$[$0-1]);
        
break;
case 8:
this.$ = $$[$0-1]/100;
break;
case 9:
this.$ = -$$[$0];
break;
case 10:
this.$ = $$[$0-1];
break;
case 11:
this.$ = Number(yytext);
break;
case 12:
this.$ = Math.E;
break;
case 13:
this.$ = Math.PI;
break;
        }
    }
}


/* generated by @ts-jison/lexer-generator 0.4.1-alpha.2 */
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';

export class TsCalcLexer extends JisonLexer implements JisonLexerApi {
    options: any = {"moduleName":"TsCalc"};
    constructor (yy = {}) {
        super(yy);
    }

    rules: RegExp[] = [
        /^(?:\s+)/,
        /^(?:[0-9]+(?:\.[0-9]+)?\b)/,
        /^(?:\*)/,
        /^(?:\/)/,
        /^(?:-)/,
        /^(?:\+)/,
        /^(?:\^)/,
        /^(?:!)/,
        /^(?:%)/,
        /^(?:\()/,
        /^(?:\))/,
        /^(?:PI\b)/,
        /^(?:E\b)/,
        /^(?:$)/,
        /^(?:.)/
    ];
    conditions: any = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"inclusive":true}}
    performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
          var YYSTATE=YY_START;
        switch($avoiding_name_collisions) {
    case 0:if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yy_.yytext)}`)
      break;
    case 1:return 15
    case 2:return 8
    case 3:return 9
    case 4:return 7
    case 5:return 6
    case 6:return 10
    case 7:return 11
    case 8:return 12
    case 9:return 13
    case 10:return 14
    case 11:return 17
    case 12:return 16
    case 13:return 5
    case 14:return 'INVALID'
        }
    }
}


