# GDocs Markdown Sync Frontend

<!-- This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list -->

## Setup

This project uses [Vite](https://vitejs.dev/) as a bundler, [React](https://reactjs.org/) as a framework, pnpm as a package manager and [Firebase](https://firebase.google.com/) as a backend.

Make sure you have [Node.js >= 18](https://nodejs.org/), [pnpm](https://pnpm.io/) and [Firebase CLI](https://firebase.google.com/docs/cli/) installed.

To install the dependencies, run the following command:

```bash
pnpm install
```

To start the development server, run the following command:

```bash
npm run dev
```

To build the project, run the following command:

```bash
npm run build
```

To deploy the project to firebase, run the following command:

```bash
npm run deploy
```

## Environment variables

The project uses environment variables to store sensitive information. To set them up, create a `.env.development.local` file based on the `.env.example` file and fill in the values.

Before deploying the project, create a `.env.production.local` file based on the `.env.example` file and fill in the values for the production environment.
