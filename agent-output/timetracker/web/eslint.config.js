export default [
  {
    languageOptions: {
      globals: {
        React: 'readonly'
      }
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
]
