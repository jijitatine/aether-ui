# Aether UI

A framework-independent, iOS-glass-inspired design system with shared tokens, explicit
component contracts, interactive documentation, and instructions for Claude, Codex, and
other coding agents. Aether UI is an original system, not an Apple component clone.

## Documentation

- **Visual documentation:** `docs/index.html`
- **Live site:** <https://jijitatine.github.io/aether-ui/>
- **AI integration:** [`ai/integration-guide.md`](ai/integration-guide.md)
- **Agent entry points:** [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md)

The visual documentation includes foundations, all fifteen component contracts,
interactive states, patterns, accessibility guidance, theme switching, and the Claude /
Codex context protocol.

## Quick start

```bash
python3 scripts/build_css.py
python3 scripts/prepare_pages.py
python3 -m unittest discover -s tests
```

Open `docs/index.html` to browse the complete documentation. Open
`apps/playground/index.html` for the smaller product-screen playground.

## Use with Claude or Codex

Keep the repository entry-point files in place. Codex reads `AGENTS.md`; Claude starts
with `CLAUDE.md`, which delegates to the same system contract.

Example task:

```text
Build a responsive project-creation flow using Aether UI. Read the agent instructions,
tokens, and relevant component contracts first. Include validation, loading, success,
and API error states. Report missing design-system behavior before extending it.
```

Agents are required to name the contracts used, avoid invented variants or arbitrary
values, and finish with `ai/review-checklist.md`.

## Structure

```text
tokens/                 Core, semantic, and component tokens
specifications/         Framework-neutral component and pattern contracts
packages/tokens-css/    Generated CSS custom properties
packages/angular/       Angular adapter guidance (implementation planned)
packages/react/         React adapter guidance (implementation planned)
packages/swift/         SwiftUI adapter guidance (implementation planned)
ai/                     Agent context, rules, prompts, and review checklist
docs/                   Complete GitHub Pages documentation
apps/playground/        Standalone product-screen demonstration
scripts/                Token and documentation preparation
tests/                  Source and generated-output validation
```

## Current component contracts

Button, TextField, Select, Checkbox, Toggle, Card, Tabs, Table, Dialog, NavigationBar, DatePicker, TimePicker, DateRangePicker, MenuButton, and Chip.

The contracts define API, states, behavior, keyboard interaction, accessibility, themes,
and adapter expectations. Framework packages are not presented as complete until their
implementations and tests exist.

## Design decisions

- Inter is the primary interface typeface through `font.family.primary`; consumers must
  load the font and retain the token's system fallback stack.
- Semantic, theme-aware roles are used in product UI.
- Aether Glass uses semantic translucent surfaces, blur, highlight, border, and shadow
  tokens to express navigation, overlays, floating controls, and elevated groups.
- Dense content keeps an opaque or strong surface, with fallbacks for reduced transparency
  and browsers without backdrop filtering.
- Accessibility overrides visual convenience when requirements conflict.
- Native semantics and platform idioms are preferred.
- Comfortable density is the default; compact density retains accessible targets.
- New variants and tokens require a repeatable need, a specification, documentation,
  and tests.

## GitHub Pages

The publishable static site lives in `docs/`. Configure GitHub Pages to deploy from the
`main` branch and `/docs` folder. Token generation writes both the package output and the
documentation copy, so they cannot drift.

## Status

Version **0.3** is ready for token consumption, glass-styled UI prototyping, visual reference, and
agent-assisted implementation. Angular, React, and SwiftUI adapters remain planned work.
