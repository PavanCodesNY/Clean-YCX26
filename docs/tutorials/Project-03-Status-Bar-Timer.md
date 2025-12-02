# Project 03: Status Bar Timer

## Project Overview

Build a coding time tracker that shows time spent in each file in the status bar.

**Features:**
- Track time per file
- Display in status bar
- Reset timer
- Persistent storage

## Step 1: Create Extension

```bash
yo code
# Name: code-timer
cd code-timer
```

## Step 2: Implement Timer (extension.ts)

```typescript
import * as vscode from 'vscode';

let statusBar: vscode.StatusBarItem;
let startTime: number;
let totalTime: number = 0;
let currentFile: string | undefined;

export function activate(context: vscode.ExtensionContext) {
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Load saved time
  totalTime = context.globalState.get('totalTime', 0);

  // Start tracking
  startTracking();

  // Track editor changes
  vscode.window.onDidChangeActiveTextEditor(() => {
    startTracking();
  });

  // Save on deactivate
  context.subscriptions.push({
    dispose: () => {
      context.globalState.update('totalTime', totalTime);
    }
  });

  // Reset command
  const resetCmd = vscode.commands.registerCommand('codeTimer.reset', () => {
    totalTime = 0;
    context.globalState.update('totalTime', 0);
    updateStatusBar();
    vscode.window.showInformationMessage('Timer reset!');
  });

  context.subscriptions.push(resetCmd);

  updateStatusBar();
}

function startTracking() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    currentFile = undefined;
    return;
  }

  // Save time from previous file
  if (currentFile && startTime) {
    totalTime += (Date.now() - startTime) / 1000;
  }

  currentFile = editor.document.fileName;
  startTime = Date.now();

  updateStatusBar();
}

function updateStatusBar() {
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);
  const seconds = Math.floor(totalTime % 60);

  statusBar.text = `$(clock) ${hours}h ${minutes}m ${seconds}s`;
  statusBar.tooltip = 'Total coding time';
  statusBar.command = 'codeTimer.reset';
}

// Update every second
setInterval(() => {
  if (currentFile && startTime) {
    updateStatusBar();
  }
}, 1000);

export function deactivate() {}
```

## Test

1. Press F5
2. Open files and switch between them
3. Watch timer in status bar
4. Click to reset

---

**Previous:** [Project 02: TODO Tracker](./Project-02-TODO-Tracker.md) | **Next:** [Resources & Links →](./99-Resources-and-Links.md)
