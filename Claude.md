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

## 🔒 CONFIDENTIAL PROJECT: Clean (Manifesting YC X26)

### Vision Statement

**Clean is a VS Code extension that becomes the ONLY MCP server enterprises and developers need.**

It intelligently discovers, recommends, installs, and optimizes MCP (Model Context Protocol) servers based on project context, while solving the critical problem of **context clogging** through AI-powered filtering.

**The Problem:**
- 600+ MCP servers exist - how do you know which ones to use?
- MCPs can return 50MB of data, clogging AI context windows
- No IDE-native MCP management (everything is web-based or CLI)
- Enterprises can't manage 50+ MCP servers per developer

**Clean's Solution:**
Clean is the intelligent MCP manager that saves developers time and tokens by making MCP discovery effortless and context optimization automatic.

---

### The Four Differentiators 🔥

**NO competitor has even ONE of these features. Clean has ALL FOUR.**

#### 1. Context Optimization (KILLER FEATURE)
- **Problem:** MCPs return 10,000 - 500,000 tokens per call, clogging context windows
- **Solution:** AI-powered filtering reduces output by 70-90% while preserving relevance
- **Tech:** Lightweight LLM (GPT-4o-mini or Claude Haiku) filters MCP responses before sending to AI
- **Impact:** Save millions of tokens daily, faster AI responses, lower costs

#### 2. AI-Powered MCP Selection
- **Problem:** 600+ MCPs, manual browsing takes 2-4 hours to find right ones
- **Solution:** Scan project (package.json, requirements.txt), recommend relevant MCPs
- **Example:** React project → Suggests Figma, GitHub, Tailwind MCPs automatically
- **Impact:** 5-second setup vs. hours of research

#### 3. VS Code-Native Experience
- **Problem:** Existing solutions are web-based (Metorial) or CLI-based (mcp-use)
- **Solution:** Tree view sidebar + rich webview panel, integrated into daily workflow
- **Features:** One-click install, inline search, never leave IDE
- **Impact:** Zero context switching, 10x faster than competitors

#### 4. Router Architecture (Enterprise Feature)
- **Problem:** Enterprises managing 50+ MCP servers per developer (config hell)
- **Solution:** Clean itself becomes an MCP server that routes to all others
- **Result:** Configure 1 MCP (Clean) instead of 50+
- **Impact:** 5-minute onboarding vs. 4 hours, centralized security, usage analytics

**Competitive Moat:** Building all four features takes 12+ months. We're first to market.

---

### Market Position

**Competitors:**
- **Metorial (YC F25):** Web-based MCP hosting, no context optimization, no AI recommendations
- **mcp-use (YC S25):** CLI infrastructure tool, developer-focused, not consumer-friendly
- **HyperSpell (YC F25):** Memory MCPs only (narrow focus)
- **The Context Company (YC F25):** Observability (reactive), not optimization (proactive)
- **Smithery.ai:** Registry only, no management features

**Clean's Unique Position:**
- Only VS Code-native MCP manager
- Only product with context optimization
- Only product with AI-powered recommendations
- Only product with enterprise router architecture

See `docs/Competitors.md` for full analysis.

---

### Success Metrics

**MVP (Week 4):**
- 100 weekly active users
- 1,000+ MCP installations
- 10M+ tokens saved
- 5-star VS Code Marketplace rating

**YC Application:**
- 1,000 WAU
- 1 enterprise customer using router architecture
- Clear product-market fit signals
- 10%+ week-over-week growth

---

## Tech Stack

### Core Technologies
- **Node.js**: 20+ LTS
- **TypeScript**: 5.x (strict mode)
- **VS Code API**: ^1.95.0 (latest)
- **esbuild**: Fast compilation (10-100x faster than webpack)

### Key Libraries
- **axios**: HTTP client for Smithery API
- **jsonc-parser**: Safe JSON editing (preserves formatting)
- **glob**: Project file pattern matching
- **openai** OR **@anthropic-ai/sdk**: Context optimization

### VS Code Extension APIs Used
- `vscode.TreeDataProvider` — Sidebar tree view
- `vscode.WebviewPanel` — Rich HTML/CSS/JS UI
- `vscode.commands` — Extension commands
- `vscode.workspace` — File/config access
- `vscode.window` — UI components (messages, status bar)

### External Integration
- **Smithery REST API**: `https://registry.smithery.ai/servers`
- **MCP Protocol**: Install to `.mcp.json` (Claude Code) or `mcp.json` (VS Code)

---

## Documentation Files (Read These!)

All comprehensive documentation is in `docs/`:

1. **docs/Competitors.md** — Competitive analysis, market positioning, pricing strategy
2. **docs/SmitheryIntegration.md** — Smithery API docs, caching, complete SmitheryClient code
3. **docs/ToolsToUse.md** — Full tech stack, dependencies, installation commands
4. **docs/UniqueSellingPoint.md** — Deep dive on all 4 differentiators with examples
5. **docs/VSCodeExtension.md** — Complete implementation guide (tree view, webview, config editing)

**Tutorials for learning:** `docs/tutorials/` (30 modules, beginner to advanced)

---

## Project Structure

```
Clean/
├── src/
│   ├── extension.ts              # Entry point
│   │
│   ├── commands/                 # Command implementations
│   │   ├── installMCP.ts
│   │   ├── searchMCP.ts
│   │   ├── browseMCPs.ts
│   │   ├── refreshServers.ts
│   │   └── optimizeContext.ts
│   │
│   ├── providers/                # VS Code providers
│   │   ├── mcpTreeProvider.ts    # Sidebar tree view
│   │   └── webviewProvider.ts    # Rich UI panel
│   │
│   ├── services/                 # Business logic
│   │   ├── smitheryClient.ts     # Smithery API integration
│   │   ├── mcpInstaller.ts       # Installation logic
│   │   ├── projectAnalyzer.ts    # Tech stack detection
│   │   ├── contextOptimizer.ts   # Context filtering (LLM)
│   │   └── configManager.ts      # Safe JSON editing
│   │
│   ├── models/                   # TypeScript types
│   │   ├── MCPServer.ts
│   │   ├── InstallConfig.ts
│   │   └── ProjectAnalysis.ts
│   │
│   └── webview/                  # Webview UI
│       ├── index.html
│       ├── main.ts
│       └── styles.css
│
├── docs/                         # Documentation
│   ├── Competitors.md
│   ├── SmitheryIntegration.md
│   ├── ToolsToUse.md
│   ├── UniqueSellingPoint.md
│   ├── VSCodeExtension.md
│   └── tutorials/                # 30 learning modules
│
├── media/                        # Icons
├── package.json                  # Extension manifest
├── tsconfig.json
├── esbuild.js
└── README.md
```

---

## Implementation Roadmap

### Week 1: Foundation + Discovery
- Scaffold extension with `yo code`
- Build `smitheryClient.ts` service
- Implement basic tree view (sidebar)
- Display MCP catalog with categories

### Week 2: Installation + Configuration
- Detect AI tool (Claude Code vs. Cursor vs. VS Code)
- Implement safe JSON editing with jsonc-parser
- One-click MCP installation
- Extension host restart handling

### Week 3: AI Features
- Build `projectAnalyzer.ts` (tech stack detection)
- AI-powered MCP recommendations
- Implement context optimization MVP (LLM filtering)
- Add metrics tracking (tokens saved)

### Week 4: Polish + Launch
- Build rich webview UI (HTML/CSS/JS)
- Comprehensive testing
- Package extension (vsce)
- Publish to VS Code Marketplace
- Prepare YC application materials

**Current Phase:** Week 1 (Foundation)

---

## Key Implementation Patterns

### 1. Smithery API Integration

```typescript
import axios from 'axios';

const response = await axios.get<MCPServer[]>(
  'https://registry.smithery.ai/servers',
  {
    headers: { 'User-Agent': 'Clean-VSCode-Extension/1.0.0' },
    timeout: 10000
  }
);

const servers = response.data;
// Cache for 24 hours in context.globalStorageUri
```

### 2. Safe JSON Config Editing

```typescript
import * as jsonc from 'jsonc-parser';

// Read .mcp.json
const content = await fs.readFile('.mcp.json', 'utf-8');

// Modify using jsonc-parser (preserves comments/formatting)
const edits = jsonc.modify(
  content,
  ['mcpServers', 'postgres'],
  {
    command: 'npx',
    args: ['-y', '@smithery/postgres-mcp']
  },
  {}
);

const newContent = jsonc.applyEdits(content, edits);
await fs.writeFile('.mcp.json', newContent, 'utf-8');
```

### 3. Context Optimization

```typescript
import OpenAI from 'openai';

async function optimizeContext(
  mcpOutput: string,
  userQuery: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Extract only relevant info from MCP output for user query.'
      },
      {
        role: 'user',
        content: `Query: ${userQuery}\n\nMCP output:\n${mcpOutput}\n\nExtract relevant info:`
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  return response.choices[0].message.content || mcpOutput;
}
```

### 4. Project Analysis

```typescript
async function analyzeProject(workspacePath: string): Promise<string[]> {
  const recommendedMCPs: string[] = [];

  // Check for Node.js
  const packageJsonPath = path.join(workspacePath, 'package.json');
  if (await fileExists(packageJsonPath)) {
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    if (pkg.dependencies?.react) {
      recommendedMCPs.push('figma', 'github', 'tailwind');
    }
    if (pkg.dependencies?.next) {
      recommendedMCPs.push('vercel');
    }
  }

  // Check for Python
  const requirementsPath = path.join(workspacePath, 'requirements.txt');
  if (await fileExists(requirementsPath)) {
    const content = await fs.readFile(requirementsPath, 'utf-8');
    if (content.includes('django')) {
      recommendedMCPs.push('postgres', 'redis');
    }
  }

  return recommendedMCPs;
}
```

---

## VS Code Extension Essentials

### Activation Events

```json
{
  "activationEvents": [
    "onStartupFinished"
  ]
}
```

**Note:** Use `onStartupFinished` instead of `*` to avoid slowing VS Code startup.

### Tree View Registration

```json
{
  "contributes": {
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
  }
}
```

### Webview with CSP

```typescript
const panel = vscode.window.createWebviewPanel(
  'cleanBrowser',
  'Clean - MCP Browser',
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [
      vscode.Uri.joinPath(context.extensionUri, 'media')
    ]
  }
);

panel.webview.html = getWebviewContent();

// Handle messages from webview
panel.webview.onDidReceiveMessage(async (message) => {
  if (message.command === 'install') {
    await installMCP(message.serverName);
  }
});
```

### Extension Context Storage

```typescript
// Global storage (across workspaces)
await context.globalState.update('tokensSaved', 2300000);
const saved = context.globalState.get<number>('tokensSaved', 0);

// Workspace storage (per workspace)
await context.workspaceState.update('installedMCPs', ['postgres', 'github']);

// File storage (cache)
const cachePath = path.join(context.globalStorageUri.fsPath, 'smithery-cache.json');
```

---

## Common Gotchas (VS Code Specific)

1. **Activation Events** — Extension won't load without proper activation events
2. **Disposables** — Always push to `context.subscriptions` for cleanup
3. **Paths** — Use `vscode.Uri` for paths, not string concatenation
4. **Extension Host** — Extensions run in separate process from UI
5. **Webview CSP** — Content Security Policy required for webviews
6. **Reload Window** — MCPs only load after `workbench.action.reloadWindow`
7. **Config Files** — Use jsonc-parser for safe JSON editing (handles comments)

---

## Testing & Debugging

### Run Extension in Debug Mode

1. Press **F5** in VS Code
2. Extension Development Host window opens
3. Test commands via Command Palette (Cmd+Shift+P)
4. Set breakpoints in TypeScript code
5. Check console logs in Debug Console

### Package for Local Testing

```bash
# Package extension
vsce package

# Install .vsix file
code --install-extension clean-0.1.0.vsix

# Test in real VS Code
```

---

## Publishing

### 1. Create Publisher Account

- Go to https://marketplace.visualstudio.com/manage
- Create publisher account
- Get Personal Access Token (PAT) from Azure DevOps

### 2. Package & Publish

```bash
# Install vsce
npm install -g @vscode/vsce

# Login
vsce login your-publisher-name

# Publish
vsce publish

# Or publish with version bump
vsce publish patch  # 0.1.0 -> 0.1.1
```

---

## Notes for AI Agents

### Critical Priorities

1. **Context Optimization is the KILLER FEATURE** — prioritize this above all else
2. **One-click install must be flawless** — user frustration = uninstall
3. **AI recommendations must be accurate** — bad suggestions lose trust
4. **Never break user's config files** — always use jsonc-parser, always backup

### Development Guidelines

- **Always use TypeScript** (strict mode)
- **Test in Extension Development Host** before publishing (F5)
- **Use Context7** for latest VS Code API documentation
- **Read docs/ files** before implementing features
- **Check `docs/VSCodeExtension.md`** for complete implementation examples

### Research-First Approach

1. **Use Context7** to fetch official documentation
2. **Always search for latest versions** (2025 releases)
3. **Check VS Code release notes** for breaking changes
4. **Verify compatibility** with minimum VS Code version

### Safe File Operations

```typescript
// ✅ Good: Use jsonc-parser
const edits = jsonc.modify(content, ['key'], value, {});
const newContent = jsonc.applyEdits(content, edits);

// ❌ Bad: JSON.stringify (loses formatting)
const obj = JSON.parse(content);
obj.key = value;
const newContent = JSON.stringify(obj, null, 2);
```

### Error Handling

```typescript
// Always wrap API calls
try {
  const servers = await smitheryClient.getServers();
} catch (error) {
  vscode.window.showErrorMessage(
    `Failed to fetch MCP servers: ${error instanceof Error ? error.message : String(error)}`
  );
  console.error('Smithery API error:', error);
}
```

---

## When in Doubt

1. **Check `docs/` folder** — comprehensive guides for all features
2. **Use Context7** for VS Code API documentation
3. **Search for LATEST docs** (2025 versions)
4. **Test in Extension Development Host** (F5)
5. **Review official VS Code extension samples** on GitHub

---

## Official Resources

- **VS Code Extension API**: https://code.visualstudio.com/api
- **Extension Samples**: https://github.com/microsoft/vscode-extension-samples
- **Publishing Guide**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Smithery API**: https://registry.smithery.ai/servers
- **Clean Docs**: See `docs/` folder

---

**This is a YC-caliber startup. Let's build something incredible! 🚀**
