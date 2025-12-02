# Project 02: TODO Tracker

## Project Overview

Build an extension that scans workspace for TODO comments and displays them in a tree view.

**Features:**
- Scan files for TODO/FIXME comments
- Display in custom sidebar view
- Click to jump to TODO location
- Refresh button

## Step 1: Create Extension

```bash
yo code
# Name: todo-tracker
cd todo-tracker
```

## Step 2: Define Tree View (package.json)

```json
{
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "todoTracker.todoView",
          "name": "TODO Tracker"
        }
      ]
    },
    "commands": [
      {
        "command": "todoTracker.refresh",
        "title": "Refresh TODOs",
        "icon": "$(refresh)"
      }
    ],
    "menus": {
      "view/title": [
        {
          "command": "todoTracker.refresh",
          "when": "view == todoTracker.todoView",
          "group": "navigation"
        }
      ]
    }
  }
}
```

## Step 3: Implement Tree Provider

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const todoProvider = new TodoProvider();

  vscode.window.registerTreeDataProvider('todoTracker.todoView', todoProvider);

  const refreshCmd = vscode.commands.registerCommand('todoTracker.refresh', () => {
    todoProvider.refresh();
  });

  context.subscriptions.push(refreshCmd);
}

class TodoProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TodoItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<TodoItem[]> {
    const todos: TodoItem[] = [];
    const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx}', '**/node_modules/**');

    for (const file of files) {
      const doc = await vscode.workspace.openTextDocument(file);
      const text = doc.getText();
      const regex = /\/\/(TODO|FIXME):\s*(.+)/g;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const line = doc.positionAt(match.index).line;
        const todo = new TodoItem(
          match[2],
          match[1],
          file,
          line
        );
        todos.push(todo);
      }
    }

    return todos;
  }
}

class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly type: string,
    public readonly file: vscode.Uri,
    public readonly line: number
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.type}: ${this.label}`;
    this.description = `${path.basename(file.fsPath)}:${line + 1}`;

    this.command = {
      command: 'vscode.open',
      title: 'Open File',
      arguments: [
        file,
        { selection: new vscode.Range(line, 0, line, 0) }
      ]
    };
  }
}
```

## Test

1. Press F5
2. Create files with TODO comments:
```javascript
// TODO: Fix this bug
// FIXME: Refactor this code
```
3. View TODOs in sidebar
4. Click to jump to location

---

**Previous:** [Project 01: Text Transformer](./Project-01-Text-Transformer.md) | **Next:** [Project 03: Status Bar Timer →](./Project-03-Status-Bar-Timer.md)
