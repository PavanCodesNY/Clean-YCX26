# Module 10: Async/Await Patterns

## Learning Objectives

- ✅ Use async/await in commands
- ✅ Show progress indicators
- ✅ Handle cancellation
- ✅ Manage errors in async code

## Core Concepts

Most extension operations are asynchronous. Use async/await for clean, readable code.

---

## Async Commands

```typescript
const cmd = vscode.commands.registerCommand('ext.async', async () => {
  const data = await fetchData();
  vscode.window.showInformationMessage(`Fetched: ${data}`);
});

context.subscriptions.push(cmd);
```

---

## Progress Indicators

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: "Processing...",
  cancellable: true
}, async (progress, token) => {
  progress.report({ increment: 0 });
  
  for (let i = 0; i < 100; i++) {
    if (token.isCancellationRequested) {
      return;
    }
    
    await delay(50);
    progress.report({ increment: 1, message: `Step ${i + 1}/100` });
  }
});
```

---

## Cancellation Tokens

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: "Processing...",
  cancellable: true
}, async (progress, token) => {
  token.onCancellationRequested(() => {
    console.log('User cancelled');
  });
  
  while (!token.isCancellationRequested) {
    await doWork();
  }
});
```

---

## Error Handling

```typescript
const cmd = vscode.commands.registerCommand('ext.risky', async () => {
  try {
    const result = await riskyOperation();
    vscode.window.showInformationMessage(`Success: ${result}`);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});
```

---

## Key Takeaways

1. Use `async` for commands with async operations
2. Use `withProgress` for long-running operations
3. Support cancellation with tokens
4. Always handle errors with try/catch

---

**Previous:** [Module 09: Configuration](./Module-09-Configuration-Settings.md) | **Next:** [Module 11: Debugging →](./Module-11-Debugging-Extensions.md)
