import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import * as mdx from 'eslint-plugin-mdx'
import remarkMath from 'remark-math'

export default [
  {
    ignores: ['dist', 'node_modules', 'public'],
  },

  // JS / JSX
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: '18.3' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'off',
    },
  },

  // MDX / MD
  {
    ...mdx.flat,
    files: ['**/*.{md,mdx}'],
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
      remarkPlugins: [remarkMath],
    }),
    rules: {
      ...mdx.flat.rules,
      'no-unused-expressions': 'off',
      'react/jsx-no-undef': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      'no-unused-expressions': 'off',
      'no-undef': 'off',
    },
  },
]
