const GolangParserAndLexer = require('./parser/golang');

const txt = `
struct {
  hoge string
  fuga int
}
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
