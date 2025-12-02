# Module 17: File Watchers

## Learning Objectives

- ✅ Watch for file changes
- ✅ Handle create, change, delete events
- ✅ Use glob patterns

## Create File Watcher

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');

watcher.onDidCreate(uri => {
  console.log('File created:', uri.fsPath);
  vscode.window.showInformationMessage(`Created: ${uri.fsPath}`);
});

watcher.onDidChange(uri => {
  console.log('File changed:', uri.fsPath);
});

watcher.onDidDelete(uri => {
  console.log('File deleted:', uri.fsPath);
});

context.subscriptions.push(watcher);
```

## Glob Patterns

```typescript
// Watch all JavaScript files
'**/*.js'

// Watch all TypeScript files
'**/*.ts'

// Watch specific folder
'src/**/*.ts'

// Watch multiple extensions
'**/*.{js,ts}'

// Watch all files
'**/*'
```

## Watch Document Changes

```typescript
const disposable = vscode.workspace.onDidChangeTextDocument(event => {
  console.log('Document changed:', event.document.fileName);
  console.log('Number of changes:', event.contentChanges.length);
});

context.subscriptions.push(disposable);
```

## Watch Document Save

```typescript
const disposable = vscode.workspace.onDidSaveTextDocument(document => {
  console.log('Document saved:', document.fileName);
  vscode.window.showInformationMessage('File saved!');
});

context.subscriptions.push(disposable);
```

## Key Takeaways

1. Use `createFileSystemWatcher()` with glob patterns
2. Handle onDidCreate, onDidChange, onDidDelete
3. Use `onDidSaveTextDocument` for save events
4. Always add watchers to subscriptions

---

**Previous:** [Module 16: Webviews](./Module-16-Webviews.md) | **Next:** [Module 18: Completion Provider →](./Module-18-Completion-Provider.md)
