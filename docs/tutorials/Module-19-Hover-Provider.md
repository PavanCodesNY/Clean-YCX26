# Module 19: Hover Provider

## Learning Objectives

- ✅ Show information on hover
- ✅ Use Markdown formatting
- ✅ Register hover providers

## Register Hover Provider

```typescript
const provider = vscode.languages.registerHoverProvider('javascript', {
  provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);

    if (word === 'console') {
      return new vscode.Hover(
        new vscode.MarkdownString('**Console API**\n\nUsed for debugging output.')
      );
    }

    return null;
  }
});

context.subscriptions.push(provider);
```

## Markdown in Hovers

```typescript
const markdown = new vscode.MarkdownString();
markdown.appendMarkdown('## Hello\n\n');
markdown.appendMarkdown('This is **bold** and *italic*.\n\n');
markdown.appendCodeblock('console.log("Hi");', 'javascript');

return new vscode.Hover(markdown);
```

## Key Takeaways

1. Use `registerHoverProvider()`
2. Return `Hover` object with `MarkdownString`
3. Return `null` if no hover info available
4. Use Markdown for rich formatting

---

**Previous:** [Module 18: Completion Provider](./Module-18-Completion-Provider.md) | **Next:** [Module 20: Code Actions →](./Module-20-Code-Actions.md)
