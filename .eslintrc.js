module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  plugins: ['jsx-a11y', 'import'],
  rules: {
    'no-console': 'off',
    // 'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  globals: {
    chrome: 'readonly',
  },
};
