# Danny Zhang's personal website

An interactive portfolio built with React, TypeScript, and Vite.

## Local development

Use Node.js 22 (see `.nvmrc`), then run:

```sh
npm install
npm run dev
```

The development server uses Vite with hot reload. Validate production changes with:

```sh
npm run typecheck
npm run build
```

## Deployment

Pushes to `master` deploy `dist/` to GitHub Pages through
`.github/workflows/deploy-pages.yml`.

The workflow explicitly clears any custom domain before deployment, so the site
is served from [easydeze.github.io](https://easydeze.github.io/). Update that
workflow when a new custom domain is ready.
