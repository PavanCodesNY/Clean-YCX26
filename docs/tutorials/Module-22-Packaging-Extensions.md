# Module 22: Packaging Extensions

## Learning Objectives

- ✅ Install vsce
- ✅ Create .vsix files
- ✅ Test packaged extensions

## Install vsce

```bash
npm install -g @vscode/vsce
```

## Package Extension

```bash
# Package extension
vsce package

# Creates: my-extension-0.0.1.vsix
```

## Test Packaged Extension

```bash
# Install .vsix file
code --install-extension my-extension-0.0.1.vsix

# Test it in VS Code

# Uninstall when done testing
code --uninstall-extension publisher.extension-id
```

## .vscodeignore

Exclude files from package:

```
.vscode/**
.vscode-test/**
src/**
.gitignore
tsconfig.json
*.vsix
node_modules/**/.bin/**
```

## Package with Version

```bash
# Specify version
vsce package --version 1.0.0

# Or update package.json manually
```

## Key Takeaways

1. Use `vsce package` to create .vsix files
2. Test packaged extension before publishing
3. Use .vscodeignore to exclude unnecessary files
4. Package creates a single .vsix file for distribution

---

**Previous:** [Module 21: Icons & Branding](./Module-21-Icons-and-Branding.md) | **Next:** [Module 23: Publishing →](./Module-23-Publishing-to-Marketplace.md)
