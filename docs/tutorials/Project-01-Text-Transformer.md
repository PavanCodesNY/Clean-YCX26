# Project 01: Text Transformer

## Project Overview

Build a complete extension that transforms selected text in multiple ways.

**Features:**
- Uppercase transformation
- Lowercase transformation
- Reverse text
- Keyboard shortcuts
- Context menu integration

## Step 1: Create Extension

```bash
yo code
# Select: New Extension (TypeScript)
# Name: text-transformer
# Accept defaults
cd text-transformer
```

## Step 2: Define Commands (package.json)

```json
{
  "contributes": {
    "commands": [
      {
        "command": "textTransformer.uppercase",
        "title": "Transform to Uppercase"
      },
      {
        "command": "textTransformer.lowercase",
        "title": "Transform to Lowercase"
      },
      {
        "command": "textTransformer.reverse",
        "title": "Reverse Text"
      }
    ],
    "keybindings": [
      {
        "command": "textTransformer.uppercase",
        "key": "ctrl+shift+u",
        "mac": "cmd+shift+u",
        "when": "editorHasSelection"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "when": "editorHasSelection",
          "command": "textTransformer.uppercase",
          "group": "1_modification"
        },
        {
          "when": "editorHasSelection",
          "command": "textTransformer.lowercase",
          "group": "1_modification"
        }
      ]
    }
  }
}
```

## Step 3: Implement Commands (extension.ts)

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Uppercase command
  const uppercaseCmd = vscode.commands.registerCommand(
    'textTransformer.uppercase',
    () => transformSelection(text => text.toUpperCase())
  );

  // Lowercase command
  const lowercaseCmd = vscode.commands.registerCommand(
    'textTransformer.lowercase',
    () => transformSelection(text => text.toLowerCase())
  );

  // Reverse command
  const reverseCmd = vscode.commands.registerCommand(
    'textTransformer.reverse',
    () => transformSelection(text => text.split('').reverse().join(''))
  );

  context.subscriptions.push(uppercaseCmd, lowercaseCmd, reverseCmd);
}

async function transformSelection(transformer: (text: string) => string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  await editor.edit(editBuilder => {
    for (const selection of editor.selections) {
      const text = editor.document.getText(selection);
      const transformed = transformer(text);
      editBuilder.replace(selection, transformed);
    }
  });
}

export function deactivate() {}
```

## Step 4: Test

1. Press F5 to debug
2. Create a new file
3. Type some text and select it
4. Run "Transform to Uppercase" from Command Palette
5. Test keyboard shortcut (Ctrl+Shift+U)
6. Right-click and test context menu

## Step 5: Package

```bash
vsce package
# Creates: text-transformer-0.0.1.vsix
```

## Congratulations!

You've built your first complete VS Code extension!

**Enhancements to try:**
- Add title case transformation
- Add snake_case to camelCase conversion
- Add word count feature
- Add status bar item showing character count

---

**Previous:** [Module 24: Cheatsheet](./Module-24-Common-Patterns-Cheatsheet.md) | **Next:** [Project 02: TODO Tracker →](./Project-02-TODO-Tracker.md)
