import * as vscode from 'vscode';

export class LogLighterProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = 
        new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = 
        this._onDidChangeTreeData.event;
  
    data: TreeItem[];
  
    constructor() {
      this.data = [];
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    addTreeItem(searchString: string, color: string): void {
        this.data.push(new TreeItem(searchString, color));
    }
  
    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
      return element;
    }
  
    getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }
  }
  
  class TreeItem extends vscode.TreeItem {
    searchString: RegExp;
    color: string | undefined;
    children: TreeItem[] | undefined;
  
    constructor(label: string, color: string | undefined) {
      super(
          label,
          color === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );
        if (color && typeof color !== 'undefined') {
            this.children = [new TreeItem(color, undefined)];
        }
      this.searchString = new RegExp(label);
      this.color = color;
    }
  }