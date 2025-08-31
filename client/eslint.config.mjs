import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

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

    // Custom rules
    {
        rules: {
            'jest/no-deprecated-functions': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            // Add other custom rules as needed
        },
    },
];
