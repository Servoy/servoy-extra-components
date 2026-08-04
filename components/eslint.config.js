// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const stylisticTs = require('@stylistic/eslint-plugin-ts');
const onlyWarn = require('eslint-plugin-only-warn');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: {
      'only-warn': onlyWarn,
      '@stylistic/ts': stylisticTs
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'property',
          modifiers: ['readonly', 'static'],
          format: ['UPPER_CASE']
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['servoyextra'],
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['servoyextra'],
          style: 'camelCase'
        }
      ],
      '@angular-eslint/use-lifecycle-interface': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@stylistic/ts/quotes': ['warn', 'single', { avoidEscape: true }],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit'
        }
      ],
      'brace-style': ['error', '1tbs'],
      'curly': 'off',
      'id-blacklist': 'off',
      'id-match': 'off',
      'max-len': ['error', { code: 200 }],
      'no-underscore-dangle': 'off',
      'valid-typeof': 'error'
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended
    ],
    rules: {}
  }
);
