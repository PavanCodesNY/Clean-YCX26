# Module 08: Disposables & Memory Management

## Learning Objectives

By the end of this module, you will:
- ✅ Understand what disposables are and why they matter
- ✅ Prevent memory leaks in your extensions
- ✅ Properly clean up resources
- ✅ Use context.subscriptions correctly

## Prerequisites

- Completed Modules 01-07

## Why This Module Matters

**Memory leaks destroy extensions.**

Without proper cleanup:
- ❌ Memory usage grows over time
- ❌ VS Code becomes sluggish
- ❌ Extension gets bad reviews
- ❌ Users uninstall your extension

**With proper cleanup:**
- ✅ Extension runs efficiently
- ✅ VS Code stays fast
- ✅ Users are happy

---

## What are Disposables?

### Definition

A **disposable** is any resource that needs cleanup:
- Event listeners
- Commands
- Status bar items
- File watchers
- Output channels
- Webviews
- Timers and intervals

### The Problem

```typescript
// ❌ BAD - Memory leak!
export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  // Command is registered but never cleaned up
}
```

When the extension deactivates or reloads:
- Command handler still exists in memory
- Event listener still active
- Memory is leaked

### The Solution

```typescript
// ✅ GOOD - Properly disposed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  
  context.subscriptions.push(disposable);
  // VS Code will automatically clean this up
}
```

---

## context.subscriptions

### What is it?

`context.subscriptions` is an array that:
- Stores all disposables
- Automatically disposes them when extension deactivates
- Prevents memory leaks

### How to Use

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Create disposable
  const cmd = vscode.commands.registerCommand('ext.hello', () => {});
  
  // Add to subscriptions
  context.subscriptions.push(cmd);
}
```

**Rule:** ALWAYS push disposables to `context.subscriptions`

---

## Common Disposable Resources

### 1. Commands

```typescript
const cmd = vscode.commands.registerCommand('ext.cmd', () => {});
context.subscriptions.push(cmd);
```

### 2. Event Listeners

```typescript
const listener = vscode.workspace.onDidSaveTextDocument(doc => {
  console.log('Saved:', doc.fileName);
});
context.subscriptions.push(listener);
```

### 3. Status Bar Items

```typescript
const statusBar = vscode.window.createStatusBarItem();
statusBar.text = "Hello";
statusBar.show();
context.subscriptions.push(statusBar);
```

### 4. File Watchers

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
watcher.onDidCreate(uri => console.log('Created:', uri.fsPath));
context.subscriptions.push(watcher);
```

### 5. Output Channels

```typescript
const output = vscode.window.createOutputChannel('My Extension');
output.appendLine('Started');
context.subscriptions.push(output);
```

### 6. Text Decoration Types

```typescript
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'yellow'
});
context.subscriptions.push(decorationType);
```

---

## Manual Disposal

Sometimes you need to dispose resources manually:

```typescript
class MyFeature {
  private statusBar: vscode.StatusBarItem;
  
  constructor(context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem();
    this.statusBar.show();
    
    // Add to subscriptions for automatic cleanup
    context.subscriptions.push(this.statusBar);
  }
  
  dispose() {
    // Manual cleanup if needed
    this.statusBar.dispose();
  }
}
```

---

## Creating Your Own Disposables

```typescript
class MyDisposable implements vscode.Disposable {
  private timer: NodeJS.Timeout;
  
  constructor() {
    this.timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
  }
  
  dispose() {
    clearInterval(this.timer);
    console.log('Disposed');
  }
}

// Usage
export function activate(context: vscode.ExtensionContext) {
  const myDisposable = new MyDisposable();
  context.subscriptions.push(myDisposable);
}
```

---

## Common Patterns

### Pattern 1: Combine Multiple Disposables

```typescript
export function activate(context: vscode.ExtensionContext) {
  const cmd1 = vscode.commands.registerCommand('ext.cmd1', () => {});
  const cmd2 = vscode.commands.registerCommand('ext.cmd2', () => {});
  const statusBar = vscode.window.createStatusBarItem();
  
  // Push multiple at once
  context.subscriptions.push(cmd1, cmd2, statusBar);
}
```

### Pattern 2: Conditional Disposal

```typescript
export function activate(context: vscode.ExtensionContext) {
  let watcher: vscode.FileSystemWatcher | undefined;
  
  const config = vscode.workspace.getConfiguration('myExt');
  if (config.get('enableWatcher')) {
    watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
    context.subscriptions.push(watcher);
  }
}
```

### Pattern 3: Dispose on Command

```typescript
export function activate(context: vscode.ExtensionContext) {
  let statusBar = vscode.window.createStatusBarItem();
  statusBar.text = "Active";
  statusBar.show();
  context.subscriptions.push(statusBar);
  
  const hideCmd = vscode.commands.registerCommand('ext.hide', () => {
    statusBar.dispose();
    statusBar = vscode.window.createStatusBarItem();
    // Create new one if needed
  });
  
  context.subscriptions.push(hideCmd);
}
```

---

## Common Mistakes

### ❌ Mistake 1: Not Pushing to Subscriptions

```typescript
// BAD
vscode.commands.registerCommand('ext.cmd', () => {});
```

**Fix:**
```typescript
// GOOD
const cmd = vscode.commands.registerCommand('ext.cmd', () => {});
context.subscriptions.push(cmd);
```

### ❌ Mistake 2: Creating Resources in Loops Without Disposal

```typescript
// BAD - Creates new watcher on every save!
vscode.workspace.onDidSaveTextDocument(doc => {
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
  // Never disposed!
});
```

**Fix:**
```typescript
// GOOD
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
context.subscriptions.push(watcher);
```

### ❌ Mistake 3: Not Disposing Timers

```typescript
// BAD
setInterval(() => {
  console.log('Tick');
}, 1000);
// Never cleared!
```

**Fix:**
```typescript
// GOOD
class Timer implements vscode.Disposable {
  private interval: NodeJS.Timeout;
  
  constructor() {
    this.interval = setInterval(() => {
      console.log('Tick');
    }, 1000);
  }
  
  dispose() {
    clearInterval(this.interval);
  }
}

const timer = new Timer();
context.subscriptions.push(timer);
```

---

## Exercise

Create an extension that:
1. Registers a command
2. Creates a status bar item
3. Watches for file changes
4. Properly disposes all resources

**Solution:**

```typescript
export function activate(context: vscode.ExtensionContext) {
  // 1. Command
  const cmd = vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  
  // 2. Status bar
  const statusBar = vscode.window.createStatusBarItem();
  statusBar.text = "$(rocket) My Extension";
  statusBar.show();
  
  // 3. File watcher
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
  watcher.onDidCreate(uri => {
    console.log('Created:', uri.fsPath);
  });
  
  // 4. Push all to subscriptions
  context.subscriptions.push(cmd, statusBar, watcher);
}
```

---

## Key Takeaways

1. **ALWAYS push disposables to context.subscriptions**
2. Commands, event listeners, watchers are all disposables
3. Memory leaks occur when disposables aren't cleaned up
4. VS Code automatically disposes items in subscriptions
5. You can create custom disposables with dispose() method
6. When in doubt, add it to subscriptions

---

**Previous:** [Module 07: TextEditor API](./Module-07-TextEditor-API.md) | **Next:** [Module 09: Configuration & Settings →](./Module-09-Configuration-Settings.md)
