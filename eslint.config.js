import { FlatCompat } from '@eslint/eslintrc';
import eslintPlugin from '@angular-eslint/eslint-plugin';
import eslintPluginTemplate from '@angular-eslint/eslint-plugin-template';
import typescriptParser from '@typescript-eslint/parser';

const compat = new FlatCompat();

export default [
  {
    files: ['*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@angular-eslint': eslintPlugin,
    },
    rules: {
      // Add your custom rules here
    },
    extends: ['plugin:@angular-eslint/recommended'],
  },
  {
    files: ['*.html'],
    plugins: {
      '@angular-eslint/template': eslintPluginTemplate,
    },
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
      // Add your custom rules here
    },
  },
];
