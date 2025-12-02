# 🎓 VS Code Extension Development Learning Path

Welcome to your complete guide to mastering VS Code extension development! This curriculum takes you from beginner to proficient through 30 focused modules.

## 📋 How to Use This Curriculum

1. **Follow the numbered order** - Each module builds on previous knowledge
2. **Complete the exercises** - Hands-on practice is essential
3. **Don't skip the fundamentals** - Modules 01-10 are critical
4. **Build the projects** - Apply your knowledge with real extensions
5. **Keep the cheat sheet handy** - Module 24 is your quick reference

## 🎯 Learning Objectives

By the end of this curriculum, you will:
- ✅ Understand VS Code extension architecture deeply
- ✅ Master all essential VS Code APIs
- ✅ Write clean, maintainable extension code
- ✅ Debug and test extensions professionally
- ✅ Build complex features (webviews, tree views, language support)
- ✅ Package and publish extensions to the marketplace
- ✅ Have 3+ working extensions in your portfolio

## 📚 Curriculum Structure (30 Modules)

### Part 1: Foundation (Start Here!)
**Time Estimate: 3-4 hours**

- [Module 01: Environment Setup](./Module-01-Environment-Setup.md)
  - Install Node.js, Yeoman, generator-code
  - Create your first extension
  - Understand the generated files

- [Module 02: Extension Architecture](./Module-02-Extension-Architecture.md)
  - Extension lifecycle
  - package.json vs extension.ts
  - How VS Code loads extensions

- [Module 03: Activation Events](./Module-03-Activation-Events.md)
  - When extensions "wake up"
  - Types of activation events
  - Performance best practices

### Part 2: Essential APIs (The Building Blocks)
**Time Estimate: 4-5 hours**

- [Module 04: Commands API](./Module-04-Commands-API.md)
  - Register and execute commands
  - Command with arguments
  - Built-in commands

- [Module 05: Window API](./Module-05-Window-API.md)
  - Show messages and dialogs
  - Input boxes and quick picks
  - Working with text editors

- [Module 06: Workspace API](./Module-06-Workspace-API.md)
  - File system operations
  - Configuration management
  - Event listeners

- [Module 07: TextEditor API](./Module-07-TextEditor-API.md)
  - Reading and editing code
  - Selections and ranges
  - Document manipulation

### Part 3: Critical Concepts (Professional Practices)
**Time Estimate: 3-4 hours**

- [Module 08: Disposables & Memory Management](./Module-08-Disposables-Memory-Management.md)
  - Prevent memory leaks
  - Proper cleanup
  - context.subscriptions

- [Module 09: Configuration & Settings](./Module-09-Configuration-Settings.md)
  - User settings
  - Workspace vs global config
  - Configuration changes

- [Module 10: Async/Await Patterns](./Module-10-Async-Await-Patterns.md)
  - Async commands
  - Progress indicators
  - Cancellation tokens

### Part 4: Development Workflow (Professional Tools)
**Time Estimate: 3-4 hours**

- [Module 11: Debugging Extensions](./Module-11-Debugging-Extensions.md)
  - Launch with F5
  - Breakpoints and inspection
  - Debug console

- [Module 12: Testing Extensions](./Module-12-Testing-Extensions.md)
  - Writing unit tests
  - Running tests
  - Test-driven development

- [Module 13: Project Structure Best Practices](./Module-13-Project-Structure-Best-Practices.md)
  - Organizing your code
  - Scaling your extension
  - Folder architecture

### Part 5: Advanced Features (UI & Interaction)
**Time Estimate: 5-6 hours**

- [Module 14: Status Bar Items](./Module-14-Status-Bar-Items.md)
  - Creating status bar widgets
  - Icons and commands
  - Dynamic updates

- [Module 15: Tree Views](./Module-15-Tree-Views.md)
  - Custom sidebar panels
  - Tree data providers
  - Refresh and interactions

- [Module 16: Webviews](./Module-16-Webviews.md)
  - HTML/CSS/JS in VS Code
  - Extension ↔ webview communication
  - Security considerations

- [Module 17: File Watchers](./Module-17-File-Watchers.md)
  - Watching file changes
  - Glob patterns
  - Event handling

### Part 6: Language Features (IntelliSense & More)
**Time Estimate: 4-5 hours**

- [Module 18: Completion Provider](./Module-18-Completion-Provider.md)
  - Building IntelliSense
  - Completion items
  - Context-aware suggestions

- [Module 19: Hover Provider](./Module-19-Hover-Provider.md)
  - Information on hover
  - Markdown formatting
  - Documentation tooltips

- [Module 20: Code Actions](./Module-20-Code-Actions.md)
  - Quick fixes
  - Refactoring actions
  - Light bulb menu

### Part 7: Polish & Publishing (Going Professional)
**Time Estimate: 3-4 hours**

- [Module 21: Icons & Branding](./Module-21-Icons-and-Branding.md)
  - Extension icons
  - README best practices
  - Marketplace presentation

- [Module 22: Packaging Extensions](./Module-22-Packaging-Extensions.md)
  - Creating .vsix files
  - vsce commands
  - Testing packages

- [Module 23: Publishing to Marketplace](./Module-23-Publishing-to-Marketplace.md)
  - Publisher account setup
  - Publishing workflow
  - Version management

- [Module 24: Common Patterns Cheatsheet](./Module-24-Common-Patterns-Cheatsheet.md)
  - Copy-paste ready code
  - Quick reference
  - Best practice patterns

### Part 8: Hands-On Projects (Apply Your Knowledge!)
**Time Estimate: 6-8 hours**

- [Project 01: Text Transformer](./Project-01-Text-Transformer.md)
  - Build: Uppercase/lowercase/reverse text
  - Complete step-by-step guide
  - Your first working extension!

- [Project 02: TODO Tracker](./Project-02-TODO-Tracker.md)
  - Build: Scan workspace for TODOs
  - Tree view implementation
  - File watching

- [Project 03: Status Bar Timer](./Project-03-Status-Bar-Timer.md)
  - Build: Code time tracker
  - Persistent storage
  - Status bar integration

### Supporting Resources

- [COMMANDS-REFERENCE.md](./COMMANDS-REFERENCE.md)
  - Quick command lookup
  - Terminal commands
  - Keyboard shortcuts

- [99-Resources-and-Links.md](./99-Resources-and-Links.md)
  - Official documentation
  - Useful packages
  - Community resources

## ⏱️ Time Estimates

**Total Time to Completion: 35-45 hours**

Breakdown:
- Foundation (Parts 1-3): 10-13 hours
- Workflow & Advanced (Parts 4-5): 8-10 hours
- Language Features & Publishing (Parts 6-7): 7-9 hours
- Hands-On Projects (Part 8): 6-8 hours
- Practice & Review: 4-5 hours

**Suggested Schedule:**

**Week 1: Foundation**
- Day 1-2: Modules 01-03 (Environment & Architecture)
- Day 3-4: Modules 04-07 (Essential APIs)
- Day 5-6: Modules 08-10 (Critical Concepts)
- Day 7: Review and practice

**Week 2: Development & Advanced Features**
- Day 1-2: Modules 11-13 (Development Workflow)
- Day 3-4: Modules 14-16 (Advanced Features)
- Day 5-6: Module 17 + Project 01 (File Watchers + Text Transformer)
- Day 7: Review and practice

**Week 3: Language Features & Polish**
- Day 1-2: Modules 18-20 (Language Features)
- Day 3-4: Modules 21-23 (Publishing)
- Day 5-6: Project 02 (TODO Tracker)
- Day 7: Review

**Week 4: Projects & Mastery**
- Day 1-3: Project 03 (Status Bar Timer)
- Day 4-5: Build your own extension idea
- Day 6-7: Polish and publish

## 🎯 Prerequisites

**Before starting this curriculum:**

✅ **Basic JavaScript/TypeScript knowledge**
- Variables, functions, classes
- Promises and async/await
- ES6+ features (arrow functions, destructuring, etc.)

✅ **VS Code familiarity**
- Know how to use VS Code
- Command Palette (⇧⌘P / Ctrl+Shift+P)
- Basic navigation

✅ **Terminal/Command Line basics**
- Navigate directories (cd, ls)
- Run commands (npm, node)

✅ **Git basics** (helpful but not required)
- clone, commit, push
- Basic version control

**Don't have these yet?**
- [JavaScript Fundamentals (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [VS Code Basics](https://code.visualstudio.com/docs/getstarted/userinterface)

## 📈 Progress Tracking

Use this checklist to track your progress:

### Foundation
- [ ] Module 01: Environment Setup
- [ ] Module 02: Extension Architecture
- [ ] Module 03: Activation Events

### Essential APIs
- [ ] Module 04: Commands API
- [ ] Module 05: Window API
- [ ] Module 06: Workspace API
- [ ] Module 07: TextEditor API

### Critical Concepts
- [ ] Module 08: Disposables & Memory Management
- [ ] Module 09: Configuration & Settings
- [ ] Module 10: Async/Await Patterns

### Development Workflow
- [ ] Module 11: Debugging Extensions
- [ ] Module 12: Testing Extensions
- [ ] Module 13: Project Structure Best Practices

### Advanced Features
- [ ] Module 14: Status Bar Items
- [ ] Module 15: Tree Views
- [ ] Module 16: Webviews
- [ ] Module 17: File Watchers

### Language Features
- [ ] Module 18: Completion Provider
- [ ] Module 19: Hover Provider
- [ ] Module 20: Code Actions

### Polish & Publishing
- [ ] Module 21: Icons & Branding
- [ ] Module 22: Packaging Extensions
- [ ] Module 23: Publishing to Marketplace
- [ ] Module 24: Common Patterns Cheatsheet

### Hands-On Projects
- [ ] Project 01: Text Transformer
- [ ] Project 02: TODO Tracker
- [ ] Project 03: Status Bar Timer

## 🎓 Learning Tips

1. **Code Along** - Don't just read, type the code yourself
2. **Break When Needed** - 25-minute focused sessions work well
3. **Debug Everything** - Use F5 liberally to see how things work
4. **Read Error Messages** - They're your best teacher
5. **Experiment** - Modify examples to see what happens
6. **Build Your Own** - After Project 03, create something unique
7. **Join Community** - Ask questions, share your progress
8. **Keep Module 24 Open** - The cheatsheet is your friend

## 🚀 Getting Started

**Ready to begin?**

👉 **Start with [Module 01: Environment Setup](./Module-01-Environment-Setup.md)**

This will get your development environment ready and create your first extension!

## 🎯 After Completing This Curriculum

You'll be ready to:
- Build production-quality VS Code extensions
- Understand and modify existing extensions
- Contribute to open-source extensions
- Create extensions for Cursor, Windsurf, VS Code Insiders
- Monetize your extensions (if desired)
- Apply for extension development jobs

## 📞 Need Help?

- **Stuck on a module?** Re-read the prerequisites
- **Code not working?** Check Module 11 (Debugging)
- **Concept unclear?** Review the official VS Code API docs
- **Want more examples?** Check the [VS Code extension samples repo](https://github.com/microsoft/vscode-extension-samples)

## 🌟 Final Note

Extension development is a **superpower**. You're about to learn how to customize and extend the tool you use every day. This knowledge compounds - every extension you build makes you faster at building the next one.

**Let's get started!** 🚀

---

**Next Step:** [Module 01: Environment Setup →](./Module-01-Environment-Setup.md)
