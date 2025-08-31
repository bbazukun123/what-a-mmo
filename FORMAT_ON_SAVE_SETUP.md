# Format on Save - Setup & Troubleshooting

## Quick Setup Checklist

### 1. Install Required VS Code Extensions

**Option A: From VS Code Extensions Panel**
1. Open VS Code
2. Press `Cmd+Shift+X` (or `Ctrl+Shift+X`)
3. Search for and install:
   - **Prettier - Code formatter** (by Prettier)
   - **ESLint** (by Microsoft)

**Option B: From Command Line**
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

**Option C: Use Extension Recommendations**
1. VS Code should show a notification asking if you want to install recommended extensions
2. Click "Install All" or "Show Recommendations" and install them manually

### 2. Verify Extensions are Active

1. Open VS Code
2. Press `Cmd+Shift+P` (or `Ctrl+Shift+P`) 
3. Type "Extensions: Show Installed Extensions"
4. Look for:
   - ✅ **Prettier - Code formatter** (enabled)
   - ✅ **ESLint** (enabled)

### 3. Test Format on Save

1. Open any `.ts` or `.js` file in the `client/src` directory
2. Add some messy formatting (extra spaces, wrong indentation, etc.)
3. Save the file (`Cmd+S` or `Ctrl+S`)
4. The file should auto-format immediately

---

## Troubleshooting

### Problem: Nothing happens on save

**Check 1: Extensions Installed?**
```bash
code --list-extensions | grep -E "(prettier|eslint)"
```
Should show:
- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

**Check 2: VS Code Settings**
1. Press `Cmd+,` (or `Ctrl+,`) to open settings
2. Search for "format on save"
3. Make sure "Editor: Format On Save" is checked ✅

**Check 3: Default Formatter**
1. Open a `.ts` file
2. Right-click → "Format Document With..."
3. Choose "Prettier - Code formatter"
4. Check "Set as default formatter for TypeScript files"

### Problem: Prettier works but ESLint doesn't

**Check 1: ESLint Extension Status**
1. Open any `.ts` file in `client/src`
2. Look at bottom status bar - should show "ESLint" 
3. If it shows errors, click on it to see details

**Check 2: ESLint Working Directory**
The project structure needs ESLint to work from the `client` directory. This is already configured in `.vscode/settings.json`.

**Check 3: Manual ESLint Test**
```bash
cd client
npm run lint
```
If this doesn't work, the VS Code extension won't work either.

### Problem: Format on save works but auto-fix doesn't

**Check Code Actions on Save Setting:**
1. Press `Cmd+,` (settings)
2. Search for "code actions on save"
3. Click "Edit in settings.json"
4. Should have:
```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
}
```

### Problem: Different behavior in different files

**File Association Check:**
Some file types might not be associated correctly. In VS Code:
1. Open the problematic file
2. Look at bottom-right corner for language mode
3. Click it and select the correct language (TypeScript, JavaScript, etc.)

### Problem: Settings not taking effect

**Reload VS Code:**
1. Press `Cmd+Shift+P`
2. Type "Developer: Reload Window"
3. Press Enter

---

## Manual Testing Commands

If auto-format isn't working, you can still use manual commands:

**Format Current File:**
- `Cmd+Shift+I` (or `Ctrl+Shift+I`)
- Or: `Cmd+Shift+P` → "Format Document"

**Fix ESLint Issues:**
- `Cmd+Shift+P` → "ESLint: Fix all auto-fixable Problems"

**Format and Fix via Terminal:**
```bash
cd client
npm run format     # Format all files
npm run lint:fix   # Fix ESLint issues
```

---

## Expected Behavior When Working

1. **On Save**: File should auto-format (indentation, quotes, etc.)
2. **Red Squiggles**: ESLint errors should show as red underlines
3. **Quick Fixes**: Hover over errors to see "Quick Fix" options
4. **Status Bar**: Should show "Prettier" and "ESLint" in bottom status bar

---

## Alternative: Use Git Hooks (if VS Code still doesn't work)

If you can't get VS Code format-on-save working, you can set up Git hooks:

```bash
# Install husky for Git hooks
cd client
npm install --save-dev husky lint-staged

# Add to package.json
npm pkg set scripts.prepare="husky install"
npm run prepare

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add lint-staged config to package.json
npm pkg set lint-staged.\"*.{js,jsx,ts,tsx,json,css,scss,md}\"="prettier --write"
npm pkg set lint-staged.\"*.{js,jsx,ts,tsx}\"="eslint --fix"
```

This will format and fix your code automatically when you commit.

---

## Still Having Issues?

1. **Check VS Code Version**: Make sure you're using a recent version
2. **Check Extension Versions**: Update Prettier and ESLint extensions
3. **Try Workspace vs User Settings**: The settings might be overridden
4. **Check Other Extensions**: Some extensions can conflict with formatting

**Debug Info Command:**
```bash
# Show current VS Code extensions
code --list-extensions --show-versions

# Show ESLint and Prettier versions
cd client
npm list eslint prettier
```
