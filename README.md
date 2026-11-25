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

`npm run build` compiles the Vite app and synchronizes the static output into
the repository root. Pushes to `master` are then published by the repository's
branch-based GitHub Pages configuration.

There is no `CNAME`, so the site is served from
[easydeze.github.io](https://easydeze.github.io/) until a new custom domain is
ready.
