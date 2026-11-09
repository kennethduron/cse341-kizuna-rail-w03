import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/trips-unit.test.js', 'tests/trips-ui.test.js'],
    fileParallelism: false
  }
});
