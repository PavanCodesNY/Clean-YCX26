# Module 16: Webviews

## Learning Objectives

- ✅ Create webview panels
- ✅ Display HTML/CSS/JS in VS Code
- ✅ Communicate between extension and webview
- ✅ Handle security

## Create Webview Panel

```typescript
const panel = vscode.window.createWebviewPanel(
  'myWebview',                    // View type
  'My Webview',                   // Title
  vscode.ViewColumn.One,          // Column
  {
    enableScripts: true,          // Allow JavaScript
    retainContextWhenHidden: true // Keep state when hidden
  }
);

panel.webview.html = getWebviewContent();

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Webview</title>
    </head>
    <body>
      <h1>Hello from Webview!</h1>
      <button onclick="sendMessage()">Click Me</button>
      
      <script>
        const vscode = acquireVsCodeApi();
        
        function sendMessage() {
          vscode.postMessage({
            command: 'alert',
            text: 'Hello from webview!'
          });
        }
      </script>
    </body>
    </html>
  `;
}
```

## Extension ↔ Webview Communication

**From webview to extension:**
```typescript
panel.webview.onDidReceiveMessage(
  message => {
    if (message.command === 'alert') {
      vscode.window.showInformationMessage(message.text);
    }
  },
  undefined,
  context.subscriptions
);
```

**From extension to webview:**
```typescript
panel.webview.postMessage({ command: 'refactor' });
```

**In webview (receive from extension):**
```javascript
window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'refactor') {
    // Handle message
  }
});
```

## Key Takeaways

1. Use `createWebviewPanel()` to create webviews
2. Set HTML with `panel.webview.html`
3. Use `postMessage()` for communication
4. Always enable scripts with `enableScripts: true`
5. Use `acquireVsCodeApi()` in webview for VS Code API

---

**Previous:** [Module 15: Tree Views](./Module-15-Tree-Views.md) | **Next:** [Module 17: File Watchers →](./Module-17-File-Watchers.md)
