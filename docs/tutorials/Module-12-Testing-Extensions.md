# Module 12: Testing Extensions

## Learning Objectives

- ✅ Write unit tests for extensions
- ✅ Run tests
- ✅ Test commands and features

## Core Concepts

Testing ensures your extension works correctly and prevents regressions.

---

## Test Structure

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
  });

  test('Command is registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('ext.myCommand'));
  });
});
```

---

## Run Tests

```bash
npm test
```

---

## Testing Commands

```typescript
test('Command shows message', async () => {
  await vscode.commands.executeCommand('ext.hello');
  // Assert that command executed correctly
});
```

---

## Testing with Mock Data

```typescript
test('Process file content', async () => {
  const doc = await vscode.workspace.openTextDocument({
    content: 'Hello World',
    language: 'plaintext'
  });

  const text = doc.getText();
  assert.strictEqual(text, 'Hello World');
});
```

---

## Key Takeaways

1. Write tests in `src/test/suite/` directory
2. Use `assert` for assertions
3. Test command registration and execution
4. Run tests with `npm test`

---

**Previous:** [Module 11: Debugging](./Module-11-Debugging-Extensions.md) | **Next:** [Module 13: Project Structure →](./Module-13-Project-Structure-Best-Practices.md)
