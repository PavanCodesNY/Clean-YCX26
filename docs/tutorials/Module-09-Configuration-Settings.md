# Module 09: Configuration & Settings

## Learning Objectives

- ✅ Define configuration in package.json
- ✅ Read and update settings
- ✅ Listen for configuration changes
- ✅ Provide user-customizable options

## Core Concepts

Configuration allows users to customize your extension through VS Code settings.

---

## Define Configuration in package.json

```json
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "myExt.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Enable the extension"
        },
        "myExt.maxItems": {
          "type": "number",
          "default": 10,
          "minimum": 1,
          "maximum": 100
        },
        "myExt.theme": {
          "type": "string",
          "enum": ["light", "dark", "auto"],
          "default": "auto"
        },
        "myExt.customPaths": {
          "type": "array",
          "items": { "type": "string" },
          "default": []
        }
      }
    }
  }
}
```

---

## Read Configuration

```typescript
const config = vscode.workspace.getConfiguration('myExt');

const enabled = config.get<boolean>('enabled', true);
const maxItems = config.get<number>('maxItems', 10);
const theme = config.get<string>('theme', 'auto');

console.log('Enabled:', enabled);
```

---

## Update Configuration

```typescript
const config = vscode.workspace.getConfiguration('myExt');

// Update global settings
await config.update('enabled', false, vscode.ConfigurationTarget.Global);

// Update workspace settings
await config.update('maxItems', 20, vscode.ConfigurationTarget.Workspace);
```

---

## Listen for Changes

```typescript
const disposable = vscode.workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('myExt.enabled')) {
    const config = vscode.workspace.getConfiguration('myExt');
    const enabled = config.get<boolean>('enabled');
    console.log('New value:', enabled);
  }
});

context.subscriptions.push(disposable);
```

---

## Key Takeaways

1. Define settings in package.json contributes.configuration
2. Use `workspace.getConfiguration()` to read settings
3. Use `config.update()` to modify settings
4. Listen to changes with `onDidChangeConfiguration`

---

**Previous:** [Module 08: Disposables](./Module-08-Disposables-Memory-Management.md) | **Next:** [Module 10: Async/Await →](./Module-10-Async-Await-Patterns.md)
