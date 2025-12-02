# Module 01: Environment Setup

## Learning Objectives

By the end of this module, you will:
- ✅ Install all required tools (Node.js, Yeoman, generator-code)
- ✅ Create your first VS Code extension
- ✅ Understand the generated project structure
- ✅ Successfully run the extension in debug mode

## Prerequisites

- Basic familiarity with the terminal/command line
- VS Code installed on your computer
- 30-45 minutes of focused time

## Why This Module Matters

You can't build extensions without the proper tooling. This module sets up your development environment **correctly** so you won't hit roadblocks later.

Think of this as setting up your workshop before building furniture - get it right once, and everything else flows smoothly.

---

## Step 1: Install Node.js 20+

VS Code extensions run on Node.js. You need version 20 or higher.

### Check if Node.js is Installed

Open your terminal and run:

```bash
node --version
```

**Expected Output:** `v20.x.x` or higher (e.g., `v20.10.0`)

### If Not Installed or Version is Too Old

**Option A: Download from nodejs.org (Recommended for beginners)**

1. Visit https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal
6. Verify: `node --version`

**Option B: Use nvm (Node Version Manager) - Recommended for developers**

macOS/Linux:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node 20
nvm install 20
nvm use 20
nvm alias default 20
```

Windows:
- Use [nvm-windows](https://github.com/coreybutler/nvm-windows)

### Verify npm is Installed

npm (Node Package Manager) comes with Node.js:

```bash
npm --version
```

**Expected:** `v10.x.x` or higher

---

## Step 2: Install Extension Development Tools

Now install the tools that generate extension scaffolding.

### Install Yeoman and VS Code Extension Generator

**Option A: Global Installation (Easier)**

```bash
npm install -g yo generator-code
```

**What this does:**
- `yo` - Yeoman, a scaffolding tool
- `generator-code` - VS Code extension template generator

**Option B: Use npx (No Global Install)**

Skip the global install and use npx each time:

```bash
npx --package yo --package generator-code -- yo code
```

### Verify Installation

```bash
# Check if yo is installed
yo --version

# Should show: 4.x.x or higher
```

---

## Step 3: Create Your First Extension

Time to generate your first extension!

### Run the Generator

```bash
# If installed globally:
yo code

# Or with npx:
npx --package yo --package generator-code -- yo code
```

### Answer the Prompts

The generator will ask you questions. Here's what to choose:

```
? What type of extension do you want to create?
→ New Extension (TypeScript)  ← SELECT THIS

? What's the name of your extension?
→ hello-world  ← Or any name you like

? What's the identifier of your extension?
→ hello-world  ← Auto-filled, press Enter

? What's the description of your extension?
→ My first VS Code extension  ← Or leave blank

? Initialize a git repository?
→ Yes  ← Recommended

? Which bundler to use?
→ esbuild  ← Faster than webpack, recommended

? Which package manager to use?
→ npm  ← Use npm (or yarn/pnpm if you prefer)
```

**Wait for Installation...**

The generator will:
1. Create project files
2. Run `npm install` to install dependencies
3. This takes 1-2 minutes

### Navigate to Your Project

```bash
cd hello-world
```

---

## Step 4: Understand the Generated Structure

Your project now looks like this:

```
hello-world/
├── .vscode/              ← VS Code configuration
│   ├── launch.json       ← Debug configuration
│   ├── tasks.json        ← Build tasks
│   └── extensions.json   ← Recommended extensions
├── src/                  ← Your TypeScript source code
│   ├── extension.ts      ← Main entry point (START HERE!)
│   └── test/             ← Test files
│       ├── extension.test.ts
│       └── suite/
├── node_modules/         ← Installed dependencies (ignore this)
├── .gitignore            ← Files git should ignore
├── .vscodeignore         ← Files to exclude from package
├── esbuild.js            ← Build configuration
├── package.json          ← Extension manifest (IMPORTANT!)
├── tsconfig.json         ← TypeScript configuration
├── README.md             ← Documentation
└── CHANGELOG.md          ← Version history
```

### Key Files to Know

**1. `package.json`** - The Extension Manifest
- Defines what your extension is and does
- Declares commands, settings, activation events
- Mix of npm fields + VS Code-specific fields

**2. `src/extension.ts`** - The Entry Point
- Contains `activate()` and `deactivate()` functions
- Where your extension's code lives
- This is where you'll spend most of your time

**3. `.vscode/launch.json`** - Debug Configuration
- Tells VS Code how to launch your extension for debugging
- You won't need to modify this (it just works!)

---

## Step 5: Open in VS Code

```bash
code .
```

This opens the project in VS Code.

### Explore the Files

1. **Open `src/extension.ts`**
   - This is your main code file
   - Read through it - it's well-commented

2. **Open `package.json`**
   - Scroll to the `"contributes"` section
   - See the `"commands"` array? That registers the "Hello World" command

---

## Step 6: Run Your Extension (The Moment of Truth!)

### Start Debugging

1. **Press F5** (or go to Run > Start Debugging)
2. A new window opens titled **"Extension Development Host"**
3. This is VS Code running with your extension loaded

### Test the Command

In the Extension Development Host window:

1. **Open Command Palette:** `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`)
2. **Type:** `Hello World`
3. **Select:** "Hello World"
4. **See the notification:** "Hello World from hello-world!"

🎉 **Congratulations!** Your extension is running!

---

## Step 7: Make a Change

Let's modify the extension to understand the workflow.

### Edit the Code

1. **Go back to the original VS Code window** (not the Extension Development Host)
2. **Open `src/extension.ts`**
3. **Find this line** (around line 15):

```typescript
vscode.window.showInformationMessage('Hello World from hello-world!');
```

4. **Change it to:**

```typescript
vscode.window.showInformationMessage('I just modified my first extension!');
```

5. **Save the file** (`Ctrl+S` / `Cmd+S`)

### Reload the Extension

In the **Extension Development Host** window:

1. **Press `Ctrl+R`** (macOS: `Cmd+R`)
   - This reloads the extension with your changes

2. **Or:** Click the reload button in the debug toolbar

### Test Again

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Hello World"
3. See your new message: "I just modified my first extension!"

🎊 **You just made your first code change!**

---

## Step 8: Stop Debugging

When done testing:

1. **Press `Shift+F5`** - Stops the Extension Development Host
2. Or: Click the red stop button in the debug toolbar

---

## Understanding What Just Happened

Let's connect the dots:

### The Flow

```
package.json (declares command)
    ↓
src/extension.ts (implements command)
    ↓
Press F5 (loads extension in debug mode)
    ↓
Command Palette shows "Hello World"
    ↓
Run command → execute function → show message
```

### Key Concepts

**1. Extension Manifest (package.json)**
```json
"contributes": {
  "commands": [{
    "command": "hello-world.helloWorld",  ← Unique ID
    "title": "Hello World"                 ← What users see
  }]
}
```

**2. Command Registration (src/extension.ts)**
```typescript
vscode.commands.registerCommand('hello-world.helloWorld', () => {
  vscode.window.showInformationMessage('...');
});
```

The `command` ID in package.json **must match** the ID in `registerCommand`.

---

## Common Mistakes & Solutions

### ❌ Mistake 1: Node.js version too old

**Error:** `The engine "vscode" is incompatible with this module`

**Solution:** Install Node.js 20+
```bash
node --version  # Check version
# If too old, download from nodejs.org
```

### ❌ Mistake 2: Extension doesn't load

**Symptom:** "Hello World" command not in Command Palette

**Solution:** Check these:
1. Is Extension Development Host actually running? (F5)
2. Check for errors in Debug Console
3. Reload with `Ctrl+R` in Extension Development Host

### ❌ Mistake 3: Changes not appearing

**Symptom:** Code changes don't show up

**Solution:** Reload the extension!
- Press `Ctrl+R` / `Cmd+R` in Extension Development Host
- Or restart debugging (`Ctrl+Shift+F5`)

### ❌ Mistake 4: npm install fails

**Error:** Network errors, permission errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If permission errors on macOS/Linux, don't use sudo
# Instead, fix npm permissions or use nvm
```

---

## Exercise: Modify the Extension

Try these on your own:

**Task 1: Change the command name**
1. In `package.json`, change `"title": "Hello World"` to `"title": "Greet Me"`
2. Reload extension (`Ctrl+R`)
3. Open Command Palette - should now see "Greet Me"

**Task 2: Add a second message**
1. In `extension.ts`, add another line:
```typescript
vscode.window.showInformationMessage('I just modified my first extension!');
vscode.window.showWarningMessage('This is a warning!');  // Add this
```
2. Reload and test

**Task 3: Use a variable**
```typescript
const userName = 'Developer';
vscode.window.showInformationMessage(`Hello, ${userName}!`);
```

---

## Next Steps

You now have:
- ✅ A working development environment
- ✅ Your first extension running
- ✅ The ability to make changes and test them

### Where to Go from Here

- **Next Module:** [Module 02: Extension Architecture](./Module-02-Extension-Architecture.md)
  - Understand how extensions actually work
  - Learn the lifecycle (activate/deactivate)
  - Deep dive into package.json and extension.ts

- **Need Commands Reference?** See [COMMANDS-REFERENCE.md](./COMMANDS-REFERENCE.md)

### Recommended Practice

Before moving on:
1. Play with the code in `extension.ts`
2. Try different message types: `showErrorMessage`, `showWarningMessage`
3. Get comfortable with the F5 → modify → reload → test workflow

---

## Resources

- [VS Code Extension API - Getting Started](https://code.visualstudio.com/api/get-started/your-first-extension)
- [Node.js Downloads](https://nodejs.org/)
- [Yeoman Documentation](https://yeoman.io/)

---

**Previous:** [Learning Path](./00-Learning-Path.md) | **Next:** [Module 02: Extension Architecture →](./Module-02-Extension-Architecture.md)
