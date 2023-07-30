// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { GoParser } from "./golang-parser/golang";
import * as types from "./golang-parser/types";
import { dedent } from "ts-dedent";
import { SELECT_BTN_GETTER, SELECT_BTN_SETTER } from "./constants";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "go-getter-setter" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "go-getter-setter.generate",
    () => {
      const parser = new GoParser();
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const editor = vscode.window.activeTextEditor;
      if (editor === undefined) {
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection);

      let struct: types.Struct;
      try {
        struct = parser.parse(text);
      } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
        return;
      }

      selectGenerateTargets(struct).then((targets) => {
        editor.edit((editBuilder) => {
          let currentLocation = new vscode.Position(selection.end.line, 0);
          if (!text.endsWith("\n")) {
            currentLocation = new vscode.Position(selection.end.line + 1, 0);
          }
          insert(editBuilder, currentLocation, "");

          generate(editBuilder, currentLocation, struct.name, targets);
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function insert(
  editBuilder: vscode.TextEditorEdit,
  location: vscode.Position,
  text: string,
  brCount: number = 1
): void {
  editBuilder.insert(location, text + "\n".repeat(brCount));
}

type GenerateTargets = {
  methods: string[];
  fields: GenerateField[];
};

type GenerateField = {
  name: string;
  type: string;
};

async function selectGenerateTargets(
  struct: types.Struct
): Promise<GenerateTargets> {
  const fieldName2Field = Object.fromEntries(
    struct.fields.map((f) => [f.name, f])
  );

  const methods = await vscode.window.showQuickPick(
    [SELECT_BTN_GETTER, SELECT_BTN_SETTER],
    { canPickMany: true, placeHolder: "select what you want to generate" }
  );
  const fields = await vscode.window.showQuickPick<vscode.QuickPickItem>(
    struct.fields.map((f) => ({ label: f.name, description: f.type })),
    { canPickMany: true, placeHolder: "select what you want to generate" }
  );
  if (methods === undefined || fields === undefined) {
    return <GenerateTargets>{};
  }
  const generateFields = fields.map(
    (field) =>
      <GenerateField>{
        name: field.label,
        type: fieldName2Field[field.label].type,
      }
  );
  return <GenerateTargets>{ methods: methods, fields: generateFields };
}

function generate(
  editBuilder: vscode.TextEditorEdit,
  currentLocation: vscode.Position,
  structName: string,
  targets: GenerateTargets
) {
  for (const item of targets.methods) {
    // Getter
    if (item === SELECT_BTN_GETTER) {
      for (const [i, field] of targets.fields.entries()) {
        insert(
          editBuilder,
          currentLocation,
          dedent(`
					func (${structName[0].toLowerCase()} *${structName}) ${
            field.name[0].toUpperCase() + field.name.slice(1)
          }() ${field.type} {
						return ${structName[0].toLowerCase()}.${field.name}
					}
					`),
          i === targets.fields.length - 1 ? 1 : 2
        );
      }
      if (targets.methods.length === 2) {
        insert(editBuilder, currentLocation, "");
      }
    }
    // Setter
    if (item === SELECT_BTN_SETTER) {
      for (const [i, field] of targets.fields.entries()) {
        insert(
          editBuilder,
          currentLocation,
          dedent(`
					func (${structName[0].toLowerCase()} *${structName}) Set${
            field.name[0].toUpperCase() + field.name.slice(1)
          }(${field.name} ${field.type}) {
						${structName[0].toLowerCase()}.${field.name} = ${field.name}
					}
					`),
          i === targets.fields.length - 1 ? 1 : 2
        );
      }
    }
  }
}
