import js from '@eslint.ts'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules/', 'dist/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {},
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
  },
]
