# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An ESLint plugin that enforces best practices for [react-hook-form](https://github.com/react-hook-form/react-hook-form). Written in plain JavaScript (CommonJS, no TypeScript, no build step).

## Commands

- **Run all tests:** `npm test` (runs `mocha tests --recursive`)
- **Run a single test file:** `npx mocha tests/lib/rules/<rule-name>.js`
- **Lint:** No linter is configured for this project itself.

## Architecture

The plugin uses the standard ESLint plugin structure with no build step — source files in `lib/` are the published artifacts.

- **`lib/index.js`** — Plugin entry point. Uses `requireindex` to auto-discover all rules from `lib/rules/`. Defines two config presets: `recommended` and `react-compiler`.
- **`lib/rules/`** — One file per ESLint rule. Each exports a standard ESLint rule object with `meta` (type, docs, messages) and `create(context)` returning AST visitor methods.
- **`lib/utils/`** — Shared helpers used across rules (e.g., `findPropertyByName` for extracting destructured properties from AST nodes).
- **`tests/lib/rules/`** — One test file per rule using ESLint's `RuleTester` with mocha. Tests use a `normalizeIndent` tagged template helper from `tests/lib/utils/`.
- **`docs/rules/`** — One markdown doc per rule.

## Current Rules

| Rule | In `recommended` | Fixable |
|------|:-:|:-:|
| `destructuring-formstate` | Yes | No |
| `no-access-control` | Yes | No |
| `no-nested-object-setvalue` | Yes | Yes |
| `no-use-watch` | No (in `react-compiler` config) | No |

## Adding a New Rule

1. Create `lib/rules/<rule-name>.js` — it will be auto-discovered by `requireindex`.
2. Create `tests/lib/rules/<rule-name>.js` using `RuleTester`.
3. Create `docs/rules/<rule-name>.md`.
4. Add the rule to the appropriate config in `lib/index.js` if it should be in a preset.
5. Update the Supported Rules table in `README.md`.

## Git & PR Guidelines

- Do NOT include `Co-Authored-By` lines in commit or PR messages.
