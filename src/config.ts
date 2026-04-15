import { type OxlintConfig } from 'oxlint';

const config: OxlintConfig = {
  plugins: ['import', 'promise'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        'no-console': 'off',
        'jest/no-focused-tests': 'error',
        'jest/no-disabled-tests': 'warn',
      },
    },
  ],
};

export default config;
