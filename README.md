# Marco's Trattoria Website

This is a website demo for a presentation at Tech Tank TO.

The objective of this website is to showcase a website/application built with basic web technologies (HTML, CSS, and JS), without the use of frameworks.

## Project structure

- The `src` folder contains all of the files to run the project. It can be copy and pasted into any static file server and simply served.
- `.gitignore` file contains instructions to ignore anything that should not be uploaded to the git remote.
- `dprint.json` configuration for dprint (formatting tool).
- `eslint.config.mjs` configuration for eslint (linting tool).
- `package.json` and `package-lock.json` project configuration files.
  - Dependencies:
    - Types for node
    - Better types for service worker
    - Typescript
    - eslint and requires dependencies for it to work with typescript
    - dprint
    - wrangler - cloudflare's CLI tool
  - Scripts:
    - Start: run dev server (requires a local certificate for https.)
    - Deploy: upload files to cloudflare
    - Typecheck: run typescript to check for errors
    - Lint: run eslint to check for linting errors
    - Format: run dprint to format project
- `README.md` this file.
- `tsconfig.json` configuration for typescript.
- `wrangler.json` configuration for cloudflare to serve the files statically and bind it to a domain name.

## Certificates for local https server

The easiest way to generate development certificates for a local https server is using `mkcert`.
