# Module 20: Code Actions

## Learning Objectives

- ✅ Provide quick fixes
- ✅ Add refactoring actions
- ✅ Show light bulb menu

## Register Code Action Provider

```typescript
const provider = vscode.languages.registerCodeActionsProvider('javascript', {
  provideCodeActions(document, range, context, token) {
    const actions: vscode.CodeAction[] = [];

    // Quick fix action
    const fixAction = new vscode.CodeAction(
      'Convert to arrow function',
      vscode.CodeActionKind.QuickFix
    );
    fixAction.command = {
      command: 'myExt.convertToArrow',
      title: 'Convert to arrow function',
      arguments: [document, range]
    };

    actions.push(fixAction);
    return actions;
  }
});

context.subscriptions.push(provider);
```

## Code Action Kinds

```typescript
vscode.CodeActionKind.QuickFix       // Quick fixes
vscode.CodeActionKind.Refactor       // Refactorings
vscode.CodeActionKind.RefactorExtract  // Extract refactorings
vscode.CodeActionKind.RefactorInline   // Inline refactorings
vscode.CodeActionKind.RefactorRewrite  // Rewrite refactorings
vscode.CodeActionKind.Source         // Source actions
```

## Key Takeaways

1. Use `registerCodeActionsProvider()`
2. Return array of `CodeAction` objects
3. Set `CodeActionKind` appropriately
4. Provide command to execute action

---

**Previous:** [Module 19: Hover Provider](./Module-19-Hover-Provider.md) | **Next:** [Module 21: Icons & Branding →](./Module-21-Icons-and-Branding.md)
