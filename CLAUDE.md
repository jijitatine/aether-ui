# Aether UI instructions for Claude

Follow `AGENTS.md` as the primary contract. Before writing UI, read
`ai/design-system.md`, `ai/generation-rules.md`, the relevant tokens, and every
applicable component or pattern specification.

Claude must:

- name the contracts it is applying before implementation;
- distinguish existing Aether UI behavior from a proposed extension;
- avoid invented values and variants;
- keep examples framework-neutral unless a target platform is explicitly requested;
- finish with the checks performed against `ai/review-checklist.md`.

Use the reusable task shapes in `ai/prompts/`. For the complete context protocol,
read `ai/integration-guide.md`.
