// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Decoration } from './Decoration';
import { LogLighterTree } from './LogLighterTree';

let logDecorators: Decoration[] = [];
let logLighterTree: LogLighterTree;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "log-lighter" is now active!');

	// Activate TreeDataProvider
	// This may need to emit/events and then have another component listening
	// log-lighter-view:emit('newSearch')
	// log-lighter-view:listen('newSearch') -> add search object & run search again
	logLighterTree = new LogLighterTree();
	vscode.window.registerTreeDataProvider('log-lighter-view', logLighterTree);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let addLight = vscode.commands.registerCommand('log-lighter.addLight', async () => {
		vscode.window.showInformationMessage('log-lighter addLight');
		const userInput = await vscode.window.showInputBox({ title: "Search String/Color" });
		const searchColorString = userInput ? userInput.split("/") : undefined;

		if (!searchColorString){ 
			return;
		}

		logLighterTree.addTreeItem(searchColorString[0], searchColorString[1]);
		logLighterTree.refresh();
		startDecorations(new RegExp(searchColorString[0]), searchColorString[1]);
	});
}

function startDecorations(string: RegExp, color: string) {
	const openEditor = vscode.window.visibleTextEditors.filter(editor => editor.document.uri)[0];
	const decor = new Decoration(color, string);

	logDecorators.push(decor);
	decorate(openEditor, decor);
}

// Find log line and apply the decoration
// Can use use editor.selection to grab everything from a control f?
// Then you need a map{searchRegex: string -> decorationObj: decorator.Decoration}
function decorate(editor: vscode.TextEditor, decoration: Decoration) {
	let logs = editor.document.getText();
	const sourceCodeArr = logs.split('\n');
	const regex = decoration.getRegex;

	let decorationsArray: vscode.DecorationOptions[] = [];

	for (let line = 0; line < sourceCodeArr.length; line++) {
		let match = sourceCodeArr[line].match(regex);

		if (match !== null && match.index !== undefined) {
			let range = new vscode.Range(
				new vscode.Position(line, 0),
				new vscode.Position(line, sourceCodeArr[line].length)
			);

			let decoration = { range };
			decorationsArray.push(decoration);
		}
	}

	// let test = editor.selection;
	// let test2 = editor.selections;

	decoration.set(decorationsArray);
	editor.setDecorations(decoration.getDecoration, decoration.getDecorations);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Clean up all decorators :)
	logDecorators.forEach(decorator => {
		// decorator.getDecoration.dispose();
	});
}
