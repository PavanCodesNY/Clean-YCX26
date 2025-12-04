# How to Run & Test Clean Extension

## 🚀 Quick Start

### Method 1: Press F5 (Recommended)
1. Open this project in VS Code
2. Press **F5** on your keyboard
3. A new VS Code window will open (called "Extension Development Host")
4. That's where your extension is running!

### Method 2: Run & Debug Panel
1. Click the "Run and Debug" icon in the sidebar (play button with bug)
2. Click the green play button at the top
3. Select "Run Extension" if prompted
4. Extension Development Host window opens

---

## 👀 What You'll See

### 1. Clean Icon in Activity Bar (Left Sidebar)
Look for a new icon in the Activity Bar (the very left side of VS Code):
- It might show as the default icon until we add a custom one
- Click it to open the Clean sidebar

### 2. Clean Sidebar Panel
Once you click the Clean icon, you'll see:
```
📦 CLEAN - MCP SERVERS
  📂 All Servers (632)
    ├─ 💾 databases (45)
    ├─ ☁️ cloud-services (103)
    ├─ 🔧 developer-tools (87)
    └─ ... more categories
```

### 3. Loading State
When you first open it, you might see:
```
📦 CLEAN - MCP SERVERS
  Loading MCP servers...
```
Wait a few seconds while it fetches from Smithery API.

### 4. Toolbar Buttons
At the top of the Clean panel, you'll see:
- 🔄 **Refresh** button - Reload MCP servers
- 🔍 **Browse** button - Browse MCPs (coming soon)

---

## 🧪 How to Test Functionality

### Test 1: Browse Servers
1. Click on "📂 All Servers (632)"
2. You'll see categories expand:
   - 💾 databases
   - ☁️ cloud-services
   - 🔧 developer-tools
   - etc.
3. Click on any category (e.g., "💾 databases (45)")
4. You'll see individual MCP servers:
   - PostgreSQL MCP
   - MongoDB MCP
   - MySQL MCP
   - etc.

### Test 2: View Server Details
1. Hover over any MCP server
2. You'll see a tooltip with:
   - Server name
   - Description
   - Author
   - Version
   - Category
   - Repository link

### Test 3: Install a Server
1. **Click on any MCP server** in the list
2. A dialog will appear asking: "Install [Server Name]?"
3. Shows the command that will be run
4. Click **"Install"** to proceed or **"Cancel"** to abort
5. If you install:
   - Config file will be created/updated
   - Success message appears
   - Prompt to reload window appears
6. Click **"Reload Now"** to restart VS Code
7. Your MCP server is now installed!

### Test 4: Right-Click Context Menu
1. **Right-click** on any MCP server
2. You'll see options:
   - Install MCP Server
   - Show Server Details

### Test 5: Check Status Bar
Look at the bottom-right of the VS Code window:
- You should see: **"⚡ Clean"**
- Click it to see stats (basic for now)

### Test 6: Command Palette
1. Press **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows/Linux)
2. Type "Clean"
3. You'll see all Clean commands:
   - Clean: Refresh MCP Servers
   - Clean: Browse MCP Servers
   - Clean: Install MCP Server
   - Clean: Show Server Details
   - Clean: Show Context Optimization Stats

---

## 🔍 What Happens Behind the Scenes

### When You Install a Server:

1. **Config Detection**
   - Checks for `.mcp.json` in your workspace (Claude Code)
   - Checks for `.cursor/mcp.json` (Cursor)
   - Checks for `~/Library/Application Support/Code/User/mcp.json` (VS Code)

2. **Config Creation** (if needed)
   - Creates a new `.mcp.json` file in your workspace
   - Adds the basic structure:
   ```json
   {
     "mcpServers": {}
   }
   ```

3. **Server Installation**
   - Adds server to config file:
   ```json
   {
     "mcpServers": {
       "postgres": {
         "command": "npx",
         "args": ["-y", "@smithery/postgres"]
       }
     }
   }
   ```

4. **Backup Created**
   - Saves `.mcp.json.backup` before modifying
   - Can restore if something goes wrong

---

## 📂 Where to Find Your Config File

After installing a server, check:

**Claude Code / Project-based:**
```bash
cat .mcp.json
```

**VS Code (macOS):**
```bash
cat ~/Library/Application\ Support/Code/User/mcp.json
```

**VS Code (Windows):**
```cmd
type %APPDATA%\Code\User\mcp.json
```

**VS Code (Linux):**
```bash
cat ~/.config/Code/User/mcp.json
```

---

## 🐛 Debugging

### View Console Logs
In the Extension Development Host window:
1. Press **Cmd+Shift+P** (or Ctrl+Shift+P)
2. Type "Developer: Toggle Developer Tools"
3. Click on "Console" tab
4. You'll see logs like:
   ```
   [Clean] Extension activating...
   [Clean] Fetched 632 MCP servers from Smithery
   [Clean] Extension activated successfully!
   ```

### Check for Errors
If something doesn't work:
1. Open Developer Tools (as above)
2. Look for red error messages
3. Check the "Problems" panel in VS Code
4. Look at the Debug Console in the main VS Code window

---

## 🎨 What the UI Looks Like

### Activity Bar (Left Side)
```
┌─────┐
│  🏠  │  Explorer
│  🔍  │  Search
│  🔀  │  Source Control
│  🐛  │  Run & Debug
│  📦  │  Extensions
│  🧹  │  ← CLEAN (your extension)
└─────┘
```

### Sidebar Panel (When Clean is Active)
```
┌───────────────────────────────────┐
│ 📦 MCP SERVERS         🔄 🔍     │
├───────────────────────────────────┤
│ 📂 All Servers (632)              │
│   ├─ 💾 databases (45)            │
│   │   ├─ PostgreSQL MCP           │
│   │   ├─ MongoDB MCP              │
│   │   └─ MySQL MCP                │
│   ├─ ☁️ cloud-services (103)      │
│   │   ├─ AWS MCP                  │
│   │   ├─ Google Cloud MCP         │
│   │   └─ Azure MCP                │
│   ├─ 🔧 developer-tools (87)      │
│   └─ ... more categories          │
└───────────────────────────────────┘
```

### Install Dialog
```
┌─────────────────────────────────────────┐
│  Install PostgreSQL MCP?                │
│                                         │
│  This will add the MCP server to your  │
│  claude-code configuration.            │
│                                         │
│  Command: npx -y @smithery/postgres    │
│                                         │
│         [ Install ]  [ Cancel ]         │
└─────────────────────────────────────────┘
```

### Reload Prompt
```
┌─────────────────────────────────────────┐
│  PostgreSQL MCP installed successfully! │
│  Reload window to activate?             │
│                                         │
│      [ Reload Now ]  [ Later ]          │
└─────────────────────────────────────────┘
```

---

## 🚨 Common Issues

### Issue 1: Extension Doesn't Appear
**Solution:**
- Make sure you pressed F5 in the **main VS Code window** (not the Extension Development Host)
- Wait a few seconds for the extension to activate
- Look for the "Clean" icon in the Activity Bar

### Issue 2: "Loading..." Never Finishes
**Solution:**
- Check your internet connection (needs to reach Smithery API)
- Open Developer Tools and check Console for errors
- Try clicking the Refresh button (🔄)

### Issue 3: Can't See Servers
**Solution:**
- Click on "📂 All Servers (632)" to expand
- Then click on a category to see individual servers

### Issue 4: Install Button Doesn't Work
**Solution:**
- Check Debug Console for errors
- Make sure you have write permissions in your workspace
- Try installing a different server

---

## ✅ Quick Test Checklist

- [ ] Press F5 to launch Extension Development Host
- [ ] See "Clean MCP Manager activated! 🧹" notification
- [ ] See Clean icon in Activity Bar
- [ ] Click Clean icon to open sidebar
- [ ] See "Loading MCP servers..." then see server count
- [ ] Click "📂 All Servers" to expand
- [ ] Click "💾 databases" to see servers
- [ ] Click on "PostgreSQL MCP" server
- [ ] See install dialog
- [ ] Click "Install"
- [ ] See `.mcp.json` file created in workspace
- [ ] See reload prompt
- [ ] Check `.mcp.json` has server config

---

## 📸 Next Steps

After you test and confirm everything works:
1. Take screenshots of the UI
2. Test installing 2-3 different servers
3. Verify `.mcp.json` is created correctly
4. Test the refresh button
5. Try the search feature (coming in Week 3)

---

**Happy Testing! 🚀**

If you see any errors or unexpected behavior, check the Developer Tools Console for debug logs.
