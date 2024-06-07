const { error } = require('console')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ecmaFeatures: {
    impliedStrict: true, //常にStrictMode
  },
  rules: {
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'prefer-template': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-unreachable': ['error'], //到達できないコードはエラー
    'no-console': ['error'],
    'no-dupe-else-if': ['error'],
    'no-restricted-syntax': [
      'error',
      {
        selector: "VariableDeclaration[kind='let']",
        message: 'Use const or var instead of let.',
      },
      'error',
      {
        selector: "variableDeclaration[kind='var']",
        message: 'Use const instead of var.',
      },
      'error',
      {
        selector: "variableDeclaration[kind='while']",
        message: 'Use map instead of while.',
      },
      'error',
      {
        selector: "variableDeclaration[kind='for']",
        message: 'Use map instead of for.',
      },
      {
        selector: 'IfStatement > BlockStatement ~ ElseIfStatement',
        message: 'Avoid using else if.',
      },
      {
        selector: 'IfStatement > BlockStatement ~ BlockStatement',
        message: 'Avoid using else.',
      },
      {
        selector: 'IfStatement > BlockStatement ~ IfStatement',
        message: 'Avoid using else if.',
      },
    ],
  },
}
