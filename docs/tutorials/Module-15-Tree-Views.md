# Module 15: Tree Views

## Learning Objectives

- ✅ Create custom sidebar views
- ✅ Implement tree data providers
- ✅ Add refresh functionality
- ✅ Handle clicks and interactions

## Register Tree View in package.json

```json
{
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "myExt.todoView",
          "name": "TODO List"
        }
      ]
    }
  }
}
```

## Tree Data Provider

```typescript
class TodoProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TodoItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TodoItem): Thenable<TodoItem[]> {
    return Promise.resolve([
      new TodoItem('Task 1', vscode.TreeItemCollapsibleState.None),
      new TodoItem('Task 2', vscode.TreeItemCollapsibleState.None)
    ]);
  }
}

class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }
}
```

## Register Tree View

```typescript
const todoProvider = new TodoProvider();
const treeView = vscode.window.createTreeView('myExt.todoView', {
  treeDataProvider: todoProvider
});

context.subscriptions.push(treeView);
```

## Key Takeaways

1. Define view in package.json contributes.views
2. Implement TreeDataProvider interface
3. Use EventEmitter for refresh capability
4. Register with `createTreeView()`

---

**Previous:** [Module 14: Status Bar](./Module-14-Status-Bar-Items.md) | **Next:** [Module 16: Webviews →](./Module-16-Webviews.md)
