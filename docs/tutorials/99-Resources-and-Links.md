# 99: Resources & Links

## Official Documentation

- **VS Code Extension API:** https://code.visualstudio.com/api
- **Extension Guides:** https://code.visualstudio.com/api/extension-guides/overview
- **API Reference:** https://code.visualstudio.com/api/references/vscode-api
- **Extension Samples:** https://github.com/microsoft/vscode-extension-samples
- **Extension Guidelines:** https://code.visualstudio.com/api/references/extension-guidelines

## Tools & Libraries

### Development Tools
- **Yeoman:** https://yeoman.io/
- **generator-code:** https://www.npmjs.com/package/generator-code
- **vsce:** https://github.com/microsoft/vscode-vsce

### TypeScript
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **TypeScript Playground:** https://www.typescriptlang.org/play

### Testing
- **Mocha:** https://mochajs.org/
- **@vscode/test-electron:** https://www.npmjs.com/package/@vscode/test-electron

## Useful npm Packages

```bash
# VS Code API types
npm install -D @types/vscode

# Node types
npm install -D @types/node

# Localization
npm install vscode-nls

# URI utilities
npm install vscode-uri
```

## Icons

- **Codicons (VS Code Icons):** https://microsoft.github.io/vscode-codicons/dist/codicon.html
- **Icon Preview:** Use `$(iconName)` syntax in text

## Publishing

- **Marketplace:** https://marketplace.visualstudio.com/
- **Publisher Management:** https://marketplace.visualstudio.com/manage
- **Azure DevOps:** https://dev.azure.com/

## Community

- **VS Code GitHub:** https://github.com/microsoft/vscode
- **Extension Samples:** https://github.com/microsoft/vscode-extension-samples
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/vscode-extensions
- **VS Code Discussions:** https://github.com/microsoft/vscode/discussions

## Language Identifiers

Full list: https://code.visualstudio.com/docs/languages/identifiers

Common ones:
- `javascript`, `typescript`
- `python`, `java`, `csharp`
- `html`, `css`, `json`
- `markdown`, `yaml`

## When Clause Contexts

Full reference: https://code.visualstudio.com/api/references/when-clause-contexts

Common ones:
- `editorTextFocus`
- `editorHasSelection`
- `editorLangId == javascript`
- `resourceExtname == .md`

## Built-in Commands

Reference: https://code.visualstudio.com/api/references/commands

Useful commands:
- `workbench.action.files.save`
- `editor.action.formatDocument`
- `workbench.action.showCommands`
- `vscode.open`

## Extension Examples

Study these successful extensions:

1. **ESLint:** https://github.com/microsoft/vscode-eslint
2. **Prettier:** https://github.com/prettier/prettier-vscode
3. **GitLens:** https://github.com/gitkraken/vscode-gitlens
4. **Thunder Client:** API testing
5. **Live Server:** Local development server

## Books & Courses

- **VS Code Extension Development** (Search on Udemy, Pluralsight)
- Read official guides end-to-end
- Study extension samples repository

## Best Practices

1. Always research latest versions (VS Code updates monthly!)
2. Use Context7 for up-to-date documentation
3. Read VS Code release notes for new APIs
4. Study popular extensions' source code
5. Test on different platforms (Windows, Mac, Linux)

## Getting Help

1. Check official documentation first
2. Search GitHub issues
3. Ask on Stack Overflow with tag `vscode-extensions`
4. Join VS Code community on Discord/Slack
5. Read VS Code extension samples

---

**Congratulations!**

You've completed the VS Code Extension Development curriculum! You now have all the knowledge needed to build professional extensions.

**What's Next?**
1. Build your own extension idea
2. Publish to the marketplace
3. Contribute to open-source extensions
4. Join the VS Code extension developer community

**Good luck building amazing extensions!** 🚀

---

**Back to:** [Learning Path](./00-Learning-Path.md)
