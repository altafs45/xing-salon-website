// Tests run on their own config: none of the site's build plugins (blog, SEO, dev API) are needed.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The server's JSON log lines are expected output; keep them out of the test report.
  test: { environment: 'node', include: ['tests/**/*.test.ts'], onConsoleLog: (line) => !line.startsWith('{"time"') },
});
