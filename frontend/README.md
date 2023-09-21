# GDocs Markdown Sync Frontend

This is the frontend for the GDocs Markdown Sync project. It is a web application that allows users to sync their Google Docs documents to Firestore and their content as Markdown formatted text.

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
