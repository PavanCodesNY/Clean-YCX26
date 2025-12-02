# Module 11: Debugging Extensions

## Learning Objectives

- ✅ Launch extension in debug mode
- ✅ Set breakpoints
- ✅ Inspect variables
- ✅ Use debug console

## Core Concepts

Debugging is essential for finding and fixing bugs in your extension.

---

## Launch Debug Mode

1. Open your extension project in VS Code
2. Press **F5** (or Run > Start Debugging)
3. Extension Development Host window opens
4. Your extension is loaded and ready to test

---

## Setting Breakpoints

1. Open your `.ts` file
2. Click left of line number (red dot appears)
3. When code hits breakpoint, execution pauses
4. Inspect variables, step through code

---

## Debug Console

```typescript
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');  // Shows in Debug Console
  
  const cmd = vscode.commands.registerCommand('ext.debug', () => {
    console.log('Command executed');
    const data = { name: 'Test', value: 42 };
    console.log('Data:', data);
  });
  
  context.subscriptions.push(cmd);
}
```

**View Debug Console:** `Ctrl+Shift+Y` (macOS: `Cmd+Shift+Y`)

---

## Keyboard Shortcuts

- **F5** - Start debugging
- **Shift+F5** - Stop debugging
- **Ctrl+Shift+F5** - Restart debugging
- **F10** - Step over
- **F11** - Step into
- **Shift+F11** - Step out
- **Ctrl+R** (in Extension Development Host) - Reload extension

---

## Debug Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ],
      "outFiles": [
        "${workspaceFolder}/dist/**/*.js"
      ],
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

---

## Key Takeaways

1. Press F5 to launch Extension Development Host
2. Set breakpoints by clicking left of line numbers
3. Use Debug Console to view console.log output
4. Reload extension with Ctrl+R in Extension Development Host

---

**Previous:** [Module 10: Async/Await](./Module-10-Async-Await-Patterns.md) | **Next:** [Module 12: Testing →](./Module-12-Testing-Extensions.md)
