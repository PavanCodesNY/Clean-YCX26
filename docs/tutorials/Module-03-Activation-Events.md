# Module 03: Activation Events

## Learning Objectives

By the end of this module, you will:
- ✅ Understand what activation events are and why they matter
- ✅ Know all types of activation events and when to use each
- ✅ Choose the right activation event for your extension
- ✅ Understand performance implications
- ✅ Avoid common activation pitfalls

## Prerequisites

- Completed [Module 01: Environment Setup](./Module-01-Environment-Setup.md)
- Completed [Module 02: Extension Architecture](./Module-02-Extension-Architecture.md)
- Understand the extension lifecycle

## Why This Module Matters

**Activation events determine WHEN your extension loads.**

Choose correctly:
- ✅ Extension loads when needed
- ✅ VS Code starts fast
- ✅ Users are happy

Choose incorrectly:
- ❌ Extension loads too early (slows VS Code startup)
- ❌ Extension loads too late (features don't work)
- ❌ Extension never loads (broken functionality)

This is **critical** for building professional extensions.

---

## What Are Activation Events?

### The Problem

If all extensions loaded immediately when VS Code starts:
- VS Code would be **slow to start**
- Memory usage would be **high**
- Most extension code wouldn't even be needed yet

### The Solution: Lazy Loading

Extensions only "wake up" when they're actually needed.

**Activation Events** tell VS Code: "Load my extension when [X] happens"

### The Lifecycle (Reminder)

```
VS Code starts
  ↓
Extension registered (but NOT loaded)
  ↓
Activation event occurs ← THIS IS THE TRIGGER
  ↓
activate() function runs
  ↓
Extension is now active
```

---

## Types of Activation Events

### 1. `onCommand:commandId`

**Activates:** When a specific command is executed

**Use when:** Your extension provides commands

**Example:**
```json
"activationEvents": [
  "onCommand:myExtension.helloWorld"
]
```

**How it works:**
1. User opens Command Palette
2. User runs "Hello World" command
3. VS Code sees command is from your extension
4. Extension activates
5. Command executes

**Best for:**
- Simple command-based extensions
- Extensions that don't need to be always active

### 2. `onLanguage:languageId`

**Activates:** When a file of a specific language is opened

**Use when:** Your extension provides language-specific features

**Example:**
```json
"activationEvents": [
  "onLanguage:javascript",
  "onLanguage:typescript"
]
```

**Common language IDs:**
- `javascript`
- `typescript`
- `python`
- `html`
- `css`
- `json`
- `markdown`
- `yaml`
- [See full list](https://code.visualstudio.com/docs/languages/identifiers)

**How it works:**
1. User opens `app.js`
2. VS Code detects language: `javascript`
3. Extension activates
4. Language features become available

**Best for:**
- Language servers
- Syntax highlighters
- Code completion providers
- Formatters for specific languages

### 3. `onStartupFinished`

**Activates:** After VS Code finishes starting (recommended for most cases)

**Use when:** Your extension needs to be active all the time, but doesn't need to slow down startup

**Example:**
```json
"activationEvents": [
  "onStartupFinished"
]
```

**How it works:**
1. VS Code starts
2. Initial UI renders
3. Critical extensions load
4. VS Code is interactive
5. **Then** `onStartupFinished` extensions load (background)

**Best for:**
- Extensions that need to be always active
- Status bar items
- File watchers
- Background tasks
- Most general-purpose extensions

**Why use this instead of `*`:**
- Doesn't slow down startup
- Still activates early enough for most use cases

### 4. `*` (Wildcard - Use Sparingly!)

**Activates:** Immediately when VS Code starts

**Use when:** Extension is **critical** and must be ready instantly

**Example:**
```json
"activationEvents": [
  "*"
]
```

**⚠️ WARNING:** This slows down VS Code startup!

**Only use if:**
- Your extension provides **core** functionality
- Delaying activation would break user experience
- You've exhausted all other options

**Better alternative:** Use `onStartupFinished` instead (99% of the time)

### 5. `onView:viewId`

**Activates:** When a specific custom view is opened

**Use when:** Your extension provides a tree view or sidebar panel

**Example:**
```json
"activationEvents": [
  "onView:myExtension.todoView"
]
```

**How it works:**
1. User clicks on your extension's sidebar icon
2. View opens
3. Extension activates
4. View content loads

**Best for:**
- Custom tree views
- Sidebar panels
- Explorer contributions

### 6. `onFileSystem:scheme`

**Activates:** When a resource from a specific file system is accessed

**Use when:** Your extension provides a custom file system provider

**Example:**
```json
"activationEvents": [
  "onFileSystem:ftp",
  "onFileSystem:ssh"
]
```

**How it works:**
1. User opens `ftp://server/file.txt`
2. VS Code detects `ftp` scheme
3. Extension activates
4. File system provider handles the request

**Best for:**
- Virtual file systems
- Remote file access
- Custom URI schemes

### 7. `onDebug`

**Activates:** When a debug session starts

**Use when:** Your extension provides debugging features

**Example:**
```json
"activationEvents": [
  "onDebug"
]
```

**Best for:**
- Debug adapters
- Debug extensions
- Debugging utilities

### 8. `onTaskType:taskType`

**Activates:** When a task of a specific type is run

**Use when:** Your extension provides custom tasks

**Example:**
```json
"activationEvents": [
  "onTaskType:npm",
  "onTaskType:gulp"
]
```

### 9. `onUri`

**Activates:** When a URI for your extension is opened

**Use when:** Your extension handles custom URIs (e.g., OAuth callbacks)

**Example:**
```json
"activationEvents": [
  "onUri"
]
```

**Use case:**
```
vscode://myPublisher.myExtension/callback?code=abc123
```

**Best for:**
- OAuth authentication flows
- Deep linking
- Protocol handlers

---

## How to Choose the Right Activation Event

Use this decision tree:

```
Is your extension command-based only?
  YES → Use onCommand:commandId
  NO  → Continue

Does it provide language-specific features?
  YES → Use onLanguage:languageId
  NO  → Continue

Does it provide a custom view/sidebar?
  YES → Use onView:viewId
  NO  → Continue

Does it need to be always active?
  YES → Use onStartupFinished (NOT *)
  NO  → Use the most specific event possible
```

### General Rules

1. **Be as specific as possible**
   - `onCommand` > `onStartupFinished` > `*`

2. **Never use `*` unless absolutely necessary**
   - Use `onStartupFinished` instead

3. **Multiple activation events are fine**
   ```json
   "activationEvents": [
     "onCommand:ext.cmd1",
     "onCommand:ext.cmd2",
     "onLanguage:javascript"
   ]
   ```

4. **Once activated, stays activated**
   - Extension doesn't deactivate until VS Code closes

---

## Practical Examples

### Example 1: Simple Command Extension

**Extension:** Text transformer (uppercase/lowercase)

```json
"activationEvents": [
  "onCommand:textTransform.uppercase",
  "onCommand:textTransform.lowercase"
]
```

**Why:** Only needs to load when user runs a command.

### Example 2: Language Extension

**Extension:** JavaScript linter

```json
"activationEvents": [
  "onLanguage:javascript",
  "onLanguage:typescript"
]
```

**Why:** Only relevant when editing JavaScript/TypeScript files.

### Example 3: Always-Active Extension

**Extension:** TODO tracker (scans workspace for TODOs)

```json
"activationEvents": [
  "onStartupFinished"
]
```

**Why:** Needs to be active to watch files, but doesn't need to slow startup.

### Example 4: Multiple Triggers

**Extension:** Git helper

```json
"activationEvents": [
  "onCommand:gitHelper.commit",
  "onCommand:gitHelper.push",
  "onView:gitHelper.changesView",
  "onStartupFinished"
]
```

**Why:**
- Commands trigger activation
- Opening the view triggers activation
- Also activates on startup (for background file watching)

---

## Performance Implications

### Startup Impact

**Fast Startup (Good):**
```json
"activationEvents": [
  "onCommand:ext.hello"
]
```
- Extension only loads when needed
- VS Code starts quickly

**Slow Startup (Bad):**
```json
"activationEvents": [
  "*"
]
```
- Extension loads immediately
- Delays VS Code startup
- Multiplied by all installed extensions!

### The `*` Problem

If 50 extensions use `*`:
- All 50 load at startup
- VS Code becomes slow
- Users get frustrated
- Extensions get bad reviews

**Solution:** Use `onStartupFinished` instead
- VS Code starts fast
- Extension still loads early
- Everyone is happy

### Measuring Activation Time

You can see how long activation takes:

1. Open Command Palette
2. Run: "Developer: Show Running Extensions"
3. See activation times for all extensions

**Goal:** Keep activation time under 100ms

---

## Common Patterns

### Pattern 1: Command-Only Extension

```json
{
  "activationEvents": [
    "onCommand:ext.command1",
    "onCommand:ext.command2"
  ],
  "contributes": {
    "commands": [
      {"command": "ext.command1", "title": "Command 1"},
      {"command": "ext.command2", "title": "Command 2"}
    ]
  }
}
```

### Pattern 2: Language Support

```json
{
  "activationEvents": [
    "onLanguage:python"
  ],
  "contributes": {
    "languages": [
      {"id": "python", "extensions": [".py"]}
    ]
  }
}
```

### Pattern 3: Background Extension

```json
{
  "activationEvents": [
    "onStartupFinished"
  ]
}
```

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Set up file watchers
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.todo');
  watcher.onDidCreate(uri => {
    // Handle new TODO file
  });
  context.subscriptions.push(watcher);
}
```

### Pattern 4: Hybrid Approach

```json
{
  "activationEvents": [
    "onCommand:ext.analyze",      // User-triggered
    "onLanguage:javascript",      // Auto-trigger on .js files
    "onStartupFinished"           // Background tasks
  ]
}
```

---

## Common Mistakes

### ❌ Mistake 1: Using `*` When Not Needed

```json
// BAD
"activationEvents": [
  "*"
]
```

**Fix:**
```json
// GOOD
"activationEvents": [
  "onStartupFinished"  // 99% of cases where you think you need *
]
```

### ❌ Mistake 2: Missing Activation Event

```json
// package.json
"contributes": {
  "commands": [
    {"command": "ext.hello", "title": "Hello"}
  ]
}

// No activationEvents! ❌
```

**Result:** Command shows in palette but doesn't work (extension never activates)

**Fix:**
```json
"activationEvents": [
  "onCommand:ext.hello"
]
```

### ❌ Mistake 3: Too Broad Activation

```json
// BAD - Activates for ANY language
"activationEvents": [
  "onLanguage:*"
]
```

**Fix:** Be specific
```json
// GOOD
"activationEvents": [
  "onLanguage:javascript",
  "onLanguage:typescript"
]
```

---

## Exercise: Experiment with Activation Events

### Task 1: See Activation in Action

1. Open your `hello-world` extension
2. Add logging to `activate()`:

```typescript
export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 Extension ACTIVATED at:', new Date().toISOString());
  // ... rest of code
}
```

3. Change activation event in package.json:

```json
"activationEvents": [
  "onCommand:hello-world.helloWorld"
]
```

4. Press F5 to debug
5. Open Debug Console
6. **Notice:** No log appears yet! (Extension not activated)
7. Run the "Hello World" command
8. **See:** Log appears now (extension just activated)

### Task 2: Try `onStartupFinished`

1. Change activation event:

```json
"activationEvents": [
  "onStartupFinished"
]
```

2. Reload extension (Ctrl+Shift+F5)
3. Open Debug Console
4. **See:** Log appears soon after VS Code loads

### Task 3: Multiple Activation Events

1. Add a second command in package.json:

```json
"contributes": {
  "commands": [
    {"command": "hello-world.helloWorld", "title": "Hello World"},
    {"command": "hello-world.test", "title": "Test Command"}
  ]
}
```

2. Add activation events:

```json
"activationEvents": [
  "onCommand:hello-world.helloWorld",
  "onCommand:hello-world.test"
]
```

3. Register the command in extension.ts:

```typescript
const testCmd = vscode.commands.registerCommand('hello-world.test', () => {
  vscode.window.showInformationMessage('Test command executed!');
});
context.subscriptions.push(testCmd);
```

4. Test: Either command will activate the extension

---

## Best Practices Summary

1. ✅ **Use specific events** when possible
2. ✅ **Use `onStartupFinished`** for always-active extensions
3. ✅ **Use `onCommand`** for command-only extensions
4. ✅ **Use `onLanguage`** for language-specific features
5. ✅ **Multiple events are OK** (extension activates on first trigger)
6. ❌ **Avoid `*`** (use `onStartupFinished` instead)
7. ❌ **Don't forget** to add activation events for all commands

---

## Key Takeaways

1. **Activation events control when extensions load**
2. **Be as specific as possible** to improve performance
3. **`onStartupFinished` is your friend** (replaces `*` in most cases)
4. **Once activated, stays activated** until VS Code closes
5. **Multiple activation events = OR condition** (activates on first match)
6. **Good activation = fast VS Code + happy users**

---

## Next Steps

You've completed the Foundation! You now understand:
- ✅ How to set up your environment
- ✅ Extension architecture
- ✅ When extensions activate

**Next Module:** [Module 04: Commands API](./Module-04-Commands-API.md)
- Learn to register and execute commands
- Build interactive extensions
- Master the Commands API

---

## Resources

- [Activation Events Reference](https://code.visualstudio.com/api/references/activation-events)
- [Performance Best Practices](https://code.visualstudio.com/api/advanced-topics/extension-host#performance-best-practices)
- [Language Identifiers](https://code.visualstudio.com/docs/languages/identifiers)

---

**Previous:** [Module 02: Extension Architecture](./Module-02-Extension-Architecture.md) | **Next:** [Module 04: Commands API →](./Module-04-Commands-API.md)
