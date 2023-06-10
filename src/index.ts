const GolangParserAndLexer = require('./parser/golang');

const txt = `
struct {
  a string "hoge"; // hoge
  b int \`hgoefae\`
  c int32 
}
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
