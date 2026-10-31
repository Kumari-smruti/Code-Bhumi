export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/**/*.ts', 'src/**/*.tsx'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: { chrome: 'readonly' },
    },
    rules: {
      'no-console': 'warn',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
    },
  },
]
