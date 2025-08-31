import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    // Apply to all JS/TS files
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    },

    // Global ignores (equivalent to .eslintignore)
    {
        ignores: ['libs/**/*', 'dist/**/*', 'build/**/*', 'node_modules/**/*'],
    },

    // Base recommended configs
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // Prettier integration
    {
        plugins: {
            prettier,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
        },
    },

    // Unused imports management
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    // Custom rules
    {
        rules: {
            'jest/no-deprecated-functions': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            // Disable the default unused vars rule in favor of the unused-imports plugin
            '@typescript-eslint/no-unused-vars': 'off',
            // Add other custom rules as needed
        },
    },
];
