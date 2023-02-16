// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Decoration } from './Decoration';
import { LogLighterProvider } from './LogLighterTree';

let logDecorators: Decoration[] = [];
let logLighterProvider: LogLighterProvider;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "log-lighter" is now active!');

	// Activate TreeDataProvider
	// This may need to emit/events and then have another component listening
	// log-lighter-view:emit('newSearch')
	// log-lighter-view:listen('newSearch') -> add search object & run search again
	logLighterProvider = new LogLighterProvider();
	vscode.window.registerTreeDataProvider('log-lighter-view', logLighterProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json5
	let addLight = vscode.commands.registerCommand('log-lighter.addLight', () => {
		vscode.window.showInformationMessage('log-lighter addLight');
		logLighterProvider.addTreeItem('testing', 'blue');
		logLighterProvider.refresh();
	});

	let loglighter = vscode.commands.registerCommand('log-lighter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from log-lighter!');

		const openEditor = vscode.window.visibleTextEditors.filter(editor => editor.document.uri)[0];

		const vdiDecoration = new Decoration('blue', /preload: post/); 
		const nonVDI = new Decoration('red', /preload: host/);

		logDecorators.push(vdiDecoration);
		logDecorators.push(nonVDI);

		decorate(openEditor, vdiDecoration);
		decorate(openEditor, nonVDI);
	});

	context.subscriptions.push(loglighter);
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
