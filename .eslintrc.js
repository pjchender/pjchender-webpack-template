module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'simple-import-sort'],
  rules: {
    // https://github.com/lydell/eslint-plugin-simple-import-sort
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',

    // new JSX transform
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    'import/prefer-default-export': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          '@': './src/',
        },
        extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.json'],
      },
    },
  },
};
