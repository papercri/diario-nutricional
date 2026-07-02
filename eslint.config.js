import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.*'],
  },
]
