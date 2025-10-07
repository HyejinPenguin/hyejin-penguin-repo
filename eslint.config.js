import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  // 전역 무시 패턴 - 린팅하지 않을 폴더/파일
  {
    ignores: ['dist', 'node_modules', 'build', '.vite'],
  },

  // TypeScript/TSX 파일 설정
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      // ===== JavaScript 기본 규칙 =====
      ...js.configs.recommended.rules,

      // ===== TypeScript 규칙 =====
      // 사용하지 않는 변수 경고 (단, _로 시작하는 변수는 허용)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      // any 타입 사용 시 경고
      '@typescript-eslint/no-explicit-any': 'warn',
      // console.log 사용 경고 (warn, error는 허용)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // ===== React 기본 규칙 =====
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // React 17+ 에서는 import React 불필요
      'react/react-in-jsx-scope': 'off',
      // TypeScript 사용 시 prop-types 불필요
      'react/prop-types': 'off',
      // React 17+ JSX Transform 사용
      'react/jsx-uses-react': 'off',
      // target="_blank" 사용 시 보안 경고
      'react/jsx-no-target-blank': 'warn',
      // 배열 map 사용 시 key 속성 필수
      'react/jsx-key': 'error',
      // 자식이 없는 태그는 self-closing 사용 (<div /> 형태)
      'react/self-closing-comp': 'warn',
      // 불필요한 중괄호 제거 (예: title="hello" 대신 title={"hello"} 방지)
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      // ===== React Hooks 규칙 =====
      ...reactHooks.configs.recommended.rules,
      // Hooks는 반드시 규칙에 따라 사용 (조건문/반복문 안에서 사용 금지)
      'react-hooks/rules-of-hooks': 'error',
      // useEffect 등의 의존성 배열 검사
      'react-hooks/exhaustive-deps': 'warn',

      // ===== React Refresh 규칙 (Vite HMR) =====
      // 컴포넌트만 export 하도록 권장 (HMR 최적화)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ===== Prettier 규칙 (코드 포맷팅) =====
      ...prettierConfig.rules,
      // Prettier 포맷팅 규칙 위반 시 경고
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto', // OS별 줄바꿈 자동 처리
        },
      ],
    },
  },
];
