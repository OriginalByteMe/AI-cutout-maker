## Completion checklist
- Run formatting (`yarn prettier:write` if code changes) and lint (`yarn lint`).
- Type-check with `yarn typecheck` for TS safety.
- Run tests (`yarn jest` or `yarn test`) if logic/components affected.
- For UI changes, consider Storybook spot-checks where components exist.
- Ensure Mantine theming/color scheme respected and Tailwind classes consistent.
- Update documentation/comments when logic is non-obvious; keep files under control per user rule.
