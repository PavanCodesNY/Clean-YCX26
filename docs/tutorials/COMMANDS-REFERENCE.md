# 📝 VS Code Extension Development - Commands Reference

Quick reference for all the terminal commands, npm scripts, and keyboard shortcuts you'll need.

## 📦 Installation Commands

### Node.js & Package Managers

```bash
# Check Node.js version (need 20+)
node --version

# Check npm version
npm --version

# Update npm to latest
npm install -g npm@latest
```

### Extension Development Tools

```bash
# Install Yeoman and VS Code Extension Generator (global)
npm install -g yo generator-code

# Install vsce (VS Code Extension Manager) - for packaging/publishing
npm install -g @vscode/vsce

# Or use npx (no global install needed)
npx --package yo --package generator-code -- yo code
```

## 🏗️ Project Creation

### Create New Extension

```bash
# Using global installation
yo code

# Using npx (recommended - no global install)
npx --package yo --package generator-code -- yo code
```

**Interactive Options:**
- Extension type: `New Extension (TypeScript)` ← Recommended
- Name: Your extension name
- Identifier: Extension ID (lowercase, no spaces)
- Description: Brief description
- Initialize git: `Y`
- Bundler: `esbuild` ← Recommended (faster than webpack)
- Package manager: `npm`
- Open in VS Code: `Y`

## 📁 Navigate to Project

```bash
# Go to project directory
cd my-extension-name

# Open in VS Code
code .
```

## 🔧 Development Commands

### npm Scripts (from package.json)

```bash
# Install dependencies (first time or after cloning)
npm install

# Compile TypeScript once
npm run compile

# Watch mode - auto-recompile on file changes
npm run watch

# Type checking without emitting files
npm run check-types

# Package for production (minified, optimized)
npm run package

# Run tests
npm test
npm run test

# Lint code
npm run lint
```

### Manual TypeScript Compilation

```bash
# Compile TypeScript
tsc -p ./

# Watch mode
tsc -watch -p ./

# Type check only (no output)
tsc --noEmit
```

## 🐛 Debugging Commands

### VS Code Keyboard Shortcuts

```bash
# Start Debugging (Launch Extension Development Host)
F5

# Stop Debugging
Shift + F5

# Restart Debugging
Ctrl + Shift + F5  (macOS: Cmd + Shift + F5)

# Step Over (in debugger)
F10

# Step Into
F11

# Step Out
Shift + F11

# Continue
F5
```

### Debug Console

```bash
# Open Debug Console
Ctrl + Shift + Y  (macOS: Cmd + Shift + Y)

# View Output Panel
Ctrl + Shift + U  (macOS: Cmd + Shift + U)
```

## 📦 Packaging Commands

### Using vsce

```bash
# Package extension into .vsix file
vsce package

# Package specific version
vsce package --version 1.0.0

# Package without yarn (use npm)
vsce package --no-yarn

# Package and skip npm install
vsce package --no-dependencies
```

### Test Packaged Extension

```bash
# Install .vsix file locally
code --install-extension my-extension-0.0.1.vsix

# Uninstall extension
code --uninstall-extension publisher.extension-id

# List installed extensions
code --list-extensions
```

## 🚀 Publishing Commands

### Publisher Management

```bash
# Create publisher (first time)
vsce create-publisher publisher-name

# Login to publisher account
vsce login publisher-name

# Logout
vsce logout publisher-name

# List publishers
vsce list-publishers
```

### Publish Extension

```bash
# Publish current version
vsce publish

# Publish with version bump
vsce publish patch   # 0.0.1 -> 0.0.2
vsce publish minor   # 0.0.1 -> 0.1.0
vsce publish major   # 0.0.1 -> 1.0.0

# Publish specific version
vsce publish 1.2.3

# Unpublish extension (careful!)
vsce unpublish publisher.extension-name
```

### Show Extension Info

```bash
# Show extension details
vsce show publisher.extension-name

# Show extension statistics
vsce show publisher.extension-name --stats
```

## 🧪 Testing Commands

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "test name"

# Run tests in watch mode (if configured)
npm run test:watch
```

## 🔍 VS Code CLI Commands

### Extension Management

```bash
# List installed extensions
code --list-extensions

# Install extension
code --install-extension publisher.extension-name

# Uninstall extension
code --uninstall-extension publisher.extension-name

# Disable all extensions
code --disable-extensions

# Open specific folder
code /path/to/folder

# Open file at specific line
code file.ts:10:5
```

### Extension Development Host

```bash
# Launch Extension Development Host with specific folder
code --extensionDevelopmentPath=/path/to/extension /path/to/test-workspace
```

## 📋 Git Commands (Version Control)

### Common Git Workflow

```bash
# Initialize git repository
git init

# Check status
git status

# Add files to staging
git add .

# Commit changes
git commit -m "Your commit message"

# Create new branch
git checkout -b feature-branch

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

## 🛠️ Utility Commands

### Clean/Reset

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Remove dist/out folder
rm -rf dist
rm -rf out

# Clean install (removes node_modules and package-lock.json)
rm -rf node_modules package-lock.json
npm install
```

### File Operations

```bash
# List files
ls -la

# Show file contents
cat file.ts

# Find files
find . -name "*.ts"

# Search in files (grep)
grep -r "searchText" ./src
```

## ⚙️ VS Code Command Palette Commands

**Open Command Palette:** `Ctrl + Shift + P` (macOS: `Cmd + Shift + P`)

### Development

```
Developer: Reload Window
Developer: Open Extension Development Host
Developer: Inspect Editor Tokens and Scopes
Developer: Show Running Extensions
```

### Extension Commands

```
Extensions: Install from VSIX...
Extensions: Show Installed Extensions
Extensions: Disable All Installed Extensions
Extensions: Enable All Extensions
```

### Debugging

```
Debug: Start Debugging (F5)
Debug: Stop Debugging (Shift+F5)
Debug: Restart Debugging
Debug: Add Configuration...
```

## 🔧 Environment Variables

### Set Node Version (if using nvm)

```bash
# Install specific Node version
nvm install 20

# Use specific Node version
nvm use 20

# Set default Node version
nvm alias default 20
```

### Set npm Registry (if needed)

```bash
# View current registry
npm config get registry

# Set registry
npm config set registry https://registry.npmjs.org/

# Use yarn instead of npm (in vsce)
vsce package --yarn
```

## 📊 Useful One-Liners

### Check Extension Size

```bash
# Show size of packaged extension
ls -lh *.vsix

# Show size of dist folder
du -sh dist/
```

### Find VS Code Installation

```bash
# macOS
which code

# Windows (PowerShell)
Get-Command code

# Linux
which code
```

### Clean and Rebuild

```bash
# Full clean and rebuild
rm -rf node_modules dist out package-lock.json && npm install && npm run compile
```

### Watch and Debug Simultaneously

```bash
# Terminal 1: Watch mode
npm run watch

# Terminal 2 or VS Code: Press F5 to debug
```

## 🎯 Quick Start Workflow

### First Time Setup

```bash
# 1. Install tools
npm install -g yo generator-code @vscode/vsce

# 2. Create extension
yo code

# 3. Navigate to project
cd my-extension

# 4. Install dependencies
npm install

# 5. Open in VS Code
code .

# 6. Press F5 to debug
```

### Daily Development Workflow

```bash
# 1. Start watch mode
npm run watch

# 2. Press F5 in VS Code to start debugging

# 3. Make changes to code (auto-recompiles)

# 4. Reload Extension Development Host:
#    - Ctrl+R (macOS: Cmd+R) in Extension Development Host
#    - Or: Restart debugging (Ctrl+Shift+F5)

# 5. Test your changes

# 6. Commit when done
git add .
git commit -m "Add feature X"
```

### Publishing Workflow

```bash
# 1. Update version in package.json (or use vsce publish command)

# 2. Build production package
npm run package

# 3. Test the package
vsce package
code --install-extension my-extension-0.0.1.vsix

# 4. If all good, publish
vsce publish

# 5. Tag release in git
git tag v0.0.1
git push --tags
```

## 🆘 Troubleshooting Commands

### Extension Not Loading

```bash
# Check VS Code version compatibility
code --version

# Show running extensions
# In VS Code: Developer: Show Running Extensions

# Clear extension cache
rm -rf ~/.vscode/extensions/publisher.extension-name-*
```

### Build Errors

```bash
# Clean and rebuild
npm run clean  # if script exists
npm run compile

# Or manually
rm -rf dist out
npm run compile
```

### Type Errors

```bash
# Update @types/vscode to match engine version
npm install -D @types/vscode@^1.95.0

# Run type check
npm run check-types
```

## 📚 Additional Resources

### View Package Info

```bash
# Show package.json
cat package.json

# Show installed packages
npm list --depth=0

# Show outdated packages
npm outdated

# Update packages
npm update
```

### Generate package-lock.json

```bash
# Create or update package-lock.json
npm install
```

## 🎓 Learning Commands

### Explore VS Code API

```bash
# Search for VS Code API packages
npm search @types/vscode

# View package documentation
npm docs @types/vscode
```

---

## 💡 Pro Tips

1. **Keep `npm run watch` running** while developing
2. **Use F5 liberally** - restarting is fast
3. **Check `package.json` scripts** - projects may have custom commands
4. **Use `vsce package` before publishing** - test the .vsix first
5. **Commit often** - extensions are code, version control is your friend

---

**Back to:** [Learning Path](./00-Learning-Path.md)

**Next Module:** [Module 01: Environment Setup →](./Module-01-Environment-Setup.md)
