const ParserAndLexer = require('./parser/ts-calculator');

const txt = `1 + `;
const res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);
