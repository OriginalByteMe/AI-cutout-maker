import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'coverage/**', 'next-env.d.ts']),
  nextVitals,
  nextTypescript,
]);
