const GolangParserAndLexer = require('./parser/golang');

const txt = `
type hoge[
  T any,
] struct { // hoge
  name string "Name"; // hoge
  // b hoge.Value \`hgoefae\`
  email struct{ hoge string } "int"
  age, count (int32) 
  cType pack.Sc[T]
  // hgoe
} // hgoe
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
