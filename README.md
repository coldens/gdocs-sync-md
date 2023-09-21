# GDocs Markdown Sync

## Description

The theme of this project is to import documents from GDocs and store them as Markdown in Firestore. The main challenge of the project will be to access the Google API and manage the authentication process.

## Setup

Make sure you have [Node.js >= 18](https://nodejs.org/) and [Firebase CLI](https://firebase.google.com/docs/cli/) installed.

To create storage.rules for the storage emulator, use `firebase init` and select storage in the list of features to set up:

```bash
firebase init emulators
```

Then run the following commands:

```bash
# Run emulators
firebase emulators:start
```

## Structure

The project is divided into two parts:

- The frontend, which is a React application, located in the `frontend` folder.
- The backend, which is a Firebase project, located in the `functions` folder.

Both parts are deployed together using the Firebase CLI, and they have their own readme files.
