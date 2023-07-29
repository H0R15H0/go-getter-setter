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
  ch <-chan <-chan int
  getBook func(a, b string, c int, b ...bool) (hoge int, hoge)
  getPost func(string, int, ...bool) (string)
  getBooks func(a, b )
  getPosts func(...string)
  hoge, hoge string
  inter interface{
    hoge(hoge string) (string)
  }
  // hgoe
} // hgoe
`;
const res = new GolangParserAndLexer.GoParser().parse(txt);
console.log(txt.trim(), '=', res);
