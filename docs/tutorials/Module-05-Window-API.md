# Module 05: Window API

## Learning Objectives

By the end of this module, you will:
- ✅ Show messages (information, warning, error)
- ✅ Get user input with input boxes and quick picks
- ✅ Work with text editors and documents
- ✅ Create and manage output channels
- ✅ Handle progress indicators

## Prerequisites

- Completed Modules 01-04

## Core Concepts

The Window API provides methods to interact with the VS Code UI:
- Show notifications and dialogs
- Get user input
- Access active editors
- Display custom output
- Show progress to users

---

## Showing Messages

### Information Messages

```typescript
vscode.window.showInformationMessage('Operation completed successfully!');
```

### Warning Messages

```typescript
vscode.window.showWarningMessage('File may be too large!');
```

### Error Messages

```typescript
vscode.window.showErrorMessage('Failed to save file!');
```

### Messages with Actions

```typescript
const result = await vscode.window.showInformationMessage(
  'File has been modified. Save changes?',
  'Save',
  'Discard',
  'Cancel'
);

if (result === 'Save') {
  // Save the file
} else if (result === 'Discard') {
  // Discard changes
}
```

---

## User Input

### Input Box

```typescript
const name = await vscode.window.showInputBox({
  prompt: 'Enter your name',
  placeHolder: 'John Doe',
  value: 'Default value',
  validateInput: (text) => {
    return text.length < 3 ? 'Name must be at least 3 characters' : null;
  }
});

if (name) {
  vscode.window.showInformationMessage(`Hello, ${name}!`);
}
```

### Quick Pick (Simple)

```typescript
const choice = await vscode.window.showQuickPick(
  ['Option A', 'Option B', 'Option C'],
  {
    placeHolder: 'Select an option',
    canPickMany: false
  }
);

if (choice) {
  vscode.window.showInformationMessage(`Selected: ${choice}`);
}
```

### Quick Pick (Advanced)

```typescript
const items: vscode.QuickPickItem[] = [
  {
    label: '$(file) Option 1',
    description: 'First option',
    detail: 'More details about option 1'
  },
  {
    label: '$(folder) Option 2',
    description: 'Second option',
    detail: 'More details about option 2'
  }
];

const selected = await vscode.window.showQuickPick(items, {
  placeHolder: 'Select an option'
});

if (selected) {
  vscode.window.showInformationMessage(`Selected: ${selected.label}`);
}
```

---

## Working with Editors

### Get Active Editor

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) {
  vscode.window.showErrorMessage('No active editor');
  return;
}

// Now you can work with the editor
const document = editor.document;
const selection = editor.selection;
```

### Open a File

```typescript
const document = await vscode.workspace.openTextDocument('/path/to/file.txt');
await vscode.window.showTextDocument(document);
```

### Show Document in Editor

```typescript
await vscode.window.showTextDocument(
  document,
  {
    viewColumn: vscode.ViewColumn.Beside,  // Open to the side
    preserveFocus: false,                   // Give it focus
    preview: false                          // Not a preview tab
  }
);
```

---

## Output Channels

Create custom output channels for logging:

```typescript
const outputChannel = vscode.window.createOutputChannel('My Extension');

// Write to channel
outputChannel.appendLine('Extension started');
outputChannel.appendLine(`Current time: ${new Date().toISOString()}`);

// Show the channel
outputChannel.show();

// Don't forget to dispose
context.subscriptions.push(outputChannel);
```

---

## Progress Indicators

### Notification Progress

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: "Processing files",
  cancellable: true
}, async (progress, token) => {
  progress.report({ increment: 0 });

  for (let i = 0; i < 100; i++) {
    if (token.isCancellationRequested) {
      vscode.window.showWarningMessage('Operation cancelled');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 50));
    progress.report({
      increment: 1,
      message: `Processing ${i + 1}/100`
    });
  }

  vscode.window.showInformationMessage('Processing complete!');
});
```

### Window Progress (Bottom Status Bar)

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Window,
  title: "Loading data..."
}, async (progress) => {
  await loadData();
});
```

---

## Practical Example: File Processor

```typescript
const processCmd = vscode.commands.registerCommand(
  'myExt.processFile',
  async () => {
    // Get active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    // Ask for confirmation
    const choice = await vscode.window.showInformationMessage(
      'Process this file?',
      'Yes',
      'No'
    );

    if (choice !== 'Yes') {
      return;
    }

    // Show progress
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Processing file",
      cancellable: false
    }, async (progress) => {
      progress.report({ increment: 0, message: 'Reading file...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      progress.report({ increment: 50, message: 'Processing...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      progress.report({ increment: 100, message: 'Done!' });
    });

    vscode.window.showInformationMessage('File processed successfully!');
  }
);

context.subscriptions.push(processCmd);
```

---

## Common Patterns

### Pattern: Confirm Before Action

```typescript
const confirmed = await vscode.window.showWarningMessage(
  'This will delete all files. Continue?',
  { modal: true },
  'Yes, delete'
);

if (confirmed === 'Yes, delete') {
  // Perform destructive action
}
```

### Pattern: Multi-Select Quick Pick

```typescript
const selected = await vscode.window.showQuickPick(
  ['Item 1', 'Item 2', 'Item 3'],
  {
    placeHolder: 'Select items',
    canPickMany: true
  }
);

if (selected && selected.length > 0) {
  vscode.window.showInformationMessage(`Selected: ${selected.join(', ')}`);
}
```

---

## Exercise

Create a command that:
1. Shows an input box to get user's name
2. Shows a quick pick to select a greeting style
3. Shows the customized greeting
4. Logs the action to an output channel

---

## Key Takeaways

1. Use `showInformationMessage` for success/info
2. Use `showWarningMessage` for warnings
3. Use `showErrorMessage` for errors
4. Use `showInputBox` for text input
5. Use `showQuickPick` for selections
6. Use `withProgress` for long operations
7. Use output channels for logging

---

**Previous:** [Module 04: Commands API](./Module-04-Commands-API.md) | **Next:** [Module 06: Workspace API →](./Module-06-Workspace-API.md)
