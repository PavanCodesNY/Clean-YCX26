# Module 14: Status Bar Items

## Learning Objectives

- ✅ Create status bar items
- ✅ Add icons and tooltips
- ✅ Make them clickable
- ✅ Update dynamically

## Creating a Status Bar Item

```typescript
const statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100  // Priority (higher = more left)
);

statusBar.text = "$(rocket) My Extension";
statusBar.tooltip = "Click to do something";
statusBar.command = 'myExt.statusBarCommand';
statusBar.show();

context.subscriptions.push(statusBar);
```

## Icons

Use Codicons (built-in VS Code icons):

```typescript
statusBar.text = "$(zap) Power";          // Lightning bolt
statusBar.text = "$(file) Files: 10";      // File icon
statusBar.text = "$(check) Success";       // Checkmark
statusBar.text = "$(error) Error";         // Error icon
```

[Full icon list](https://microsoft.github.io/vscode-codicons/dist/codicon.html)

## Dynamic Updates

```typescript
let count = 0;

const statusBar = vscode.window.createStatusBarItem();
statusBar.text = `Count: ${count}`;
statusBar.show();

const incrementCmd = vscode.commands.registerCommand('ext.increment', () => {
  count++;
  statusBar.text = `Count: ${count}`;
});

context.subscriptions.push(statusBar, incrementCmd);
```

## Key Takeaways

1. Use `createStatusBarItem()` to create items
2. Use Codicons for icons: `$(iconName)`
3. Set `command` property to make clickable
4. Call `show()` to display
5. Always add to subscriptions

---

**Previous:** [Module 13: Project Structure](./Module-13-Project-Structure-Best-Practices.md) | **Next:** [Module 15: Tree Views →](./Module-15-Tree-Views.md)
