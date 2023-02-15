import * as vscode from 'vscode';

// Decoration test
export const vdi  = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'blue',
	border: '2px solid red',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
});

