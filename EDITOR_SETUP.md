# Editor Setup for Auto-Format on Save

This project is configured with ESLint and Prettier for code formatting and linting. Here's how to set up automatic formatting on file save for different editors:

## VS Code (Recommended)

The project includes `.vscode/settings.json` which automatically configures:
- Format on save with Prettier
- Auto-fix ESLint issues on save
- Proper working directories for the monorepo structure

### Required Extensions:
1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)

Install these extensions and the settings will automatically apply.

### Manual Installation:
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

## WebStorm / IntelliJ IDEA

1. **Enable Prettier:**
   - Go to `Settings` → `Languages & Frameworks` → `JavaScript` → `Prettier`
   - Set Prettier package to `client/node_modules/prettier`
   - Set Configuration file to `client/.prettierrc.json`
   - Check "On save" and "On code reformat"

2. **Enable ESLint:**
   - Go to `Settings` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`
   - Choose "Automatic ESLint configuration"
   - Set Working directories to `client`
   - Check "Run eslint --fix on save"

3. **Configure File Watchers (Alternative):**
   - Go to `Settings` → `Tools` → `File Watchers`
   - Add watchers for Prettier and ESLint with scope set to your project files

## Neovim

Add this to your Neovim configuration:

```lua
-- For null-ls or none-ls
local null_ls = require("null-ls")
null_ls.setup({
  sources = {
    null_ls.builtins.formatting.prettier.with({
      extra_filetypes = { "svelte" },
    }),
    null_ls.builtins.diagnostics.eslint,
    null_ls.builtins.code_actions.eslint,
  },
})

-- Auto-format on save
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = "*.{js,jsx,ts,tsx,json,css,scss,html,md}",
  callback = function()
    vim.lsp.buf.format()
  end,
})
```

## Sublime Text

1. **Install Package Control**
2. **Install packages:**
   - `SublimeLinter`
   - `SublimeLinter-eslint`
   - `JsPrettier`

3. **Configure JsPrettier:**
   - `Preferences` → `Package Settings` → `JsPrettier` → `Settings`
   - Add:
```json
{
  "auto_format_on_save": true,
  "prettier_cli_path": "client/node_modules/.bin/prettier",
  "prettier_options": {
    "configPath": "client/.prettierrc.json"
  }
}
```

## Vim

Add this to your `.vimrc`:

```vim
" Auto-format with Prettier on save
autocmd BufWritePre *.js,*.jsx,*.ts,*.tsx,*.json,*.css,*.scss,*.html,*.md :silent !cd client && npx prettier --write %:p

" ESLint integration
let g:ale_linters = {
\   'javascript': ['eslint'],
\   'typescript': ['eslint'],
\}
let g:ale_fixers = {
\   'javascript': ['eslint'],
\   'typescript': ['eslint'],
\}
let g:ale_fix_on_save = 1
```

## Emacs

Add to your Emacs configuration:

```elisp
;; Prettier
(use-package prettier-js
  :ensure t
  :hook ((js-mode . prettier-js-mode)
         (typescript-mode . prettier-js-mode)))

;; ESLint
(use-package flycheck
  :ensure t
  :init (global-flycheck-mode))

;; Auto-format on save
(add-hook 'before-save-hook 'prettier-js)
```

## Manual Commands

You can also run formatting and linting manually using the npm scripts:

```bash
# Format all files
cd client && npm run format

# Check formatting without changing files
cd client && npm run format:check

# Lint all files
cd client && npm run lint

# Lint and auto-fix issues
cd client && npm run lint:fix
```

## EditorConfig

The project includes an `.editorconfig` file that provides basic formatting rules for any editor that supports EditorConfig (most modern editors do). This ensures consistent indentation and line endings regardless of your editor choice.

## Troubleshooting

1. **VS Code not formatting:** Make sure you have the Prettier extension installed and enabled
2. **ESLint not working:** Ensure ESLint extension is installed and the working directory is set correctly
3. **Format on save not working:** Check that `editor.formatOnSave` is enabled in your editor settings
4. **Different formatting than expected:** Verify that your editor is using the correct config files (`.prettierrc.json` and `.eslintrc.json`)

## Project Structure Note

This project has a monorepo structure where the main client code is in the `client/` directory. Make sure your editor plugins are configured to look for config files in the correct location.
