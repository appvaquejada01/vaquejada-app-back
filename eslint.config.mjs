// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'only-multiline',
          generics: 'never',
          enums: 'always-multiline',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      'max-len': 'off',
      'object-curly-spacing': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'typeorm',
              importNames: ['getManager', 'getConnection'],
              message:
                'Please import getManager and getConnection from @modules/typeorm',
            },
          ],
        },
      ],
      'jest/expect-expect': [
        'warn',
        {
          assertFunctionNames: ['expect', '**.expect'],
        },
      ],
      'no-console': 'error',
      'jest/no-conditional-expect': 'off',
    },
  },
);
