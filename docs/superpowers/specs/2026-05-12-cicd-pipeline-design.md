# CI/CD Pipeline — vanilla-portfolio

**Date:** 2026-05-12  
**Project:** kithrine/vanilla-portfolio  
**Deploy target:** GitHub Pages (`kithrine.github.io/vanilla-portfolio`)

---

## Overview

A single GitHub Actions workflow with two jobs: `lint` (runs on every push and PR) and `deploy` (runs on push to `main` only, blocked until `lint` passes). No build step — the repo is deployed as-is.

---

## Workflow: `.github/workflows/ci-cd.yml`

### Triggers
- `push` to any branch
- `pull_request` targeting any branch

### Job 1 — `lint`

Runs on: every push and every PR.

Steps:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20)
3. `npm install --save-dev htmlhint stylelint stylelint-config-standard`
4. `npx htmlhint index.html`
5. `npx stylelint style.css`

### Job 2 — `deploy`

Runs on: push to `main` only (`if: github.ref == 'refs/heads/main'`).  
Depends on: `lint` (`needs: lint`).

Required permissions:
```yaml
permissions:
  pages: write
  id-token: write
```

Steps:
1. `actions/checkout@v4`
2. `actions/configure-pages@v5`
3. `actions/upload-pages-artifact@v3` — uploads repo root as static site
4. `actions/deploy-pages@v4`

Environment: `github-pages` (required by the deploy action).

---

## Supporting Config Files

### `.htmlhintrc`
Permissive ruleset to avoid false positives from Tailwind CDN and inline scripts:
- Enforce `doctype-first`, `title-require`, `alt-require`
- Disable rules that conflict with Tailwind's utility approach

### `.stylelintrc.json`
Extends `stylelint-config-standard`. No custom overrides needed — standard CSS rules apply cleanly to `style.css`.

---

## Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/ci-cd.yml` | Main workflow |
| `.htmlhintrc` | HTMLHint config |
| `.stylelintrc.json` | Stylelint config |

---

## Manual Step Required

After the workflow is pushed to `main`, enable GitHub Actions as the Pages source:

1. Go to `https://github.com/kithrine/vanilla-portfolio/settings/pages`
2. Under **Source**, select **GitHub Actions**
3. Save

The next push to `main` will trigger the first deployment.

---

## Success Criteria

- `lint` job turns green on a clean push
- `deploy` job runs after `lint` and publishes to `kithrine.github.io/vanilla-portfolio`
- A PR with invalid HTML or CSS turns the pipeline red before merge
