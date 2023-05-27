// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Decoration } from './Decoration';
import { LogLighterTree } from './LogLighterTree';

let logDecorators: Decoration[] = [];
let logLighterTree: LogLighterTree;
let regToDecoratorsMap = {};

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

	let addLight = vscode.commands.registerCommand('log-lighter.addLight', async () => {
		vscode.window.showInformationMessage('log-lighter addLight');

		const input = await getTextInput()
					.then((result) => isInputValid(result))
					.catch((error) => { 
						vscode.window.showInformationMessage(error);
						console.log(error);
					});

		if (!input) {
			return;
		}

		const logLight = new Decoration(input[1], RegExp(input[0]));
		decorate(getCurrentEditor(), logLight);

		logLighterTree.addTreeItem(input[0], input[1]);
		logLighterTree.refresh();
	});

	let loglighter = vscode.commands.registerCommand('log-lighter.helloWorld', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from log-lighter!');
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

	decoration.set(decorationsArray);
	editor.setDecorations(decoration.getDecoration, decoration.getDecorations);
}

async function getTextInput(): Promise<string | undefined> {
	const input = await vscode.window.showInputBox({
		placeHolder: "Search query",
		prompt: "LogLine//Color (Case matters)",
	  });

	return input;
}

function isInputValid(input: string | undefined): string[] {
	if (!input) {
		throw Error('Input is not valid; please enter a valid string');
	}

	const splitInput = input?.split('//');
	
	if (splitInput.length < 2) {
		throw Error ('Input is not valid; please enter a valid string');
	}

	return splitInput;
}

function getCurrentEditor(): vscode.TextEditor {
	return vscode.window.visibleTextEditors.filter(editor => editor.document.uri)[0];
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Clean up all decorators :)
	logDecorators.forEach(decorator => {
		// decorator.getDecoration.dispose();
	});
}
