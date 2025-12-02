# Module 24: Common Patterns Cheatsheet

## Copy-Paste Ready Code Snippets

### Status Bar Item

```typescript
const statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);
statusBar.text = "$(rocket) My Extension";
statusBar.tooltip = "Click to activate";
statusBar.command = 'myExt.activate';
statusBar.show();
context.subscriptions.push(statusBar);
```

### Quick Pick with Icons

```typescript
const items: vscode.QuickPickItem[] = [
  {
    label: "$(file) Option 1",
    description: "First option",
    detail: "More details"
  },
  {
    label: "$(folder) Option 2",
    description: "Second option"
  }
];

const selected = await vscode.window.showQuickPick(items, {
  placeHolder: 'Select an option'
});
```

### Input Box with Validation

```typescript
const input = await vscode.window.showInputBox({
  prompt: 'Enter value',
  placeHolder: 'Default value',
  validateInput: (text) => {
    return text.length < 3 ? 'Must be at least 3 characters' : null;
  }
});
```

### Progress Indicator

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: "Processing...",
  cancellable: true
}, async (progress, token) => {
  for (let i = 0; i < 100; i++) {
    if (token.isCancellationRequested) break;
    await new Promise(resolve => setTimeout(resolve, 50));
    progress.report({ increment: 1, message: `Step ${i + 1}/100` });
  }
});
```

### File Watcher

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
watcher.onDidCreate(uri => console.log('Created:', uri.fsPath));
watcher.onDidChange(uri => console.log('Changed:', uri.fsPath));
watcher.onDidDelete(uri => console.log('Deleted:', uri.fsPath));
context.subscriptions.push(watcher);
```

### Configuration

```typescript
const config = vscode.workspace.getConfiguration('myExt');
const enabled = config.get<boolean>('enabled', true);
await config.update('enabled', false, vscode.ConfigurationTarget.Global);
```

### Transform Selection

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

await editor.edit(editBuilder => {
  for (const selection of editor.selections) {
    const text = editor.document.getText(selection);
    editBuilder.replace(selection, text.toUpperCase());
  }
});
```

### Output Channel

```typescript
const output = vscode.window.createOutputChannel('My Extension');
output.appendLine('Extension started');
output.show();
context.subscriptions.push(output);
```

---

**Previous:** [Module 23: Publishing](./Module-23-Publishing-to-Marketplace.md) | **Next:** [Project 01: Text Transformer →](./Project-01-Text-Transformer.md)
