import * as vscode from 'vscode';

export class Decoration {
    private decoration: vscode.TextEditorDecorationType;
    private searchRegex: RegExp;
    private decorations: vscode.DecorationOptions[];

    constructor(decorationColor: string, search: RegExp) {
        this.decoration = this.createDecorator(decorationColor);
        this.searchRegex = search;
        this.decorations = [];
    }
    
    
    public set (decorations : vscode.DecorationOptions[]) {
        this.decorations = decorations;
    }

    
    public get getDecorations() : vscode.DecorationOptions[] {
        return this.decorations;
    }
    

    public get getDecoration() : vscode.TextEditorDecorationType {
        return this.decoration;
    }

    public get getRegex() : RegExp {
        return this.searchRegex;
    }

    private createDecorator(color: string) {
        return vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: color,
            overviewRulerColor: color,
            overviewRulerLane: vscode.OverviewRulerLane.Left
        });
    }
}