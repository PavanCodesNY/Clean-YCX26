# Module 06: Workspace API

## Learning Objectives

By the end of this module, you will:
- ✅ Work with workspace folders
- ✅ Read and write files using the file system API
- ✅ Manage configuration settings
- ✅ Listen to file and workspace events

## Prerequisites

- Completed Modules 01-05

## Core Concepts

The Workspace API provides access to:
- Workspace folders and files
- File system operations
- Configuration (settings)
- Event listeners (file changes, configuration changes, etc.)

---

## Workspace Folders

### Get Workspace Folders

```typescript
const folders = vscode.workspace.workspaceFolders;

if (!folders) {
  vscode.window.showErrorMessage('No workspace folder open');
  return;
}

const firstFolder = folders[0];
console.log('Workspace path:', firstFolder.uri.fsPath);
console.log('Workspace name:', firstFolder.name);
```

### Check if Workspace is Open

```typescript
if (vscode.workspace.workspaceFolders) {
  // Workspace is open
} else {
  // No workspace (single file or empty window)
}
```

---

## File System Operations

### Read File

```typescript
const uri = vscode.Uri.file('/path/to/file.txt');
const fileContent = await vscode.workspace.fs.readFile(uri);
const text = Buffer.from(fileContent).toString('utf8');
console.log('File content:', text);
```

### Write File

```typescript
const uri = vscode.Uri.file('/path/to/file.txt');
const content = Buffer.from('Hello, World!', 'utf8');
await vscode.workspace.fs.writeFile(uri, content);
```

### Check if File Exists

```typescript
try {
  const uri = vscode.Uri.file('/path/to/file.txt');
  await vscode.workspace.fs.stat(uri);
  console.log('File exists');
} catch (error) {
  console.log('File does not exist');
}
```

### Create Directory

```typescript
const uri = vscode.Uri.file('/path/to/new/directory');
await vscode.workspace.fs.createDirectory(uri);
```

### Delete File

```typescript
const uri = vscode.Uri.file('/path/to/file.txt');
await vscode.workspace.fs.delete(uri);
```

### List Directory Contents

```typescript
const uri = vscode.Uri.file('/path/to/directory');
const entries = await vscode.workspace.fs.readDirectory(uri);

for (const [name, type] of entries) {
  if (type === vscode.FileType.File) {
    console.log('File:', name);
  } else if (type === vscode.FileType.Directory) {
    console.log('Directory:', name);
  }
}
```

---

## Working with Documents

### Open Text Document

```typescript
const uri = vscode.Uri.file('/path/to/file.txt');
const document = await vscode.workspace.openTextDocument(uri);
console.log('Document content:', document.getText());
```

### Open Untitled Document

```typescript
const document = await vscode.workspace.openTextDocument({
  content: 'Hello, World!',
  language: 'plaintext'
});
await vscode.window.showTextDocument(document);
```

### Save Document

```typescript
const editor = vscode.window.activeTextEditor;
if (editor) {
  await editor.document.save();
}
```

---

## Configuration (Settings)

### Read Configuration

```typescript
const config = vscode.workspace.getConfiguration('myExtension');

// Get a specific setting
const enabled = config.get<boolean>('enabled', true);
const maxItems = config.get<number>('maxItems', 10);
const theme = config.get<string>('theme', 'dark');

console.log('Enabled:', enabled);
console.log('Max items:', maxItems);
```

### Update Configuration

```typescript
const config = vscode.workspace.getConfiguration('myExtension');

// Update global configuration
await config.update('enabled', false, vscode.ConfigurationTarget.Global);

// Update workspace configuration
await config.update('maxItems', 20, vscode.ConfigurationTarget.Workspace);
```

### Define Configuration in package.json

```json
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "myExtension.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Enable the extension"
        },
        "myExtension.maxItems": {
          "type": "number",
          "default": 10,
          "minimum": 1,
          "maximum": 100,
          "description": "Maximum number of items to show"
        },
        "myExtension.theme": {
          "type": "string",
          "enum": ["light", "dark", "auto"],
          "default": "auto",
          "description": "Theme preference"
        }
      }
    }
  }
}
```

---

## Event Listeners

### Watch for File Changes

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');

watcher.onDidCreate(uri => {
  console.log('File created:', uri.fsPath);
});

watcher.onDidChange(uri => {
  console.log('File changed:', uri.fsPath);
});

watcher.onDidDelete(uri => {
  console.log('File deleted:', uri.fsPath);
});

context.subscriptions.push(watcher);
```

### Watch for Document Changes

```typescript
const disposable = vscode.workspace.onDidChangeTextDocument(event => {
  console.log('Document changed:', event.document.fileName);
  console.log('Changes:', event.contentChanges.length);
});

context.subscriptions.push(disposable);
```

### Watch for Document Save

```typescript
const disposable = vscode.workspace.onDidSaveTextDocument(document => {
  console.log('Document saved:', document.fileName);
});

context.subscriptions.push(disposable);
```

### Watch for Configuration Changes

```typescript
const disposable = vscode.workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('myExtension.enabled')) {
    console.log('Enabled setting changed');
    const config = vscode.workspace.getConfiguration('myExtension');
    const enabled = config.get<boolean>('enabled');
    console.log('New value:', enabled);
  }
});

context.subscriptions.push(disposable);
```

---

## Find Files

### Find Files by Glob Pattern

```typescript
const files = await vscode.workspace.findFiles(
  '**/*.ts',    // Include pattern
  '**/node_modules/**',  // Exclude pattern
  100           // Max results
);

for (const file of files) {
  console.log('Found:', file.fsPath);
}
```

---

## Practical Example: Workspace Scanner

```typescript
const scanCmd = vscode.commands.registerCommand(
  'myExt.scanWorkspace',
  async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    // Find all TypeScript files
    const tsFiles = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**');

    // Count lines
    let totalLines = 0;
    for (const file of tsFiles) {
      const doc = await vscode.workspace.openTextDocument(file);
      totalLines += doc.lineCount;
    }

    vscode.window.showInformationMessage(
      `Found ${tsFiles.length} TypeScript files with ${totalLines} total lines`
    );
  }
);

context.subscriptions.push(scanCmd);
```

---

## Key Takeaways

1. Use `workspace.workspaceFolders` to access workspace folders
2. Use `workspace.fs` for file system operations
3. Use `workspace.getConfiguration()` to read settings
4. Use file watchers to respond to file changes
5. Use `findFiles()` to search for files by pattern
6. Always push watchers to `context.subscriptions`

---

**Previous:** [Module 05: Window API](./Module-05-Window-API.md) | **Next:** [Module 07: TextEditor API →](./Module-07-TextEditor-API.md)
