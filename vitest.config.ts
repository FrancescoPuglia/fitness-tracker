import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.ts?(x)', 'tests/**/*.{test,spec}.ts?(x)'],
    exclude: ['tests/e2e/**/*'],
    coverage: { 
      reporter: ['text', 'lcov', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  }
});