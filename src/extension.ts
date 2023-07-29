// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {GoParser} from "./golang-parser/golang";

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
const parser = new GoParser();
const res = parser.parse(txt);
console.log(txt.trim(), '=', res);


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-getter-setter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-getter-setter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from go-getter-setter!' + res);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
