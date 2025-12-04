# Tools, Technologies & Libraries for Clean

## Overview

This document outlines all the tools, libraries, and technologies required to build Clean - the ultimate MCP server management extension for VS Code.

---

## Core Technologies

### 1. Node.js
**Version:** 20.x LTS (Long Term Support)

**Why:**
- Required for VS Code extension development
- Modern JavaScript features (ES2022+)
- Stable and well-supported

**Installation:**
```bash
# macOS (using Homebrew)
brew install node@20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

---

### 2. TypeScript
**Version:** 5.x (latest stable)

**Why:**
- Type safety prevents bugs
- Better IDE support (IntelliSense)
- Required for VS Code extension best practices
- Makes refactoring easier

**Installation:**
```bash
npm install -D typescript@latest
```

**Configuration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "module": "Node16",
    "target": "ES2022",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "Node16"
  },
  "include": ["src"],
  "exclude": ["node_modules", ".vscode-test", "dist"]
}
```

---

### 3. VS Code Extension API
**Package:** `@types/vscode`
**Version:** `^1.95.0` (minimum)

**Why:**
- Provides TypeScript definitions for VS Code API
- Enables IntelliSense for VS Code APIs
- Ensures compatibility with VS Code

**Installation:**
```bash
npm install -D @types/vscode@^1.95.0
```

**Key APIs We'll Use:**
- `vscode.window` - UI components (messages, input boxes, status bar)
- `vscode.commands` - Register extension commands
- `vscode.workspace` - Access workspace files and configuration
- `vscode.TreeDataProvider` - Tree view in sidebar
- `vscode.WebviewPanel` - Rich HTML/CSS/JS panels
- `vscode.ExtensionContext` - Extension lifecycle and storage

---

## Build Tools

### 1. esbuild
**Package:** `esbuild`
**Version:** Latest

**Why:**
- **10-100x faster** than webpack
- Simple configuration
- Built-in TypeScript support
- Tree-shaking for smaller bundle size

**Installation:**
```bash
npm install -D esbuild
```

**Build Script (esbuild.js):**
```javascript
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [
      /* add any plugins here */
    ],
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

**package.json scripts:**
```json
{
  "scripts": {
    "compile": "npm run check-types && node esbuild.js",
    "watch": "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch --project tsconfig.json",
    "package": "npm run check-types && node esbuild.js --production",
    "check-types": "tsc --noEmit"
  }
}
```

---

### 2. vsce (VS Code Extension Manager)
**Package:** `@vscode/vsce`
**Version:** Latest

**Why:**
- Package extensions into .vsix files
- Publish to VS Code Marketplace
- Validate extension manifest

**Installation:**
```bash
npm install -g @vscode/vsce
# OR use npx
npx @vscode/vsce package
```

**Usage:**
```bash
# Package extension
vsce package

# Publish extension
vsce publish

# Publish with version bump
vsce publish patch  # 1.0.0 -> 1.0.1
vsce publish minor  # 1.0.0 -> 1.1.0
vsce publish major  # 1.0.0 -> 2.0.0
```

---

### 3. Yeoman (Scaffolding)
**Package:** `yo` + `generator-code`

**Why:**
- Official VS Code extension generator
- Creates proper project structure
- Sets up build scripts and configs

**Installation:**
```bash
npm install -g yo generator-code
```

**Usage:**
```bash
yo code
# Select: New Extension (TypeScript)
# Name: clean
# Description: The ultimate MCP server manager
# Use esbuild
```

---

## HTTP & API Libraries

### 1. axios
**Package:** `axios`
**Version:** Latest

**Why:**
- Industry-standard HTTP client
- Better error handling than fetch
- Request/response interceptors
- TypeScript support
- Timeout handling

**Installation:**
```bash
npm install axios
npm install -D @types/node
```

**Usage Example:**
```typescript
import axios from 'axios';

const response = await axios.get<MCPServer[]>(
  'https://registry.smithery.ai/servers',
  {
    headers: { 'User-Agent': 'Clean/1.0.0' },
    timeout: 10000
  }
);

const servers = response.data;
```

---

## File System & JSON Handling

### 1. jsonc-parser
**Package:** `jsonc-parser`

**Why:**
- Handles JSON with comments (JSONC)
- Preserves formatting when editing
- Used by VS Code internally
- Perfect for editing .mcp.json files

**Installation:**
```bash
npm install jsonc-parser
```

**Usage Example:**
```typescript
import * as jsonc from 'jsonc-parser';
import * as fs from 'fs/promises';

// Read JSON with comments
const content = await fs.readFile('.mcp.json', 'utf-8');
const tree = jsonc.parseTree(content);

// Edit JSON
const edits = jsonc.modify(
  content,
  ['mcpServers', 'postgres'],
  {
    command: 'npx',
    args: ['-y', '@smithery/postgres-mcp'],
    env: { CONNECTION_STRING: 'postgres://...' }
  },
  {}
);

// Apply edits
const newContent = jsonc.applyEdits(content, edits);
await fs.writeFile('.mcp.json', newContent, 'utf-8');
```

---

### 2. Node.js File System (fs/promises)
**Built-in:** No installation needed

**Why:**
- Modern promise-based API
- Read/write config files
- Check file existence
- Create directories

**Usage:**
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

// Check if file exists
try {
  await fs.access('.mcp.json');
  console.log('Config file exists');
} catch {
  console.log('Config file does not exist');
}

// Read file
const content = await fs.readFile('.mcp.json', 'utf-8');

// Write file
await fs.writeFile('.mcp.json', content, 'utf-8');

// Create directory
await fs.mkdir(dirPath, { recursive: true });
```

---

## AI/LLM Integration (Context Optimization)

### 1. OpenAI SDK
**Package:** `openai`

**Why:**
- Official OpenAI SDK
- Access to GPT-4o-mini for context filtering
- TypeScript support
- Streaming support

**Installation:**
```bash
npm install openai
```

**Usage for Context Optimization:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function optimizeContext(
  mcpOutput: string,
  userQuery: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a context optimization assistant. Extract only the relevant information from MCP output based on the user query.'
      },
      {
        role: 'user',
        content: `User query: ${userQuery}\n\nMCP output:\n${mcpOutput}\n\nExtract only relevant information:`
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  return response.choices[0].message.content || mcpOutput;
}
```

---

### 2. Anthropic SDK (Alternative)
**Package:** `@anthropic-ai/sdk`

**Why:**
- Use Claude Haiku for context optimization
- Potentially cheaper than OpenAI
- Better at following instructions
- Can use Anthropic credits

**Installation:**
```bash
npm install @anthropic-ai/sdk
```

**Usage:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function optimizeContextWithClaude(
  mcpOutput: string,
  userQuery: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `User query: ${userQuery}\n\nMCP output:\n${mcpOutput}\n\nExtract only the relevant information for this query.`
      }
    ]
  });

  return response.content[0].text;
}
```

---

## Project Analysis (AI-Powered Recommendations)

### 1. glob
**Package:** `glob`

**Why:**
- Find files matching patterns
- Scan project for package.json, requirements.txt, etc.
- Cross-platform (works on Windows, macOS, Linux)

**Installation:**
```bash
npm install glob
```

**Usage:**
```typescript
import { glob } from 'glob';

// Find all package.json files
const packageJsonFiles = await glob('**/package.json', {
  ignore: ['**/node_modules/**']
});

// Find Python projects
const pythonProjects = await glob('**/requirements.txt');
```

---

### 2. Project Analysis Strategy

**Tech Stack Detection:**
```typescript
interface ProjectAnalysis {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloudServices: string[];
  recommendedMCPs: string[];
}

async function analyzeProject(
  workspacePath: string
): Promise<ProjectAnalysis> {
  const analysis: ProjectAnalysis = {
    languages: [],
    frameworks: [],
    databases: [],
    cloudServices: [],
    recommendedMCPs: []
  };

  // Check for Node.js
  const packageJsonPath = path.join(workspacePath, 'package.json');
  if (await fileExists(packageJsonPath)) {
    analysis.languages.push('javascript', 'typescript');
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Detect frameworks
    if (pkg.dependencies?.react) analysis.frameworks.push('react');
    if (pkg.dependencies?.next) analysis.frameworks.push('nextjs');
    if (pkg.dependencies?.express) analysis.frameworks.push('express');

    // Recommend MCPs
    if (pkg.dependencies?.react) {
      analysis.recommendedMCPs.push('figma', 'github', 'tailwind');
    }
  }

  // Check for Python
  const requirementsPath = path.join(workspacePath, 'requirements.txt');
  if (await fileExists(requirementsPath)) {
    analysis.languages.push('python');
    const requirements = await fs.readFile(requirementsPath, 'utf-8');

    if (requirements.includes('django')) {
      analysis.frameworks.push('django');
      analysis.recommendedMCPs.push('postgres', 'redis');
    }
  }

  return analysis;
}
```

---

## Testing Frameworks

### 1. Mocha (Test Runner)
**Package:** `mocha`

**Why:**
- Default test framework for VS Code extensions
- Well-integrated with VS Code test infrastructure
- Supports async/await

**Installation:**
```bash
npm install -D mocha @types/mocha
```

---

### 2. VS Code Test Utilities
**Package:** `@vscode/test-electron`

**Why:**
- Run tests inside VS Code Extension Host
- Test actual extension behavior
- Official VS Code testing tool

**Installation:**
```bash
npm install -D @vscode/test-electron
```

**Test Script:**
```json
{
  "scripts": {
    "test": "vscode-test"
  }
}
```

---

### 3. Node Assert (Assertions)
**Built-in:** No installation needed

**Usage:**
```typescript
import * as assert from 'assert';

suite('SmitheryClient Tests', () => {
  test('Fetch servers', async () => {
    const servers = await smithery.getServers();
    assert.ok(servers.length > 0);
    assert.strictEqual(typeof servers[0].name, 'string');
  });
});
```

---

## Utility Libraries

### 1. npm-run-all
**Package:** `npm-run-all`

**Why:**
- Run multiple npm scripts in parallel or sequentially
- Used for watch mode (watch TypeScript + esbuild)

**Installation:**
```bash
npm install -D npm-run-all
```

**Usage:**
```json
{
  "scripts": {
    "watch": "npm-run-all -p watch:esbuild watch:tsc"
  }
}
```

---

### 2. ESLint + Prettier (Code Quality)
**Packages:** `eslint`, `prettier`, `@typescript-eslint/parser`

**Why:**
- Enforce code style consistency
- Catch bugs early
- Auto-formatting

**Installation:**
```bash
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**ESLint Config (.eslintrc.json):**
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

---

## VS Code Extension APIs We'll Use

### 1. Tree View Provider
**API:** `vscode.TreeDataProvider`

**Purpose:** Display MCP servers in sidebar

**Key Methods:**
```typescript
class MCPTreeProvider implements vscode.TreeDataProvider<MCPTreeItem> {
  getTreeItem(element: MCPTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MCPTreeItem): MCPTreeItem[] {
    // Return tree items
  }

  // Refresh tree when data changes
  private _onDidChangeTreeData = new vscode.EventEmitter<MCPTreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
```

---

### 2. Webview Panel
**API:** `vscode.window.createWebviewPanel`

**Purpose:** Rich HTML/CSS/JS UI for MCP browsing

**Usage:**
```typescript
const panel = vscode.window.createWebviewPanel(
  'mcpBrowser',
  'MCP Server Browser',
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(context.extensionUri, 'media')
    ]
  }
);

panel.webview.html = getWebviewContent();

// Handle messages from webview
panel.webview.onDidReceiveMessage(
  message => {
    if (message.command === 'install') {
      installMCP(message.serverName);
    }
  }
);
```

---

### 3. Commands
**API:** `vscode.commands.registerCommand`

**Purpose:** Register extension commands

**Usage:**
```typescript
const installCommand = vscode.commands.registerCommand(
  'clean.installMCP',
  async (serverName: string) => {
    await installMCP(serverName);
  }
);
context.subscriptions.push(installCommand);
```

---

### 4. Configuration
**API:** `vscode.workspace.getConfiguration`

**Purpose:** Store user settings

**Usage:**
```typescript
const config = vscode.workspace.getConfiguration('clean');
const contextOptimization = config.get<boolean>('enableContextOptimization', true);
const aggressiveness = config.get<number>('optimizationAggressiveness', 80);
```

**package.json configuration:**
```json
{
  "contributes": {
    "configuration": {
      "title": "Clean",
      "properties": {
        "clean.enableContextOptimization": {
          "type": "boolean",
          "default": true,
          "description": "Enable AI-powered context optimization"
        },
        "clean.optimizationAggressiveness": {
          "type": "number",
          "default": 80,
          "minimum": 0,
          "maximum": 100,
          "description": "How aggressively to filter context (0-100%)"
        }
      }
    }
  }
}
```

---

### 5. Status Bar
**API:** `vscode.window.createStatusBarItem`

**Purpose:** Show context savings

**Usage:**
```typescript
const statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);
statusBar.text = "$(zap) Clean: 2.3M tokens saved";
statusBar.tooltip = "Click to see details";
statusBar.command = 'clean.showStats';
statusBar.show();
context.subscriptions.push(statusBar);
```

---

### 6. Storage
**API:** `context.globalState`, `context.workspaceState`

**Purpose:** Persist data (cache, settings)

**Usage:**
```typescript
// Global storage (across workspaces)
await context.globalState.update('tokensSaved', 2300000);
const saved = context.globalState.get<number>('tokensSaved', 0);

// Workspace storage (per workspace)
await context.workspaceState.update('installedMCPs', ['postgres', 'github']);
```

---

## Complete package.json

```json
{
  "name": "clean",
  "displayName": "Clean - MCP Server Manager",
  "description": "The ultimate MCP server management extension",
  "version": "0.1.0",
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
        "command": "clean.refreshServers",
        "title": "Clean: Refresh MCP Servers"
      },
      {
        "command": "clean.installMCP",
        "title": "Clean: Install MCP Server"
      },
      {
        "command": "clean.browseMCPs",
        "title": "Clean: Browse MCP Servers"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "clean",
          "title": "Clean",
          "icon": "media/icon.svg"
        }
      ]
    },
    "views": {
      "clean": [
        {
          "id": "mcpServers",
          "name": "MCP Servers"
        }
      ]
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run package",
    "compile": "npm run check-types && node esbuild.js",
    "watch": "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch",
    "package": "npm run check-types && node esbuild.js --production",
    "check-types": "tsc --noEmit",
    "test": "vscode-test",
    "lint": "eslint src --ext ts"
  },
  "devDependencies": {
    "@types/vscode": "^1.95.0",
    "@types/node": "20.x",
    "@types/mocha": "^10.0.6",
    "@typescript-eslint/eslint-plugin": "^7.14.1",
    "@typescript-eslint/parser": "^7.11.0",
    "@vscode/test-electron": "^2.4.0",
    "@vscode/vsce": "^2.32.0",
    "esbuild": "^0.21.5",
    "eslint": "^8.57.0",
    "mocha": "^10.7.3",
    "npm-run-all": "^4.1.5",
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "jsonc-parser": "^3.3.1",
    "glob": "^11.0.0",
    "openai": "^4.57.0"
  }
}
```

---

## Installation Commands (Complete Setup)

```bash
# 1. Create extension with Yeoman
npx --package yo --package generator-code -- yo code

# 2. Install dependencies
npm install axios jsonc-parser glob openai

# 3. Install dev dependencies
npm install -D \
  @types/vscode@^1.95.0 \
  @types/node@20.x \
  @types/mocha@^10.0.6 \
  @typescript-eslint/eslint-plugin@^7.14.1 \
  @typescript-eslint/parser@^7.11.0 \
  @vscode/test-electron@^2.4.0 \
  esbuild@^0.21.5 \
  eslint@^8.57.0 \
  mocha@^10.7.3 \
  npm-run-all@^4.1.5 \
  typescript@^5.4.5

# 4. Install vsce globally (for publishing)
npm install -g @vscode/vsce
```

---

## Summary Checklist

**Core Setup:**
- [x] Node.js 20+
- [x] TypeScript 5.x
- [x] VS Code Extension API types
- [x] esbuild for fast compilation
- [x] vsce for packaging

**Libraries:**
- [x] axios (HTTP client for Smithery API)
- [x] jsonc-parser (safe JSON editing)
- [x] glob (file pattern matching)
- [x] openai (context optimization)

**Development Tools:**
- [x] ESLint + TypeScript ESLint
- [x] Mocha (testing)
- [x] @vscode/test-electron (extension tests)
- [x] npm-run-all (parallel scripts)

**VS Code APIs:**
- [x] TreeDataProvider (sidebar)
- [x] WebviewPanel (rich UI)
- [x] Commands (extension commands)
- [x] Configuration (user settings)
- [x] Status Bar (show stats)
- [x] Storage (cache and state)

**Next Steps:**
1. Run `yo code` to scaffold project
2. Install all dependencies
3. Set up project structure
4. Start building! =€

Now we have everything we need to build Clean!
