// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {GoParser} from "./golang-parser/golang";
import * as types from "./golang-parser/types";
import {dedent} from 'ts-dedent';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-getter-setter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-getter-setter.generate', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			return;
		}
    const selection = editor.selection;
		const parser = new GoParser();
		const text = editor.document.getText(selection);

		let struct:types.Struct;
		try {
			struct = parser.parse(text);
		} catch (e: any) {
			vscode.window.showErrorMessage(e.message);
			return;
		}
		editor.edit((editBuilder)=> {
			let currentLocation = new vscode.Position(selection.end.line, 0);
			if (!text.endsWith('\n')) {
				currentLocation = new vscode.Position(selection.end.line + 1, 0);
			}
			insert(editBuilder, currentLocation, '');
			
			// Getter
			for (const [i, field] of struct.fields.entries()) {
				insert(editBuilder, currentLocation, dedent(`
				func (${struct.name[0].toLowerCase()} *${struct.name}) ${field.name[0].toUpperCase() + field.name.slice(1)}() ${field.type} {
					return ${struct.name[0].toLowerCase()}.${field.name}
				}
				`), i === struct.fields.length - 1 ? 1 : 2);
			}
			insert(editBuilder, currentLocation, '');

			// Setter
			for (const [i, field] of struct.fields.entries()) {
				insert(editBuilder, currentLocation, dedent(`
				func (${struct.name[0].toLowerCase()} *${struct.name}) Set${field.name[0].toUpperCase() + field.name.slice(1)}(${field.name} ${field.type}) {
					${struct.name[0].toLowerCase()}.${field.name} = ${field.name}
				}
				`), i === struct.fields.length - 1 ? 1 : 2);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function insert(editBuilder: vscode.TextEditorEdit, location: vscode.Position, text: string, brCount: number = 1): void{
	editBuilder.insert(location, text + '\n'.repeat(brCount));
}