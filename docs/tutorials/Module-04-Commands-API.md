# Module 04: Commands API

## Learning Objectives

By the end of this module, you will:
- ✅ Register custom commands in your extension
- ✅ Execute both custom and built-in VS Code commands
- ✅ Pass arguments to commands
- ✅ Discover available commands
- ✅ Create keyboard shortcuts for commands
- ✅ Add commands to menus

## Prerequisites

- Completed Modules 01-03 (Foundation)
- Have your `hello-world` extension ready

## Why This Module Matters

**Commands are the backbone of VS Code extensions.**

Almost everything in VS Code is a command:
- Saving a file → `workbench.action.files.save`
- Opening settings → `workbench.action.openSettings`
- Formatting code → `editor.action.formatDocument`

Your extension will primarily interact with VS Code through commands.

---

## What is a Command?

### Definition

A command is a **named action** that can be:
- Triggered by users (Command Palette, keyboard shortcut, menu)
- Executed programmatically by your extension
- Executed by other extensions

### Anatomy of a Command

```typescript
'publisher.extensionName.commandName'
│         │            │
│         │            └─ Descriptive name
│         └────────────── Extension identifier
└──────────────────────── Publisher name
```

**Example:** `hello-world.helloWorld`

---

## Registering Commands

### Basic Command Registration

**In package.json** (declare it):
```json
{
  "contributes": {
    "commands": [
      {
        "command": "myExt.greet",
        "title": "Greet User",
        "category": "My Extension"
      }
    ]
  }
}
```

**In extension.ts** (implement it):
```typescript
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('myExt.greet', () => {
    vscode.window.showInformationMessage('Hello, User!');
  });

  context.subscriptions.push(disposable);
}
```

**Result:** Command appears in Command Palette as "My Extension: Greet User"

### Command with Parameters

Commands can accept arguments:

```typescript
const greetCmd = vscode.commands.registerCommand(
  'myExt.greetWithName',
  (name: string) => {
    vscode.window.showInformationMessage(`Hello, ${name}!`);
  }
);
context.subscriptions.push(greetCmd);
```

**Execute with arguments:**
```typescript
vscode.commands.executeCommand('myExt.greetWithName', 'Alice');
// Shows: "Hello, Alice!"
```

### Async Commands

Most commands should be async to handle asynchronous operations:

```typescript
const asyncCmd = vscode.commands.registerCommand(
  'myExt.fetchData',
  async () => {
    const data = await fetch('https://api.example.com/data');
    const json = await data.json();
    vscode.window.showInformationMessage(`Fetched: ${json.title}`);
  }
);
context.subscriptions.push(asyncCmd);
```

---

## Executing Commands

### Execute Your Own Commands

```typescript
// From within your extension
await vscode.commands.executeCommand('myExt.greet');
```

### Execute Built-in VS Code Commands

```typescript
// Save the current file
await vscode.commands.executeCommand('workbench.action.files.save');

// Format the current document
await vscode.commands.executeCommand('editor.action.formatDocument');

// Open settings
await vscode.commands.executeCommand('workbench.action.openSettings');

// Show all commands
await vscode.commands.executeCommand('workbench.action.showCommands');
```

### Execute with Arguments

Many built-in commands accept arguments:

```typescript
// Open a specific file
await vscode.commands.executeCommand(
  'vscode.open',
  vscode.Uri.file('/path/to/file.txt')
);

// Show quick pick
await vscode.commands.executeCommand(
  'workbench.action.quickOpen',
  'text to search'
);

// Set text in editor
await vscode.commands.executeCommand(
  'editor.action.insertSnippet',
  { snippet: 'console.log($1);$0' }
);
```

---

## Discovering Commands

### Get All Available Commands

```typescript
const allCommands = await vscode.commands.getCommands();
console.log(`Total commands: ${allCommands.length}`);
// Returns array of all command IDs
```

### Filter Commands

```typescript
const allCommands = await vscode.commands.getCommands();
const myCommands = allCommands.filter(cmd => cmd.startsWith('myExt.'));
console.log('My commands:', myCommands);
```

### Check if Command Exists

```typescript
const allCommands = await vscode.commands.getCommands();
const exists = allCommands.includes('editor.action.formatDocument');
console.log(`Format command exists: ${exists}`);
```

---

## Keyboard Shortcuts (Keybindings)

### Add Keybinding in package.json

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "myExt.greet",
        "key": "ctrl+shift+g",
        "mac": "cmd+shift+g",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

**Fields:**
- `command` - Command to execute
- `key` - Keyboard shortcut (Windows/Linux)
- `mac` - Keyboard shortcut (macOS)
- `when` - When the keybinding is active (optional)

### Common `when` Contexts

```json
"when": "editorTextFocus"              // Editor has focus
"when": "editorHasSelection"           // Text is selected
"when": "editorLangId == javascript"   // JavaScript file
"when": "!editorReadonly"              // Not read-only
"when": "resourceExtname == .md"       // Markdown file
```

### Multiple Keybindings

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "myExt.greet",
        "key": "ctrl+shift+g",
        "mac": "cmd+shift+g"
      },
      {
        "command": "myExt.goodbye",
        "key": "ctrl+shift+b",
        "mac": "cmd+shift+b"
      }
    ]
  }
}
```

---

## Adding Commands to Menus

### Command Palette

Make command visible/hidden based on context:

```json
{
  "contributes": {
    "menus": {
      "commandPalette": [
        {
          "command": "myExt.greet",
          "when": "editorLangId == javascript"
        }
      ]
    }
  }
}
```

### Editor Context Menu (Right-Click)

```json
{
  "contributes": {
    "menus": {
      "editor/context": [
        {
          "command": "myExt.greet",
          "group": "myGroup@1",
          "when": "editorHasSelection"
        }
      ]
    }
  }
}
```

### Explorer Context Menu

```json
{
  "contributes": {
    "menus": {
      "explorer/context": [
        {
          "command": "myExt.processFile",
          "when": "resourceExtname == .json",
          "group": "2_workspace"
        }
      ]
    }
  }
}
```

### Editor Title Menu (Top-Right Icons)

```json
{
  "contributes": {
    "menus": {
      "editor/title": [
        {
          "command": "myExt.greet",
          "group": "navigation",
          "when": "resourceLangId == markdown"
        }
      ]
    }
  }
}
```

---

## Useful Built-in Commands

### File Operations

```typescript
// Save current file
await vscode.commands.executeCommand('workbench.action.files.save');

// Save all files
await vscode.commands.executeCommand('workbench.action.files.saveAll');

// Close editor
await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

// Open file
await vscode.commands.executeCommand(
  'vscode.open',
  vscode.Uri.file('/path/to/file')
);
```

### Editor Operations

```typescript
// Format document
await vscode.commands.executeCommand('editor.action.formatDocument');

// Go to definition
await vscode.commands.executeCommand('editor.action.revealDefinition');

// Select all
await vscode.commands.executeCommand('editor.action.selectAll');

// Comment line
await vscode.commands.executeCommand('editor.action.commentLine');
```

### Workbench Operations

```typescript
// Show Command Palette
await vscode.commands.executeCommand('workbench.action.showCommands');

// Show Quick Open
await vscode.commands.executeCommand('workbench.action.quickOpen');

// Toggle sidebar
await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');

// Open settings
await vscode.commands.executeCommand('workbench.action.openSettings');
```

---

## Practical Examples

### Example 1: Uppercase Selection

**package.json:**
```json
{
  "contributes": {
    "commands": [{
      "command": "textTools.uppercase",
      "title": "Transform to Uppercase"
    }]
  }
}
```

**extension.ts:**
```typescript
const uppercaseCmd = vscode.commands.registerCommand(
  'textTools.uppercase',
  () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    const uppercased = text.toUpperCase();

    editor.edit(editBuilder => {
      editBuilder.replace(selection, uppercased);
    });
  }
);
context.subscriptions.push(uppercaseCmd);
```

### Example 2: Insert Current Date

```typescript
const insertDateCmd = vscode.commands.registerCommand(
  'myExt.insertDate',
  () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const date = new Date().toLocaleDateString();
    editor.edit(editBuilder => {
      editBuilder.insert(editor.selection.active, date);
    });
  }
);
context.subscriptions.push(insertDateCmd);
```

### Example 3: Open URL

```typescript
const openUrlCmd = vscode.commands.registerCommand(
  'myExt.openDocs',
  () => {
    vscode.env.openExternal(
      vscode.Uri.parse('https://code.visualstudio.com/api')
    );
  }
);
context.subscriptions.push(openUrlCmd);
```

### Example 4: Execute Multiple Commands

```typescript
const saveAndFormatCmd = vscode.commands.registerCommand(
  'myExt.saveAndFormat',
  async () => {
    await vscode.commands.executeCommand('editor.action.formatDocument');
    await vscode.commands.executeCommand('workbench.action.files.save');
    vscode.window.showInformationMessage('Formatted and saved!');
  }
);
context.subscriptions.push(saveAndFormatCmd);
```

---

## Common Patterns

### Pattern 1: Command with User Input

```typescript
const greetCmd = vscode.commands.registerCommand(
  'myExt.greetCustom',
  async () => {
    const name = await vscode.window.showInputBox({
      prompt: 'Enter your name',
      placeHolder: 'John Doe'
    });

    if (name) {
      vscode.window.showInformationMessage(`Hello, ${name}!`);
    }
  }
);
context.subscriptions.push(greetCmd);
```

### Pattern 2: Command with Quick Pick

```typescript
const selectCmd = vscode.commands.registerCommand(
  'myExt.selectAction',
  async () => {
    const choice = await vscode.window.showQuickPick(
      ['Option A', 'Option B', 'Option C'],
      { placeHolder: 'Select an option' }
    );

    if (choice) {
      vscode.window.showInformationMessage(`You selected: ${choice}`);
    }
  }
);
context.subscriptions.push(selectCmd);
```

### Pattern 3: Command with Progress

```typescript
const processCmd = vscode.commands.registerCommand(
  'myExt.processFiles',
  async () => {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Processing files",
      cancellable: true
    }, async (progress, token) => {
      progress.report({ increment: 0 });

      for (let i = 0; i < 100; i++) {
        if (token.isCancellationRequested) {
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 50));
        progress.report({
          increment: 1,
          message: `Processing ${i + 1}/100`
        });
      }
    });
  }
);
context.subscriptions.push(processCmd);
```

---

## Common Mistakes

### ❌ Mistake 1: Command ID Mismatch

```typescript
// package.json
"command": "myExt.greet"

// extension.ts
vscode.commands.registerCommand('myExt.hello', () => {});  // ❌ Different ID!
```

**Fix:** IDs must match exactly.

### ❌ Mistake 2: Forgetting to Add to Subscriptions

```typescript
// ❌ Memory leak!
vscode.commands.registerCommand('myExt.greet', () => {});
```

**Fix:**
```typescript
// ✅ Properly disposed
const cmd = vscode.commands.registerCommand('myExt.greet', () => {});
context.subscriptions.push(cmd);
```

### ❌ Mistake 3: Not Handling Errors

```typescript
// ❌ No error handling
const cmd = vscode.commands.registerCommand('myExt.risky', async () => {
  await riskyOperation();  // What if this fails?
});
```

**Fix:**
```typescript
// ✅ With error handling
const cmd = vscode.commands.registerCommand('myExt.risky', async () => {
  try {
    await riskyOperation();
  } catch (error) {
    vscode.window.showErrorMessage(
      `Operation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});
```

---

## Exercise: Build a Text Transformer

Create commands to transform selected text:

**Task 1: Uppercase Command**

1. Add to package.json:
```json
{
  "contributes": {
    "commands": [{
      "command": "textTools.uppercase",
      "title": "Transform to Uppercase"
    }]
  }
}
```

2. Implement in extension.ts (see Example 1 above)

**Task 2: Lowercase Command**

Add lowercase transformation (similar to uppercase)

**Task 3: Add Keyboard Shortcuts**

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "textTools.uppercase",
        "key": "ctrl+shift+u",
        "mac": "cmd+shift+u",
        "when": "editorHasSelection"
      }
    ]
  }
}
```

**Task 4: Add to Context Menu**

```json
{
  "contributes": {
    "menus": {
      "editor/context": [{
        "command": "textTools.uppercase",
        "group": "1_modification",
        "when": "editorHasSelection"
      }]
    }
  }
}
```

---

## Key Takeaways

1. **Commands are the primary interaction mechanism** in VS Code
2. **Always declare in package.json** and register in extension.ts
3. **IDs must match exactly** between declaration and registration
4. **Use async** for commands that do asynchronous work
5. **Add keybindings and menus** to improve user experience
6. **Always push to subscriptions** to prevent memory leaks
7. **Handle errors** gracefully in command handlers

---

## Next Steps

**Next Module:** [Module 05: Window API](./Module-05-Window-API.md)
- Show messages and dialogs
- User input (input boxes, quick picks)
- Working with editors

---

## Resources

- [Commands API Reference](https://code.visualstudio.com/api/extension-guides/command)
- [Built-in Commands](https://code.visualstudio.com/api/references/commands)
- [When Clause Contexts](https://code.visualstudio.com/api/references/when-clause-contexts)

---

**Previous:** [Module 03: Activation Events](./Module-03-Activation-Events.md) | **Next:** [Module 05: Window API →](./Module-05-Window-API.md)
