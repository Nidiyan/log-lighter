// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as decorator from './decorators';

const vdiDecorator = decorator.vdi;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "log-lighter" is now active!');

	// Test decorator here
	vscode.workspace.onDidSaveTextDocument(event => {
		const openEditor = vscode.window.visibleTextEditors.filter(editor => editor.document.uri)[0];
		  decorate(openEditor);
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('log-lighter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from log-lighter!');
	});

	context.subscriptions.push(disposable);
}

function decorate(editor: vscode.TextEditor) {
	let logs = editor.document.getText();
	let regex = /preload: post/;

	const sourceCodeArr = logs.split('\n');

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

	editor.setDecorations(vdiDecorator, decorationsArray);
}

// This method is called when your extension is deactivated
export function deactivate() {}
