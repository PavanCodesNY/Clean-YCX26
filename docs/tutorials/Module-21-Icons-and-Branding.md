# Module 21: Icons & Branding

## Learning Objectives

- ✅ Add extension icon
- ✅ Write compelling README
- ✅ Create marketplace screenshots

## Extension Icon

1. Create a 128x128 PNG icon
2. Save as `media/icon.png`
3. Add to package.json:

```json
{
  "icon": "media/icon.png"
}
```

## README Best Practices

```markdown
# Extension Name

Brief description in one sentence.

## Features

- Feature 1 with screenshot
- Feature 2 with screenshot
- Feature 3 with screenshot

## Usage

1. Open Command Palette (Ctrl+Shift+P)
2. Run "My Extension: Command Name"
3. Result!

## Requirements

- VS Code 1.95.0 or higher

## Extension Settings

* `myExt.enabled`: Enable/disable this extension
* `myExt.maxItems`: Maximum items to show

## Known Issues

List any known issues here.

## Release Notes

### 1.0.0

Initial release with basic features.
```

## Key Takeaways

1. Icon should be 128x128 PNG
2. README should have clear features and usage
3. Include screenshots for visual features
4. Document settings and requirements

---

**Previous:** [Module 20: Code Actions](./Module-20-Code-Actions.md) | **Next:** [Module 22: Packaging →](./Module-22-Packaging-Extensions.md)
