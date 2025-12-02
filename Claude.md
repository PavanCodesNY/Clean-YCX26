## 🚨 CRITICAL: Always Research Latest Versions

**Before implementing ANY feature or installing ANY package:**

1. **Search for the LATEST version** of VS Code Extension API and tools
2. **NEVER assume older versions** — always verify current releases
3. **Check breaking changes** between VS Code versions
4. **Use official documentation** for the most recent stable release
5. **Use Context7 to fetch official documentation** for accurate, up-to-date information

**Research pattern:**
```
"VS Code extension API latest 2025"
"VS Code extension [feature] best practices 2025"
"Cursor IDE extension development"
```

**Use Context7 for documentation:**
```
@context7 vscode extension api
@context7 vscode extension manifest
@context7 typescript latest features
```

**If you find a NEWER version than what's in this file:**
- Use the newer version (unless explicitly pinned)
- Check VS Code API migration guides
- Update patterns to match latest best practices

---

## Project Overview

**Goal**: Learn to build VS Code and Cursor IDE extensions from scratch  
**Compatibility**: VS Code, Cursor, Windsurf, VS Code Insiders (all use same Extension API)

---

## Tech Stack

### Core
- **Node.js**: 20+ (Required for extension development)
- **TypeScript**: 5.x (Strongly recommended over JavaScript)
- **VS Code API**: Latest (@types/vscode)

### Development Tools
- **Yeoman**: Extension scaffolding (`yo code`)
- **generator-code**: VS Code extension generator
- **vsce**: Extension packaging and publishing tool
- **esbuild/webpack**: Optional bundling (esbuild recommended for speed)

### Testing
- **Mocha**: Default test framework for VS Code extensions
- **@vscode/test-electron**: For running extension tests

---

## 🎯 Extension Types You Can Build

VS Code extensions can:

1. **Commands** — Add commands to Command Palette (⇧⌘P / Ctrl+Shift+P)
2. **Themes** — Color themes and file icon themes
3. **Language Support** — Syntax highlighting, IntelliSense, snippets
4. **Debuggers** — Debug adapters for specific runtimes
5. **Webviews** — Custom HTML/CSS/JS views inside VS Code
6. **Tree Views** — Custom sidebar panels
7. **Status Bar Items** — Add items to status bar
8. **Decorations** — Text decorations and gutter indicators
9. **Language Servers** — Full language support via LSP
10. **Extension Packs** — Bundle multiple extensions together

---

## Critical: VS Code Extension API (2025)

### VS Code Version
Current stable: **v1.101+** (May 2025 release)
- Monthly release cadence
- New APIs added every month
- Check release notes for breaking changes

### Key Extension API Concepts

**Extension Manifest** (`package.json`):
- Required file at project root
- Defines extension metadata, commands, activation events
- Mix of npm fields and VS Code-specific fields

**Activation Events**:
Extensions activate when specific events occur:
```json
"activationEvents": [
  "onLanguage:javascript",
  "onCommand:extension.sayHello",
  "onView:myView",
  "onStartupFinished",
  "*"  // Activates on startup (not recommended - slows startup)
]
```

**Contribution Points**:
Static declarations in `package.json` that extend VS Code:
- `commands` — Register commands
- `menus` — Add items to menus
- `keybindings` — Define keyboard shortcuts
- `languages` — Declare language support
- `grammars` — Syntax highlighting
- `themes` — Color themes
- `views` — Tree views in sidebar
- `viewsContainers` — Custom sidebar sections

### Latest VS Code API Features (2025)

**New in 2025:**
- MCP (Model Context Protocol) server integration
- Enhanced AI/Copilot integration APIs
- Improved webview communication patterns
- Better extension host performance
- Enhanced testing capabilities

---

## Getting Started: Your First Extension

### Prerequisites
```bash
# Install Node.js 20+
node --version  # Should be 20.x or higher

# Install Yeoman and VS Code Extension Generator
npm install -g yo generator-code

# Or use npx (no global install needed)
npx --package yo --package generator-code -- yo code
```

### Create New Extension
```bash
# Run the generator
yo code

# OR with npx
npx --package yo --package generator-code -- yo code
```

**Generator Options:**
- Extension type: `New Extension (TypeScript)` ← **Recommended**
- Name: `my-first-extension`
- Identifier: `my-first-extension`
- Description: Leave blank or add description
- Initialize git: `Y`
- Bundler: `esbuild` ← **Recommended** (faster than webpack)
- Package manager: `npm`
- Open in VS Code: `Y`

### Project Structure
```
my-first-extension/
├── .vscode/
│   ├── launch.json       # Debug configuration
│   ├── tasks.json        # Build tasks
│   └── extensions.json   # Recommended extensions
├── src/
│   ├── extension.ts      # Main entry point
│   └── test/            # Tests
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript config
├── .vscodeignore         # Files to exclude from package
└── README.md            # Extension documentation
```

---

## Extension Manifest (package.json)

### Essential Fields

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "description": "Extension description",
  "version": "0.0.1",
  "publisher": "your-publisher-name",
  "engines": {
    "vscode": "^1.95.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "extension.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run package",
    "compile": "npm run check-types && node esbuild.js",
    "watch": "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch --project tsconfig.json",
    "package": "npm run check-types && node esbuild.js --production",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/vscode": "^1.95.0",
    "@types/node": "20.x",
    "@typescript-eslint/eslint-plugin": "^7.14.1",
    "@typescript-eslint/parser": "^7.11.0",
    "eslint": "^8.57.0",
    "typescript": "^5.4.5"
  }
}
```

**Key Fields Explained:**
- `engines.vscode` — Minimum VS Code version required
- `activationEvents` — When extension activates
- `main` — Entry point (compiled JS file)
- `contributes` — What the extension adds to VS Code
- `categories` — Marketplace categories (affects discoverability)

**Common Categories:**
- Programming Languages
- Snippets
- Linters
- Themes
- Debuggers
- Formatters
- Testing
- Data Science
- Machine Learning
- Visualization

---

## Extension Entry Point (extension.ts)

### Basic Structure

```typescript
import * as vscode from 'vscode';

// This function is called when extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension is now active!');

  // Register a command
  let disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello from VS Code!');
    }
  );

  // Add to subscriptions for cleanup
  context.subscriptions.push(disposable);
}

// This function is called when extension is deactivated
export function deactivate() {
  // Cleanup if needed
}
```

### ExtensionContext

The `context` object provides:
- `subscriptions` — Array for disposables (cleaned up on deactivate)
- `extensionPath` — Path to extension directory
- `storagePath` — Path for persistent storage
- `globalStoragePath` — Path for global storage
- `logPath` — Path for log files
- `extensionUri` — URI of extension
- `secrets` — Secure credential storage
- `workspaceState` — Workspace-specific storage
- `globalState` — Global storage across workspaces

---

## Common Extension Patterns

### 1. Command Registration

```typescript
// Simple command
const helloCmd = vscode.commands.registerCommand('extension.hello', () => {
  vscode.window.showInformationMessage('Hello!');
});
context.subscriptions.push(helloCmd);

// Command with arguments
const openFileCmd = vscode.commands.registerCommand(
  'extension.openFile',
  (uri: vscode.Uri) => {
    vscode.window.showTextDocument(uri);
  }
);
context.subscriptions.push(openFileCmd);
```

### 2. Status Bar Items

```typescript
const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);
statusBarItem.text = "$(zap) My Extension";
statusBarItem.tooltip = "Click me!";
statusBarItem.command = 'extension.myCommand';
statusBarItem.show();
context.subscriptions.push(statusBarItem);
```

### 3. Configuration (Settings)

**In package.json:**
```json
"contributes": {
  "configuration": {
    "title": "My Extension",
    "properties": {
      "myExtension.enable": {
        "type": "boolean",
        "default": true,
        "description": "Enable the extension"
      }
    }
  }
}
```

**In extension.ts:**
```typescript
const config = vscode.workspace.getConfiguration('myExtension');
const isEnabled = config.get<boolean>('enable', true);

// Update configuration
await config.update('enable', false, vscode.ConfigurationTarget.Global);
```

### 4. Text Document Manipulation

```typescript
const editor = vscode.window.activeTextEditor;
if (editor) {
  const document = editor.document;
  const selection = editor.selection;
  const text = document.getText(selection);
  
  // Make edits
  editor.edit(editBuilder => {
    editBuilder.replace(selection, text.toUpperCase());
  });
}
```

### 5. Webviews

```typescript
const panel = vscode.window.createWebviewPanel(
  'myWebview',
  'My Webview',
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
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
    </head>
    <body>
      <h1>Hello from Webview!</h1>
      <button onclick="sendMessage()">Click Me</button>
      <script>
        const vscode = acquireVsCodeApi();
        function sendMessage() {
          vscode.postMessage({ command: 'alert', text: 'Hello!' });
        }
      </script>
    </body>
    </html>
  `;
}

// Handle messages from webview
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

---

## Debugging Your Extension

### Run Extension in Debug Mode

1. Press **F5** or **Run > Start Debugging**
2. This opens a new "Extension Development Host" window
3. Your extension is loaded in this window
4. Set breakpoints in your TypeScript code
5. Test your commands in the Command Palette

### Debug Configuration (.vscode/launch.json)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ],
      "outFiles": [
        "${workspaceFolder}/dist/**/*.js"
      ],
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

---

## Testing Extensions

### Test Structure

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
```

### Run Tests
```bash
npm run test
```

---

## Publishing Your Extension

### Package Extension

```bash
# Install vsce
npm install -g @vscode/vsce

# Package extension
vsce package
# Creates: my-extension-0.0.1.vsix
```

### Create Publisher

1. Go to https://marketplace.visualstudio.com/manage
2. Create a publisher account
3. Get a Personal Access Token (PAT) from Azure DevOps

### Publish

```bash
# Login
vsce login your-publisher-name

# Publish
vsce publish

# Or publish with version bump
vsce publish patch  # 0.0.1 -> 0.0.2
vsce publish minor  # 0.0.1 -> 0.1.0
vsce publish major  # 0.0.1 -> 1.0.0
```

---

## Cursor IDE Compatibility

**Good News**: Cursor is built on VS Code (fork), so:
- ✅ All VS Code extensions work in Cursor
- ✅ Same Extension API
- ✅ Same `package.json` manifest
- ✅ Same debugging workflow
- ✅ Publish once, works everywhere

**Cursor-Specific Notes:**
- Cursor uses VS Code Extension Marketplace
- Extensions install the same way as VS Code
- Activity bar layout may differ slightly
- Test in both VS Code and Cursor during development

**Compatible Editors:**
- VS Code
- VS Code Insiders
- Cursor
- Windsurf
- VSCodium

---

## VS Code API Resources

### Essential APIs

**Window API:**
```typescript
vscode.window.showInformationMessage('Info');
vscode.window.showWarningMessage('Warning');
vscode.window.showErrorMessage('Error');
vscode.window.showQuickPick(['Option 1', 'Option 2']);
vscode.window.showInputBox({ prompt: 'Enter value' });
vscode.window.createStatusBarItem();
vscode.window.createWebviewPanel();
vscode.window.activeTextEditor;
```

**Workspace API:**
```typescript
vscode.workspace.workspaceFolders;
vscode.workspace.getConfiguration('myExt');
vscode.workspace.openTextDocument(uri);
vscode.workspace.fs.readFile(uri);
vscode.workspace.onDidChangeConfiguration();
vscode.workspace.onDidSaveTextDocument();
```

**Commands API:**
```typescript
vscode.commands.registerCommand('id', handler);
vscode.commands.executeCommand('workbench.action.files.save');
vscode.commands.getCommands();
```

**Languages API:**
```typescript
vscode.languages.registerCompletionItemProvider();
vscode.languages.registerHoverProvider();
vscode.languages.registerDefinitionProvider();
vscode.languages.registerCodeActionsProvider();
```

### Useful Packages

```bash
# VS Code API types
npm install -D @types/vscode

# Node types
npm install -D @types/node

# Testing
npm install -D @vscode/test-electron

# Localization
npm install vscode-nls

# URI utilities
npm install vscode-uri
```

---

## Common Gotchas

1. **Activation Events** — Extension won't load without proper activation events
2. **Async Commands** — Commands should be async if doing async work
3. **Disposables** — Always push disposables to `context.subscriptions`
4. **Paths** — Use `vscode.Uri` for paths, not string concatenation
5. **Extension Host** — Extensions run in separate process from UI
6. **Webview Security** — Webviews run in sandboxed iframe
7. **Package Size** — Use `.vscodeignore` to exclude unnecessary files
8. **VS Code Version** — Set minimum version in `engines.vscode`

---

## Learning Path (Beginner to Advanced)

### Week 1: Basics
- [ ] Install prerequisites (Node.js, Yeoman)
- [ ] Create "Hello World" extension with `yo code`
- [ ] Understand `package.json` manifest
- [ ] Register and test a command
- [ ] Debug extension with F5

### Week 2: Core APIs
- [ ] Add configuration settings
- [ ] Create status bar items
- [ ] Work with text editors and documents
- [ ] Handle file events
- [ ] Add keyboard shortcuts

### Week 3: Advanced Features
- [ ] Create tree views
- [ ] Build webviews with HTML/CSS/JS
- [ ] Implement IntelliSense provider
- [ ] Add syntax highlighting
- [ ] Create custom decorations

### Week 4: Polish & Publish
- [ ] Add extension icon and README
- [ ] Write tests
- [ ] Package with vsce
- [ ] Create publisher account
- [ ] Publish to marketplace

---

## Example Extension Ideas (Learning Projects)

1. **Text Transformer** — Commands to uppercase/lowercase/reverse selected text
2. **TODO Tracker** — Scan workspace for TODO comments, show in tree view
3. **Color Highlighter** — Highlight hex color codes with actual colors
4. **Git Stats** — Show git commit stats in status bar
5. **Snippet Manager** — Custom snippet library with webview UI
6. **File Templates** — Generate files from templates
7. **API Tester** — Test REST APIs directly in VS Code
8. **Markdown Preview** — Custom markdown preview with themes
9. **Code Timer** — Track time spent in each file
10. **Project Notes** — Per-project notes in sidebar

---

## Code Patterns & Best Practices

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "module": "Node16",
    "target": "ES2022",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", ".vscode-test"]
}
```

### Error Handling

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  vscode.window.showErrorMessage(
    `Operation failed: ${error instanceof Error ? error.message : String(error)}`
  );
  console.error('Extension error:', error);
}
```

### Async Commands

```typescript
const myCommand = vscode.commands.registerCommand(
  'extension.asyncCommand',
  async () => {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Processing...",
        cancellable: true
      },
      async (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled");
        });

        progress.report({ increment: 0 });
        await doWork();
        progress.report({ increment: 50 });
        await doMoreWork();
        progress.report({ increment: 100 });
      }
    );
  }
);
```

---

## Official Documentation Links

- **VS Code Extension API**: https://code.visualstudio.com/api
- **Extension Samples**: https://github.com/microsoft/vscode-extension-samples
- **Extension Guidelines**: https://code.visualstudio.com/api/references/extension-guidelines
- **Publishing**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **VS Code API Reference**: https://code.visualstudio.com/api/references/vscode-api

---

## When in Doubt

1. **Use Context7 to fetch documentation** (`@context7 vscode extension api`)
2. **Search for LATEST documentation** (2025 versions)
3. Check official VS Code extension samples on GitHub
4. Review VS Code extension API docs
5. Test in Extension Development Host (F5)
6. Check extension logs in Output panel
7. Ask on VS Code Discussions or Stack Overflow

**Never assume a package version — always research the latest stable release first.**  
**Context7 is your first stop for accurate documentation.**

---

## Notes for AI Agents

- **Always use TypeScript** over JavaScript for extension development
- **Test in Extension Development Host** before publishing (F5)
- **Use proper activation events** to avoid slowing VS Code startup
- **Push all disposables** to `context.subscriptions` for cleanup
- **Use VS Code APIs** instead of Node.js APIs when available
- **Webviews for complex UI** — don't try to build UI with VS Code APIs alone
- **Check VS Code version** requirements in `engines.vscode`

### Research-First Approach
1. **Use Context7** to fetch official documentation (`@context7 vscode extension api`)
2. **Always search for latest versions** before suggesting packages
3. **Check VS Code release notes** for breaking changes
4. **Use latest patterns** from official VS Code extension samples
5. **Verify compatibility** with minimum VS Code version

**VS Code updates monthly — always check for the latest API features and best practices.**