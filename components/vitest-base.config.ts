import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ['file-saver', 'ngx-filesaver', '@servoy/ngx-lightbox']
    }
  }
});
