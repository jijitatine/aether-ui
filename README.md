# Aether UI

Framework-independent, Apple-inspired design system with shared tokens, component contracts and AI guidance. Original design, not an Apple component clone.

## Quick start

```bash
python3 scripts/build_css.py
python3 -m unittest discover -s tests
```

Open `apps/playground/index.html` in a browser. The playground loads generated CSS from `packages/tokens-css/tokens.css`; rebuild after token edits.

## Structure

- `tokens/`: core, semantic light/dark and component tokens (DTCG-style)
- `specifications/`: framework-neutral component and UX contracts
- `packages/tokens-css/`: generated CSS custom properties
- `packages/angular`, `packages/react`, `packages/swift`: adapter integration notes; implementations are planned, not falsely presented as complete
- `ai/`, `AGENTS.md`, `CLAUDE.md`: shared AI rules
- `apps/playground`: standalone HTML/CSS/JS demo

## Design decisions

Semantic colors are theme-specific. Component contracts govern behavior and accessibility. No hardcoded visual values in application components. Colors are initial design proposals and must be contrast-audited for each usage context.

## GitHub Pages (free hosting)

1. Create a **public** GitHub repository named `aether-ui` and upload the contents of this folder to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/docs`, then save.
4. Visit `https://YOUR-USERNAME.github.io/aether-ui/` after deployment.

The publishable static site lives in `docs/`. The playground source lives in `apps/playground/`. When editing the playground or regenerating tokens, synchronize `docs/index.html` and `docs/tokens.css` using `python3 scripts/prepare_pages.py`.
