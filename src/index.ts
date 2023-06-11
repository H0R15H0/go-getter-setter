const GolangParserAndLexer = require('./parser/golang');

const txt = `
type hoge struct { // hoge
  a string "hoge"; // hoge
  // b hoge.Value \`hgoefae\`
  email struct{ hoge string } "int"
  age, count (int32) 
  // hgoe
} // hgoe
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
