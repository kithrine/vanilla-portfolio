# CI/CD Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions CI/CD pipeline that lints HTML/CSS on every push and PR, and deploys to GitHub Pages on every push to `main`.

**Architecture:** One workflow file with two jobs — `lint` (runs everywhere) and `deploy` (runs on `main` only, blocked until lint passes). No build step; the repo root is uploaded as the static site artifact.

**Tech Stack:** GitHub Actions, htmlhint, stylelint, stylelint-config-standard, actions/deploy-pages

---

### Task 1: Add HTMLHint config and verify it passes

**Files:**
- Create: `.htmlhintrc`

- [ ] **Step 1: Install htmlhint locally**

```bash
npm init -y
npm install --save-dev htmlhint
```

- [ ] **Step 2: Create `.htmlhintrc`**

```json
{
  "doctype-first": true,
  "doctype-html5": true,
  "title-require": true,
  "attr-no-duplication": true,
  "id-unique": true,
  "src-not-empty": true,
  "alt-require": true,
  "spec-char-escape": true,
  "attr-unsafe-chars": true,
  "style-disabled": false,
  "inline-style-disabled": false,
  "id-class-value": false
}
```

- [ ] **Step 3: Run htmlhint and verify it passes**

```bash
npx htmlhint index.html
```

Expected output: `Scanned 1 file, no errors found`

If errors appear, fix them in `index.html` before continuing. Common fixes:
- Missing `alt` attribute on `<img>` tags: add `alt="description"`
- Duplicate `id` attributes: rename one

- [ ] **Step 4: Commit**

```bash
git add .htmlhintrc package.json package-lock.json
git commit -m "chore: add htmlhint config"
```

---

### Task 2: Add Stylelint config and verify it passes

**Files:**
- Create: `.stylelintrc.json`

- [ ] **Step 1: Install stylelint**

```bash
npm install --save-dev stylelint stylelint-config-standard
```

- [ ] **Step 2: Create `.stylelintrc.json`**

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "no-descending-specificity": null,
    "alpha-value-notation": null,
    "color-function-notation": null
  }
}
```

The disabled rules prevent false positives from the existing CSS style (section-divider comments, CSS variable declarations, and legacy `rgba()` notation).

- [ ] **Step 3: Run stylelint and verify it passes**

```bash
npx stylelint style.css
```

Expected output: no output and exit code 0.

If errors appear, either fix the CSS or add the offending rule to the `rules` block in `.stylelintrc.json` with `null` to disable it. Do not disable rules that catch real bugs (e.g. `color-no-invalid-hex`).

- [ ] **Step 4: Commit**

```bash
git add .stylelintrc.json package.json package-lock.json
git commit -m "chore: add stylelint config"
```

---

### Task 3: Add the GitHub Actions workflow

**Files:**
- Create: `.github/workflows/ci-cd.yml`

- [ ] **Step 1: Create the workflow directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create `.github/workflows/ci-cd.yml`**

```yaml
name: CI/CD

on:
  push:
  pull_request:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: HTMLHint
        run: npx htmlhint index.html

      - name: Stylelint
        run: npx stylelint style.css

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: lint
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/ci-cd.yml
git commit -m "ci: add lint and GitHub Pages deploy workflow"
git push origin main
```

---

### Task 4: Enable GitHub Pages source and verify

**Files:** none (GitHub UI step)

- [ ] **Step 1: Enable GitHub Actions as the Pages source**

1. Open `https://github.com/kithrine/vanilla-portfolio/settings/pages`
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Click **Save**

- [ ] **Step 2: Verify the pipeline ran green**

```bash
gh run list --limit 3
```

Expected: the most recent run shows `completed` with status `success` for both `Lint` and `Deploy to GitHub Pages` jobs.

If the `lint` job fails, check the error output:
```bash
gh run view --log-failed
```

- [ ] **Step 3: Verify the live site**

Open `https://kithrine.github.io/vanilla-portfolio` in a browser. The portfolio should load.
