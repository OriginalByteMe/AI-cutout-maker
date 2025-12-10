## Style and conventions
- Language: TypeScript + React function components; Mantine + Tailwind utility classes for styling. Keep files under ~1600 lines per user rules.
- Theming via Mantine `theme.ts`; components should respect Mantine color scheme hooks (`useMantineColorScheme`).
- ESLint: extends mantine, Next recommended, jest/testing-library. Notable rules disabled: `react/react-in-jsx-scope`, `import/extensions`.
- Formatting: Prettier 3; prefer consistent Tailwind class ordering and Mantine props over inline styles.
- Testing: Jest + Testing Library; Storybook available for isolated components.
- Imports use `@/` alias for project root (tsconfig path mapping implied).
- Documentation: add concise comments/docstrings for non-obvious logic; avoid unnecessary try/catch or extra logic (per user rules).
