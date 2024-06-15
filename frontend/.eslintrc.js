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
    impliedStrict: true, // 常にStrictMode
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
    'no-unreachable': 'error', // 到達できないコードはエラー
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-dupe-else-if': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: "VariableDeclaration[kind='let']",
        message: 'Use const instead of let.',
      },
      {
        selector: "VariableDeclaration[kind='var']",
        message: 'Use const instead of var.',
      },
      {
        selector: 'WhileStatement',
        message: 'Use map instead of while.',
      },
      {
        selector: 'ForStatement',
        message: 'Use map instead of for.',
      },
      {
        selector: 'IfStatement > BlockStatement ~ IfStatement',
        message: 'Avoid using else if.',
      },
      {
        selector: 'IfStatement > BlockStatement ~ BlockStatement',
        message: 'Avoid using else.',
      },
    ],
  },
}
