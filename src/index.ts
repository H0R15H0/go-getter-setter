const GolangParserAndLexer = require('./parser/golang');

const txt = `
type user[
  T any,
] struct { // hoge
  name string "Name"; // hoge
  // b hoge.Value \`hgoefae\`
  email *struct{ hoge string } "int"
  age, count (int32) 
  cType pack.Sc[T]
  posts [100]post
  books []int
  comment map[string]int
  // getBook func( string) (string, int)
  // hgoe
} // hgoe
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
