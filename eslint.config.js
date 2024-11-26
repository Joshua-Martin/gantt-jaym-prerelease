import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      '@typescript-eslint': tseslint,
    'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
    },
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
    'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      'react/react-in-jsx-scope': 'off', // Disable the rule since React 17+ doesn't require it
      'no-unused-vars': 'off', // Handled by TypeScript
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
    'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
        // Automatically detect the React version
        // Specify the JSX runtime
        pragma: 'React',
        fragment: 'Fragment',
      },
    },
  },
];
