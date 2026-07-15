import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...tseslint.configs.recommended.map(c => ({
    ...c,
    files: ['src/**/*.ts'],
  })),
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        MouseEvent: 'readonly',
        Event: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'error',
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
  prettierConfig,
  {
    ignores: ['dist/', 'node_modules/', '*.config.*', 'cris/', '.agents/'],
  },
)
