module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react'],
  overrides: [
    {
      files: ['*.jsx', '*.js'],
    },
  ],
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
    'react/prop-types': 0,
    'react/display-name': 0,
  },
  settings: {
    react: {
      version: '16',
    },
  },
};
