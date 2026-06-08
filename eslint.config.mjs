// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .prepend({
    ignores: ['scripts/**', 'docs/**', '.storybook/**', 'cypress/**'],
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  })
  .append({
    files: ['**/*.{spec,test}.ts', '**/*.stories.ts', 'tests/**'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  })
  .append({
    files: ['server/mocks/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  })
  .append({
    rules: {
      'vue/no-mutating-props': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 15],
    },
  })
