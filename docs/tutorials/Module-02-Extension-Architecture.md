# Module 02: Extension Architecture

## Learning Objectives

By the end of this module, you will:
- ✅ Understand the complete extension lifecycle
- ✅ Know the difference between package.json and extension.ts
- ✅ Understand how VS Code loads and runs extensions
- ✅ Grasp the concept of activation and deactivation
- ✅ Read and understand any extension's structure

## Prerequisites

- Completed [Module 01: Environment Setup](./Module-01-Environment-Setup.md)
- Have your `hello-world` extension from Module 01 open

## Why This Module Matters

**You need to think like VS Code.**

Understanding *how* extensions work internally will help you:
- Debug problems faster
- Write more efficient code
- Avoid common pitfalls
- Build complex features confidently

This is foundational knowledge that separates beginners from proficient developers.

---

## The Big Picture: How Extensions Work

### The Extension Lifecycle

```
1. VS Code starts
   ↓
2. VS Code reads all package.json files
   ↓
3. Extension is REGISTERED (not activated yet!)
   ↓
4. User triggers activation event (e.g., runs command)
   ↓
5. activate() function is called
   ↓
6. Extension is now ACTIVE and running
   ↓
7. Extension does its work
   ↓
8. VS Code closes (or extension is disabled)
   ↓
9. deactivate() function is called
   ↓
10. Extension cleanup complete
```

### Key Insight

**Extensions are LAZY by default.**

They don't load immediately when VS Code starts. They only "wake up" when needed (activation event). This keeps VS Code fast.

---

## The Two Critical Files

Every extension has two core files that work together:

### 1. `package.json` - The Manifest (The Contract)

**Purpose:** Declares *what* your extension does

**Analogy:** A restaurant menu
- Tells you what dishes (features) are available
- Doesn't contain the recipes (implementation)
- VS Code reads this to know what your extension offers

**Key Sections:**
```json
{
  "name": "hello-world",              // Internal ID
  "displayName": "Hello World",       // User-facing name
  "description": "My first extension",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.95.0"               // Minimum VS Code version
  },
  "categories": ["Other"],
  "activationEvents": [               // When to wake up
    "onCommand:hello-world.helloWorld"
  ],
  "main": "./dist/extension.js",      // Entry point (compiled)
  "contributes": {                     // What you add to VS Code
    "commands": [{
      "command": "hello-world.helloWorld",
      "title": "Hello World"
    }]
  }
}
```

### 2. `src/extension.ts` - The Implementation (The Code)

**Purpose:** Implements *how* your extension works

**Analogy:** The kitchen
- Contains the actual recipes (code)
- Does the work declared in the menu (package.json)
- Users never see this directly

**Structure:**
```typescript
import * as vscode from 'vscode';

// Called when extension activates
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension is now active!');

  // Register commands, providers, etc.
  let disposable = vscode.commands.registerCommand(
    'hello-world.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}

// Called when extension deactivates
export function deactivate() {
  // Cleanup code (optional)
}
```

---

## Deep Dive: package.json

Let's understand each important section.

### Basic Metadata

```json
{
  "name": "hello-world",              // npm package name
  "displayName": "Hello World",       // Marketplace display name
  "description": "...",               // Short description
  "version": "0.0.1",                 // Semantic versioning
  "publisher": "your-name",           // Publisher ID (for marketplace)
  "icon": "images/icon.png",          // Extension icon (optional)
  "license": "MIT"                    // License type
}
```

### Engines (Compatibility)

```json
"engines": {
  "vscode": "^1.95.0"  // Minimum VS Code version required
}
```

**The `^` means:** 1.95.0 or any higher minor/patch version (1.96.0, 1.95.1, etc.)

**Why it matters:** You can only use APIs available in this version or earlier.

### Categories

```json
"categories": [
  "Programming Languages",  // Choose appropriate category
  "Other",
  "Snippets"
]
```

**Purpose:** Helps users find your extension in the marketplace.

**Common categories:**
- Programming Languages
- Snippets
- Linters
- Formatters
- Debuggers
- Testing
- Data Science
- Themes

### Activation Events

```json
"activationEvents": [
  "onCommand:hello-world.helloWorld",  // When command is executed
  "onLanguage:javascript",              // When opening .js file
  "onStartupFinished",                  // After VS Code starts
  "onView:myView"                       // When custom view is opened
]
```

**Critical:** This controls **when** your extension loads.

We'll cover this in detail in [Module 03: Activation Events](./Module-03-Activation-Events.md).

### Main Entry Point

```json
"main": "./dist/extension.js"
```

**Points to:** The compiled JavaScript file (not the TypeScript source)

**Build process:**
```
src/extension.ts → (TypeScript compiler) → dist/extension.js
```

### Contributes (What You Add to VS Code)

This is where you declare everything your extension adds:

```json
"contributes": {
  "commands": [
    {
      "command": "hello-world.helloWorld",  // Unique ID
      "title": "Hello World",               // Command Palette text
      "category": "Hello"                   // Optional category
    }
  ],

  "configuration": {
    "title": "Hello World",
    "properties": {
      "helloWorld.enabled": {
        "type": "boolean",
        "default": true,
        "description": "Enable Hello World"
      }
    }
  },

  "keybindings": [
    {
      "command": "hello-world.helloWorld",
      "key": "ctrl+h ctrl+w",
      "mac": "cmd+h cmd+w"
    }
  ],

  "menus": {
    "commandPalette": [
      {
        "command": "hello-world.helloWorld",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

---

## Deep Dive: extension.ts

Let's understand the structure of the implementation file.

### The activate() Function

**This is the entry point of your extension.**

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Called when your extension activates

  console.log('Extension is now active!');

  // Register commands, providers, UI elements, etc.
  // Everything you want your extension to do starts here
}
```

**When it's called:**
- When an activation event occurs
- Only called ONCE per VS Code session (until reload)

**Parameters:**
- `context: ExtensionContext` - Provides utilities and information

### The ExtensionContext Object

The `context` parameter is extremely important:

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Available properties:

  context.subscriptions       // Array to push disposables (CRITICAL!)
  context.extensionPath       // Absolute path to extension folder
  context.extensionUri        // URI of extension folder
  context.storagePath         // Path for workspace-specific storage
  context.globalStoragePath   // Path for global storage
  context.logPath             // Path for log files
  context.secrets             // Secure storage for credentials
  context.workspaceState      // Key-value store (workspace-specific)
  context.globalState         // Key-value store (global)
}
```

**Most Important:** `context.subscriptions`

This is an array where you **must push all disposables** (commands, providers, event listeners, etc.).

**Why?** VS Code will automatically clean them up when extension deactivates.

### Registering a Command

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Register command
  let disposable = vscode.commands.registerCommand(
    'hello-world.helloWorld',  // Must match package.json
    () => {
      // Command implementation
      vscode.window.showInformationMessage('Hello World!');
    }
  );

  // CRITICAL: Always push to subscriptions!
  context.subscriptions.push(disposable);
}
```

**The command ID must match** what's in package.json contributes.commands.

### The deactivate() Function

**Called when extension is shutting down.**

```typescript
export function deactivate() {
  // Optional: Manual cleanup code
  // Usually not needed if you use context.subscriptions properly
}
```

**When it's called:**
- VS Code is closing
- Extension is being disabled
- Extension is being uninstalled
- VS Code is reloading window

**Usually you don't need this** if you push everything to `context.subscriptions`.

---

## How VS Code Loads Your Extension

Let's trace the exact flow:

### Step-by-Step Process

**1. VS Code Starts**
```
VS Code scans: ~/.vscode/extensions/
Finds: your-extension/package.json
```

**2. VS Code Reads package.json**
```json
{
  "name": "hello-world",
  "activationEvents": ["onCommand:hello-world.helloWorld"],
  "contributes": {
    "commands": [
      {"command": "hello-world.helloWorld", "title": "Hello World"}
    ]
  }
}
```

**3. Extension is Registered (NOT Activated)**
- VS Code knows the extension exists
- Command is added to Command Palette
- **No code has run yet!**

**4. User Opens Command Palette**
```
User presses Ctrl+Shift+P
Types "Hello World"
Command appears (because it's registered)
```

**5. User Runs Command**
```
VS Code checks: Is extension activated?
NO → Trigger activation
```

**6. activate() Function Runs**
```typescript
export function activate(context: vscode.ExtensionContext) {
  // This runs NOW
  let disposable = vscode.commands.registerCommand(
    'hello-world.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World!');
    }
  );
  context.subscriptions.push(disposable);
}
```

**7. Command Executes**
```typescript
// The callback function runs
vscode.window.showInformationMessage('Hello World!');
```

**8. User Sees Message**
```
Notification appears: "Hello World!"
```

---

## The Activation Flow (Diagram)

```
┌─────────────────────────────────────────┐
│         VS Code Starts                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Scan for extensions                   │
│   Read all package.json files           │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Extension REGISTERED                  │
│   (not activated yet)                   │
└───────────────┬─────────────────────────┘
                │
                ▼
        User triggers event
        (e.g., runs command)
                │
                ▼
┌─────────────────────────────────────────┐
│   Check: Is extension activated?        │
│   NO → Call activate()                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   activate() function runs              │
│   - Register commands                   │
│   - Set up event listeners              │
│   - Initialize state                    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Extension ACTIVE                      │
│   (stays active until VS Code closes)   │
└─────────────────────────────────────────┘
```

---

## Common Patterns

### Pattern 1: Multiple Commands

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Command 1
  const cmd1 = vscode.commands.registerCommand('ext.command1', () => {
    vscode.window.showInformationMessage('Command 1');
  });

  // Command 2
  const cmd2 = vscode.commands.registerCommand('ext.command2', () => {
    vscode.window.showInformationMessage('Command 2');
  });

  // Push both to subscriptions
  context.subscriptions.push(cmd1, cmd2);
}
```

### Pattern 2: Organized with Separate Functions

```typescript
export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
  setupEventListeners(context);
  initializeStatusBar(context);
}

function registerCommands(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  context.subscriptions.push(cmd);
}

function setupEventListeners(context: vscode.ExtensionContext) {
  // Event listeners here
}

function initializeStatusBar(context: vscode.ExtensionContext) {
  // Status bar setup here
}

export function deactivate() {}
```

### Pattern 3: Using Classes

```typescript
class MyExtension {
  private statusBar: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext) {
    this.registerCommands(context);
    this.setupUI(context);
  }

  private registerCommands(context: vscode.ExtensionContext) {
    const cmd = vscode.commands.registerCommand('ext.hello', () => {
      this.sayHello();
    });
    context.subscriptions.push(cmd);
  }

  private setupUI(context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right
    );
    context.subscriptions.push(this.statusBar);
  }

  private sayHello() {
    vscode.window.showInformationMessage('Hello from class!');
  }
}

export function activate(context: vscode.ExtensionContext) {
  new MyExtension(context);
}

export function deactivate() {}
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting to Push to Subscriptions

```typescript
// BAD - Memory leak!
export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  // ⚠️ Not pushed to context.subscriptions!
}
```

**Why it's bad:** The command won't be cleaned up when extension deactivates, causing a memory leak.

**Fix:**
```typescript
// GOOD
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ext.hello', () => {
    vscode.window.showInformationMessage('Hello!');
  });
  context.subscriptions.push(disposable);  // ✅
}
```

### ❌ Mistake 2: Command ID Mismatch

```typescript
// package.json
"contributes": {
  "commands": [{
    "command": "ext.helloWorld",  // ← This ID
    "title": "Hello World"
  }]
}

// extension.ts
vscode.commands.registerCommand('ext.hello', () => {  // ← Different ID!
  // This won't work!
});
```

**Fix:** IDs must match exactly.

### ❌ Mistake 3: Doing Heavy Work in activate()

```typescript
// BAD - Blocks VS Code startup
export function activate(context: vscode.ExtensionContext) {
  // Don't do this:
  const data = readHugeFileSync();  // Blocks!
  processMillionsOfRecords(data);   // Blocks!
}
```

**Fix:** Do async work or defer it:
```typescript
// GOOD
export function activate(context: vscode.ExtensionContext) {
  // Register commands immediately
  registerCommands(context);

  // Do heavy work asynchronously
  loadDataAsync();  // Don't await here
}

async function loadDataAsync() {
  const data = await readHugeFile();
  await processRecords(data);
}
```

---

## Exercise: Explore Your Extension

**Task 1: Trace the Flow**

1. Open your `hello-world` extension
2. Open both `package.json` and `src/extension.ts` side-by-side
3. Find where the command is:
   - **Declared** (package.json)
   - **Registered** (extension.ts)
4. Verify the IDs match

**Task 2: Add Console Logging**

```typescript
export function activate(context: vscode.ExtensionContext) {
  console.log('ACTIVATE: Extension starting up');

  const disposable = vscode.commands.registerCommand(
    'hello-world.helloWorld',
    () => {
      console.log('COMMAND: Hello World executed');
      vscode.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
  console.log('ACTIVATE: Extension ready');
}

export function deactivate() {
  console.log('DEACTIVATE: Extension shutting down');
}
```

Now:
1. Press F5 to debug
2. Open Debug Console (`Ctrl+Shift+Y`)
3. Run the command
4. Watch the console logs appear

**Task 3: Add a Second Command**

1. Add to package.json:
```json
"contributes": {
  "commands": [
    {
      "command": "hello-world.helloWorld",
      "title": "Hello World"
    },
    {
      "command": "hello-world.goodbye",
      "title": "Goodbye World"
    }
  ]
}
```

2. Add to extension.ts:
```typescript
const goodbye = vscode.commands.registerCommand(
  'hello-world.goodbye',
  () => {
    vscode.window.showInformationMessage('Goodbye!');
  }
);
context.subscriptions.push(goodbye);
```

3. Reload (`Ctrl+R`) and test both commands

---

## Key Takeaways

1. **package.json declares, extension.ts implements**
2. **Extensions are lazy** - they only load when needed
3. **activate() is your entry point** - called once when extension wakes up
4. **Always push to context.subscriptions** - prevents memory leaks
5. **Command IDs must match** between package.json and extension.ts
6. **deactivate() is rarely needed** if you use subscriptions properly

---

## Next Steps

You now understand the architectural foundation of VS Code extensions!

**Next Module:** [Module 03: Activation Events](./Module-03-Activation-Events.md)
- Learn when extensions should activate
- Understand performance implications
- Master activation event types

---

## Resources

- [VS Code Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy)
- [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)
- [Activation Events Reference](https://code.visualstudio.com/api/references/activation-events)

---

**Previous:** [Module 01: Environment Setup](./Module-01-Environment-Setup.md) | **Next:** [Module 03: Activation Events →](./Module-03-Activation-Events.md)
