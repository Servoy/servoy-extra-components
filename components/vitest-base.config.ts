import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ['file-saver', 'ngx-filesaver', '@servoy/ngx-lightbox']
    },
    coverage: {
      // Reporters are honored from this config by the Angular unit-test builder.
      // NOTE: coverage include/exclude are NOT read from here by the builder —
      // they must be passed as --coverage-include / --coverage-exclude CLI flags
      // (see the "test:coverage" script in package.json).
      reporter: ['text-summary', 'json-summary', 'lcov', 'cobertura']
    }
  }
});
