# Agent Instructions for Clean (YC X26)

## 🎯 Project Context

**You are building Clean - a VS Code extension that becomes the ONLY MCP server enterprises and developers need.**

**Core Mission:** Intelligently discover, recommend, install, and optimize MCP servers while solving context clogging through AI-powered filtering.

**Status:** Week 1 (Foundation phase)
**Target:** YC X26 application
**Timeline:** 4-week MVP to marketplace

---

## 🚨 CRITICAL DIRECTIVES

### Always Do

✅ **Research latest versions** before installing ANY package (use Context7)
✅ **Use TypeScript** (strict mode) for all code
✅ **Use jsonc-parser** for config file editing (NEVER JSON.stringify)
✅ **Create backups** before modifying user config files
✅ **Test in Extension Development Host** (F5) before suggesting code
✅ **Read `docs/` files** before implementing features
✅ **Prioritize context optimization** - it's the killer feature

### Never Do

❌ **Never break user config files** (always use jsonc-parser)
❌ **Never use `*` activation event** (use `onStartupFinished`)
❌ **Never assume package versions** (always research latest)
❌ **Never skip error handling** on API calls
❌ **Never use JSON.stringify** for config editing (loses formatting)
❌ **Never forget to push disposables** to context.subscriptions

---

## 🔥 The Four Differentiators

**NO competitor has even ONE of these. Clean has ALL FOUR.**

### 1. Context Optimization (KILLER FEATURE - TOP PRIORITY)
- MCPs return 10K-500K tokens → Clean filters to 500-5K tokens (70-90% reduction)
- Use GPT-4o-mini or Claude Haiku for filtering
- Implementation: `src/services/contextOptimizer.ts`
- **This is what makes Clean unbeatable**

### 2. AI-Powered MCP Selection
- Scan package.json, requirements.txt → recommend relevant MCPs
- Implementation: `src/services/projectAnalyzer.ts`
- Example: React → Figma, GitHub, Tailwind MCPs

### 3. VS Code-Native Experience
- Tree view sidebar + webview panel (NOT web-based, NOT CLI)
- Implementation: `src/providers/mcpTreeProvider.ts`, `src/providers/webviewProvider.ts`
- One-click install, zero context switching

### 4. Router Architecture (Enterprise Feature)
- Clean becomes MCP server that routes to all others
- 1 MCP config instead of 50+
- Phase 2 feature (after MVP)

---

## 📁 Project Structure Reference

```
src/
├── extension.ts              # Entry point
├── commands/                 # Command implementations
│   ├── installMCP.ts
│   ├── searchMCP.ts
│   ├── browseMCPs.ts
│   └── refreshServers.ts
├── providers/                # VS Code providers
│   ├── mcpTreeProvider.ts    # Sidebar (TreeDataProvider)
│   └── webviewProvider.ts    # Webview panel
├── services/                 # Business logic
│   ├── smitheryClient.ts     # Smithery API (24h cache)
│   ├── mcpInstaller.ts       # Install logic
│   ├── projectAnalyzer.ts    # Tech stack detection
│   ├── contextOptimizer.ts   # LLM filtering (CRITICAL)
│   └── configManager.ts      # Safe JSON editing
├── models/                   # TypeScript interfaces
│   ├── MCPServer.ts
│   ├── InstallConfig.ts
│   └── ProjectAnalysis.ts
└── webview/                  # Webview UI
    ├── index.html
    ├── main.ts
    └── styles.css
```

---

## 🛠️ Implementation Patterns

### Smithery API Integration

```typescript
// ALWAYS cache for 24 hours
import axios from 'axios';

const response = await axios.get<MCPServer[]>(
  'https://registry.smithery.ai/servers',
  {
    headers: { 'User-Agent': 'Clean-VSCode-Extension/1.0.0' },
    timeout: 10000
  }
);

// Cache in context.globalStorageUri
const cachePath = path.join(context.globalStorageUri.fsPath, 'smithery-cache.json');
```

### Safe JSON Config Editing (CRITICAL)

```typescript
// ✅ CORRECT: Use jsonc-parser
import * as jsonc from 'jsonc-parser';

const content = await fs.readFile('.mcp.json', 'utf-8');
const edits = jsonc.modify(content, ['mcpServers', 'postgres'], mcpConfig, {});
const newContent = jsonc.applyEdits(content, edits);

// ❌ WRONG: JSON.stringify loses comments and formatting
const obj = JSON.parse(content);
obj.mcpServers.postgres = mcpConfig;
const newContent = JSON.stringify(obj, null, 2); // DON'T DO THIS
```

### Context Optimization (KILLER FEATURE)

```typescript
import OpenAI from 'openai';

async function optimizeContext(mcpOutput: string, userQuery: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Extract only relevant info from MCP output for user query.'
      },
      {
        role: 'user',
        content: `Query: ${userQuery}\n\nMCP output:\n${mcpOutput}\n\nExtract:`
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  return response.choices[0].message.content || mcpOutput;
}
```

### Project Analysis

```typescript
async function analyzeProject(workspacePath: string): Promise<string[]> {
  const recommended: string[] = [];

  // Check Node.js
  const pkg = await readPackageJson(workspacePath);
  if (pkg?.dependencies?.react) recommended.push('figma', 'github', 'tailwind');
  if (pkg?.dependencies?.next) recommended.push('vercel');

  // Check Python
  const requirements = await readRequirementsTxt(workspacePath);
  if (requirements?.includes('django')) recommended.push('postgres', 'redis');

  return recommended;
}
```

### TreeDataProvider Pattern

```typescript
export class MCPTreeProvider implements vscode.TreeDataProvider<MCPTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<MCPTreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: MCPTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MCPTreeItem): MCPTreeItem[] {
    // Return tree structure
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
```

### Error Handling Pattern

```typescript
// ALWAYS wrap API calls
try {
  const servers = await smitheryClient.getServers();
} catch (error) {
  vscode.window.showErrorMessage(
    `Failed: ${error instanceof Error ? error.message : String(error)}`
  );
  console.error('Error:', error);
  // Fallback to cache if available
}
```

---

## 📚 Documentation Reference

**Before implementing ANY feature, read these:**

1. **docs/Competitors.md** — Why we beat Metorial, mcp-use, HyperSpell, etc.
2. **docs/SmitheryIntegration.md** — Complete Smithery API guide + SmitheryClient code
3. **docs/ToolsToUse.md** — All dependencies, install commands, tech stack
4. **docs/UniqueSellingPoint.md** — Deep dive on 4 differentiators with examples
5. **docs/VSCodeExtension.md** — Complete implementation guide (tree view, webview, etc.)

**Tutorials:** `docs/tutorials/` (30 modules for learning VS Code extensions)

---

## 🔑 Key VS Code Extension Concepts

### Extension Manifest (package.json)

```json
{
  "engines": { "vscode": "^1.95.0" },
  "activationEvents": ["onStartupFinished"],  // NOT "*"
  "main": "./dist/extension.js",
  "contributes": {
    "viewsContainers": {
      "activitybar": [{ "id": "clean", "title": "Clean", "icon": "media/icon.svg" }]
    },
    "views": {
      "clean": [{ "id": "mcpServers", "name": "MCP Servers" }]
    },
    "commands": [
      { "command": "clean.installMCP", "title": "Clean: Install MCP Server" }
    ]
  }
}
```

### Extension Activation

```typescript
export async function activate(context: vscode.ExtensionContext) {
  // Initialize services
  const smitheryClient = new SmitheryClient(context);
  const treeProvider = new MCPTreeProvider(context, smitheryClient);

  // Register tree view
  const treeView = vscode.window.createTreeView('mcpServers', {
    treeDataProvider: treeProvider
  });
  context.subscriptions.push(treeView);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('clean.installMCP', async (server) => {
      await installMCP(server);
    })
  );

  // Initialize data
  await treeProvider.initialize();
}
```

### Storage Locations

```typescript
// Global storage (across workspaces)
context.globalState.update('tokensSaved', 2300000);
const saved = context.globalState.get<number>('tokensSaved', 0);

// File cache (Smithery catalog)
const cachePath = path.join(context.globalStorageUri.fsPath, 'smithery-cache.json');

// Workspace storage (per project)
context.workspaceState.update('installedMCPs', ['postgres', 'github']);
```

---

## ⚠️ Common Gotchas

### 1. Config File Detection

```typescript
// Check for .mcp.json (Claude Code/Cursor)
const claudeCodePath = path.join(workspaceFolder.uri.fsPath, '.mcp.json');

// Check for mcp.json (VS Code)
const vscodeConfigPath = path.join(process.env.HOME || '', '.vscode', 'mcp.json');
```

### 2. Extension Host Restart

```typescript
// After installing MCP, prompt to reload
const choice = await vscode.window.showInformationMessage(
  'MCP installed. Reload window to activate?',
  'Reload Now',
  'Later'
);

if (choice === 'Reload Now') {
  await vscode.commands.executeCommand('workbench.action.reloadWindow');
}
```

### 3. Webview CSP

```typescript
// MUST include nonce for Content Security Policy
const nonce = getNonce();

const html = `
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 script-src 'nonce-${nonce}';
                 style-src ${webview.cspSource} 'unsafe-inline';">
  <script nonce="${nonce}" src="${scriptUri}"></script>
`;
```

### 4. Disposables

```typescript
// ALWAYS push to context.subscriptions
const statusBar = vscode.window.createStatusBarItem();
statusBar.show();
context.subscriptions.push(statusBar); // CRITICAL - prevents memory leaks
```

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Current)
1. **Smithery API integration** (`smitheryClient.ts`)
2. **Basic tree view** (`mcpTreeProvider.ts`)
3. **Display MCP catalog** with categories

### Phase 2: Installation
1. **Config file detection** (`configManager.ts`)
2. **Safe JSON editing** with jsonc-parser
3. **One-click install** (`mcpInstaller.ts`)
4. **Extension host restart** handling

### Phase 3: AI Features (CRITICAL)
1. **Project analysis** (`projectAnalyzer.ts`)
2. **AI recommendations** (tech stack → MCP mapping)
3. **Context optimization** (`contextOptimizer.ts`) - KILLER FEATURE
4. **Metrics tracking** (tokens saved)

### Phase 4: Polish
1. **Rich webview UI** (`webviewProvider.ts`)
2. **Comprehensive testing**
3. **Package & publish** (vsce)
4. **YC application materials**

---

## 🧪 Testing & Debugging

### Debug Extension
```bash
# Press F5 in VS Code
# Extension Development Host opens
# Test commands in Command Palette (Cmd+Shift+P)
# Set breakpoints in TypeScript
```

### Package Locally
```bash
vsce package
code --install-extension clean-0.1.0.vsix
```

### Publish to Marketplace
```bash
vsce login your-publisher-name
vsce publish
```

---

## 📊 Success Criteria

### Week 1 (Now)
- [ ] Scaffold extension with `yo code`
- [ ] Smithery API working with 24h cache
- [ ] Tree view displays 600+ MCPs
- [ ] Categories working

### Week 2
- [ ] One-click install working
- [ ] Config file editing safe (jsonc-parser)
- [ ] Extension host restart smooth

### Week 3 (CRITICAL)
- [ ] AI recommendations accurate (80%+ precision)
- [ ] Context optimization working (70%+ reduction)
- [ ] Metrics tracking (tokens saved)

### Week 4
- [ ] Rich webview UI polished
- [ ] Extension published to marketplace
- [ ] 5-star rating
- [ ] YC application ready

---

## 🔒 Security & Safety

### API Keys
```typescript
// Store in VS Code secrets (NOT in code)
const apiKey = await context.secrets.get('OPENAI_API_KEY');
if (!apiKey) {
  vscode.window.showErrorMessage('OpenAI API key not configured');
  return;
}
```

### Config Backup
```typescript
// ALWAYS backup before editing
const backupPath = `${configPath}.backup`;
await fs.copyFile(configPath, backupPath);

try {
  // Edit config
} catch (error) {
  // Restore from backup
  await fs.copyFile(backupPath, configPath);
}
```

### Input Validation
```typescript
// Validate MCP server name
if (!/^[a-z0-9-_]+$/.test(serverName)) {
  throw new Error('Invalid MCP server name');
}
```

---

## 🚀 Quick Reference

### Tech Stack
- Node.js 20+, TypeScript 5.x, VS Code API ^1.95.0
- axios, jsonc-parser, glob, openai
- esbuild (NOT webpack)

### External APIs
- Smithery: `https://registry.smithery.ai/servers`
- Context7: `@context7 vscode extension api`

### Config Files
- Claude Code: `.mcp.json` (project root)
- VS Code: `~/.vscode/mcp.json`

### Key Commands
```bash
yo code                    # Scaffold extension
npm run compile            # Build
npm run watch              # Watch mode
vsce package               # Package
vsce publish               # Publish
```

### Debug Keys
- **F5** - Start debugging (Extension Development Host)
- **Cmd+Shift+P** - Command Palette
- **Cmd+R** - Reload Extension Development Host

---

## 💡 When Stuck

1. **Check `docs/` folder** for detailed guides
2. **Use Context7** for latest VS Code API docs
3. **Read `docs/VSCodeExtension.md`** for implementation examples
4. **Test in Extension Development Host** (F5)
5. **Review official VS Code samples** on GitHub

---

## 🎯 Mission Critical Reminders

1. **Context optimization is THE killer feature** - prioritize above all else
2. **Never break user config files** - always use jsonc-parser, always backup
3. **AI recommendations must be accurate** - bad suggestions lose trust
4. **One-click install must be flawless** - user frustration = uninstall
5. **Always research latest versions** - use Context7, check 2025 docs

**This is a YC-caliber startup. Build with excellence. 🚀**
