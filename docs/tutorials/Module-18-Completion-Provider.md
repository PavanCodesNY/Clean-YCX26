# Module 18: Completion Provider

## Learning Objectives

- ✅ Create IntelliSense completions
- ✅ Register completion providers
- ✅ Build completion items

## Register Completion Provider

```typescript
const provider = vscode.languages.registerCompletionItemProvider(
  'javascript',
  {
    provideCompletionItems(document, position) {
      const completionItems: vscode.CompletionItem[] = [];

      const logCompletion = new vscode.CompletionItem(
        'console.log',
        vscode.CompletionItemKind.Snippet
      );
      logCompletion.insertText = new vscode.SnippetString('console.log($1);$0');
      logCompletion.documentation = 'Log to console';

      completionItems.push(logCompletion);
      return completionItems;
    }
  },
  '.'  // Trigger character
);

context.subscriptions.push(provider);
```

## Completion Item Types

```typescript
vscode.CompletionItemKind.Method
vscode.CompletionItemKind.Function
vscode.CompletionItemKind.Variable
vscode.CompletionItemKind.Class
vscode.CompletionItemKind.Module
vscode.CompletionItemKind.Property
vscode.CompletionItemKind.Snippet
```

## Key Takeaways

1. Use `registerCompletionItemProvider()`
2. Return array of `CompletionItem` objects
3. Use `SnippetString` for snippets with placeholders
4. Specify trigger characters

---

**Previous:** [Module 17: File Watchers](./Module-17-File-Watchers.md) | **Next:** [Module 19: Hover Provider →](./Module-19-Hover-Provider.md)
