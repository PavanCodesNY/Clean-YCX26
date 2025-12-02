# Module 07: TextEditor API

## Learning Objectives

By the end of this module, you will:
- ✅ Get and manipulate text in the active editor
- ✅ Work with selections and ranges
- ✅ Make edits programmatically
- ✅ Control cursor position
- ✅ Work with decorations

## Prerequisites

- Completed Modules 01-06

## Core Concepts

The TextEditor API allows you to:
- Read and modify document text
- Work with selections
- Position the cursor
- Add visual decorations
- Scroll the editor

---

## Getting the Active Editor

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

---

## Working with Selections

### Get Selected Text

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const selection = editor.selection;
const text = editor.document.getText(selection);
console.log('Selected text:', text);
```

### Check if Text is Selected

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

if (editor.selection.isEmpty) {
  console.log('No text selected');
} else {
  console.log('Text is selected');
}
```

### Get Multiple Selections

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

for (const selection of editor.selections) {
  const text = editor.document.getText(selection);
  console.log('Selection:', text);
}
```

---

## Working with Ranges

### Create a Range

```typescript
// Range from line 0, char 0 to line 5, char 10
const range = new vscode.Range(
  new vscode.Position(0, 0),
  new vscode.Position(5, 10)
);
```

### Get Text in Range

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const range = new vscode.Range(0, 0, 5, 10);
const text = editor.document.getText(range);
console.log('Text in range:', text);
```

### Get Full Document Text

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const fullText = editor.document.getText();
console.log('Full document:', fullText);
```

---

## Making Edits

### Replace Text

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

await editor.edit(editBuilder => {
  const selection = editor.selection;
  editBuilder.replace(selection, 'NEW TEXT');
});
```

### Insert Text

```typescript
await editor.edit(editBuilder => {
  const position = editor.selection.active;
  editBuilder.insert(position, 'Hello, World!');
});
```

### Delete Text

```typescript
await editor.edit(editBuilder => {
  const selection = editor.selection;
  editBuilder.delete(selection);
});
```

### Multiple Edits at Once

```typescript
await editor.edit(editBuilder => {
  editBuilder.insert(new vscode.Position(0, 0), '// Header\n');
  editBuilder.replace(new vscode.Range(5, 0, 5, 10), 'REPLACED');
  editBuilder.delete(new vscode.Range(10, 0, 10, 20));
});
```

---

## Cursor Position

### Get Cursor Position

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const position = editor.selection.active;
console.log(`Line: ${position.line}, Character: ${position.character}`);
```

### Set Cursor Position

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const newPosition = new vscode.Position(10, 5);
const newSelection = new vscode.Selection(newPosition, newPosition);
editor.selection = newSelection;
```

### Reveal Position (Scroll to Position)

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const position = new vscode.Position(50, 0);
editor.revealRange(
  new vscode.Range(position, position),
  vscode.TextEditorRevealType.InCenter
);
```

---

## Text Decorations

### Create Decoration Type

```typescript
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'rgba(255, 0, 0, 0.3)',
  border: '2px solid red',
  borderRadius: '3px'
});

// Don't forget to dispose
context.subscriptions.push(decorationType);
```

### Apply Decorations

```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;

const decorations: vscode.DecorationOptions[] = [
  {
    range: new vscode.Range(0, 0, 0, 10),
    hoverMessage: 'This is highlighted!'
  }
];

editor.setDecorations(decorationType, decorations);
```

### Clear Decorations

```typescript
editor.setDecorations(decorationType, []);
```

---

## Practical Examples

### Example 1: Uppercase Selected Text

```typescript
const uppercaseCmd = vscode.commands.registerCommand(
  'myExt.uppercase',
  async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    await editor.edit(editBuilder => {
      for (const selection of editor.selections) {
        const text = editor.document.getText(selection);
        editBuilder.replace(selection, text.toUpperCase());
      }
    });
  }
);

context.subscriptions.push(uppercaseCmd);
```

### Example 2: Insert Date at Cursor

```typescript
const insertDateCmd = vscode.commands.registerCommand(
  'myExt.insertDate',
  async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const date = new Date().toLocaleDateString();
    await editor.edit(editBuilder => {
      editBuilder.insert(editor.selection.active, date);
    });
  }
);

context.subscriptions.push(insertDateCmd);
```

### Example 3: Count Words in Selection

```typescript
const countWordsCmd = vscode.commands.registerCommand(
  'myExt.countWords',
  () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const text = editor.document.getText(editor.selection);
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    vscode.window.showInformationMessage(`Word count: ${wordCount}`);
  }
);

context.subscriptions.push(countWordsCmd);
```

### Example 4: Highlight TODOs

```typescript
const todoDecorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'rgba(255, 255, 0, 0.3)',
  border: '1px solid yellow'
});

function highlightTodos() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const text = editor.document.getText();
  const regex = /TODO:/g;
  const decorations: vscode.DecorationOptions[] = [];

  let match;
  while ((match = regex.exec(text)) !== null) {
    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(match.index + match[0].length);
    decorations.push({
      range: new vscode.Range(startPos, endPos)
    });
  }

  editor.setDecorations(todoDecorationType, decorations);
}

// Call on document change
vscode.workspace.onDidChangeTextDocument(() => {
  highlightTodos();
});

// Call on editor change
vscode.window.onDidChangeActiveTextEditor(() => {
  highlightTodos();
});

context.subscriptions.push(todoDecorationType);
```

---

## Common Patterns

### Pattern: Transform Selection

```typescript
async function transformSelection(transformer: (text: string) => string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  await editor.edit(editBuilder => {
    for (const selection of editor.selections) {
      const text = editor.document.getText(selection);
      const transformed = transformer(text);
      editBuilder.replace(selection, transformed);
    }
  });
}

// Usage
await transformSelection(text => text.toUpperCase());
await transformSelection(text => text.toLowerCase());
await transformSelection(text => text.split('').reverse().join(''));
```

---

## Key Takeaways

1. Use `activeTextEditor` to get the current editor
2. Use `editor.selection` for the primary selection
3. Use `editor.selections` for multiple cursors
4. Use `editor.edit()` to make changes
5. Use decorations to highlight text visually
6. Always check if editor exists before using it

---

**Previous:** [Module 06: Workspace API](./Module-06-Workspace-API.md) | **Next:** [Module 08: Disposables & Memory Management →](./Module-08-Disposables-Memory-Management.md)
