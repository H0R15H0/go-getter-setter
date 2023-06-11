const GolangParserAndLexer = require('./parser/golang');

const txt = `
struct { // hoge
  a string "hoge"; // hoge
  // b hoge.Value \`hgoefae\`
  email struct{ hoge string } "int"
  age, count (int32) 
  // hgoe
} // hgoe
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
