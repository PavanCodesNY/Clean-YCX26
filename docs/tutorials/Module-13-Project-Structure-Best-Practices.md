# Module 13: Project Structure Best Practices

## Learning Objectives

- ✅ Organize extension code effectively
- ✅ Separate concerns
- ✅ Scale your extension

## Core Concepts

Good project structure makes extensions maintainable and scalable.

---

## Recommended Structure

```
my-extension/
├── src/
│   ├── extension.ts          # Entry point
│   ├── commands/             # Command implementations
│   │   ├── helloWorld.ts
│   │   └── processFile.ts
│   ├── providers/            # Language providers
│   │   └── completionProvider.ts
│   ├── utils/                # Utility functions
│   │   └── helpers.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   └── test/                 # Tests
│       └── suite/
├── media/                    # Icons, images
│   └── icon.png
├── package.json
├── tsconfig.json
└── README.md
```

---

## Separation of Concerns

**extension.ts** (Entry point):
```typescript
import { registerCommands } from './commands';
import { registerProviders } from './providers';

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
  registerProviders(context);
}

export function deactivate() {}
```

**commands/index.ts**:
```typescript
export function registerCommands(context: vscode.ExtensionContext) {
  const cmd1 = vscode.commands.registerCommand('ext.cmd1', () => {});
  const cmd2 = vscode.commands.registerCommand('ext.cmd2', () => {});
  context.subscriptions.push(cmd1, cmd2);
}
```

---

## Using Classes for Complex Features

```typescript
class StatusBarManager {
  private statusBar: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem();
    this.statusBar.show();
    context.subscriptions.push(this.statusBar);
  }

  update(text: string) {
    this.statusBar.text = text;
  }

  dispose() {
    this.statusBar.dispose();
  }
}
```

---

## Key Takeaways

1. Separate commands, providers, and utilities
2. Keep extension.ts as the entry point only
3. Use folders to organize related files
4. Use classes for complex features
5. Export functions for registration

---

**Previous:** [Module 12: Testing](./Module-12-Testing-Extensions.md) | **Next:** [Module 14: Status Bar Items →](./Module-14-Status-Bar-Items.md)
