module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint', // allow ESLint to work nicely with Prettier
  ],
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
    'no-unused-vars': ['error', 'always'],
    semi: ['error', 'always'],
    'react/prop-types': 0,
  },
  settings: {
    react: {
      version: '16',
    },
  },
};
