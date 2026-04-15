# oxlint-config-issue

Minimal reproduction of an `extends` issue in oxlint where inherited configuration from an extended config is silently ignored.

## Setup

```bash
bun install
```

## The issue

`oxlint.config.ts` uses `extends` to inherit configuration from `./src/config.ts`:

```ts
// oxlint.config.ts
import { defineConfig } from 'oxlint';
import demo from './src/config.ts';

export default defineConfig({
  extends: [demo],
});
```

The extended config (`src/config.ts`) is deliberately minimal — it sets two rules and adds the `import` and `promise` plugins:

```ts
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
```

**Note:** `rules` from the extended config are applied correctly. However, `plugins` and `overrides` are silently ignored.

## Steps to reproduce

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run `--print-config` to inspect the resolved configuration:
   ```bash
   bunx oxlint --print-config --config ./oxlint.config.ts
   ```

3. Check the output for `plugins` and the configured rules.

## Expected behavior

- `plugins` should include `import` and `promise`
- `no-console` should be `"deny"` (error) — **works**
- `no-debugger` should be `"deny"` (error) — **works**
- Test file overrides should be present: `jest` plugin enabled, `no-console` off, `jest/no-focused-tests` as error, `jest/no-disabled-tests` as warn

## Actual behavior

- **`rules`: works** — `no-console` and `no-debugger` are correctly inherited from the extended config
- **`plugins`: broken** — `import` and `promise` are missing; only the defaults (`unicorn`, `typescript`, `oxc`) appear
- **`overrides`: broken** — test file overrides are completely missing from the resolved config

## Environment

- oxlint: 1.58.0
- bun: see `bun.lock`
- OS: macOS
