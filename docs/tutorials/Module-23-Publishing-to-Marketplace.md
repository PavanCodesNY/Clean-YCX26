# Module 23: Publishing to Marketplace

## Learning Objectives

- ✅ Create publisher account
- ✅ Get Azure DevOps token
- ✅ Publish extensions
- ✅ Manage versions

## Create Publisher Account

1. Go to https://marketplace.visualstudio.com/manage
2. Click "Create publisher"
3. Fill in details:
   - Publisher ID (unique)
   - Display name
   - Email

## Get Personal Access Token

1. Go to https://dev.azure.com
2. Sign in with same account
3. User Settings > Personal Access Tokens
4. New Token:
   - Name: vsce
   - Organization: All accessible organizations
   - Scopes: Marketplace > Manage
5. Copy token (you won't see it again!)

## Login to Publisher

```bash
vsce login your-publisher-name
# Paste token when prompted
```

## Publish Extension

```bash
# Publish current version
vsce publish

# Or publish with version bump
vsce publish patch   # 0.0.1 -> 0.0.2
vsce publish minor   # 0.0.1 -> 0.1.0
vsce publish major   # 0.0.1 -> 1.0.0
```

## Update Extension

1. Make changes
2. Update version in package.json
3. Update CHANGELOG.md
4. Publish:

```bash
vsce publish
```

## Unpublish Extension

```bash
# Careful! This removes extension from marketplace
vsce unpublish publisher.extension-name
```

## Key Takeaways

1. Create publisher account at marketplace.visualstudio.com
2. Get Personal Access Token from Azure DevOps
3. Use `vsce publish` to publish
4. Update version in package.json before publishing
5. Document changes in CHANGELOG.md

---

**Previous:** [Module 22: Packaging](./Module-22-Packaging-Extensions.md) | **Next:** [Module 24: Common Patterns →](./Module-24-Common-Patterns-Cheatsheet.md)
