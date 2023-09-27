# GDocs Markdown Sync Backend

This is the backend for the GDocs Markdown Sync project. It is a REST API that allows users to sync their Google Docs documents to Firestore and their content as Markdown formatted text.

## Setup

This project uses [pnpm](https://pnpm.io/) as a package manager and [Firebase](https://firebase.google.com/) as a backend.

Make sure you have [Node.js >= 18](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

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

The project uses environment variables to store sensitive information. To set them up, create a `.env.local` file based on the `.env.example` file and fill in the values.

Before deploying the project, create a `.env` file based on the `.env.example` file and fill in the values for the production environment.

## Google Drive Watch WebHook

To set up the `GDRIVE_WEBHOOK_URL` variable, you need to use a tunneling service like [ngrok](https://ngrok.com/) or [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), as Google requires the webhook URL to be publicly accessible.


## API

### onCall `/upload`

Uploads a Google Doc to Firestore, converting it to Markdown.

#### Request Body

```json
{
  "documentId": "string"
}
```

#### Response

```json
{
  "id": "documentId",
  "markdown": "markdown string",
  "title": "Name of the document"
}
```

#### Errors

- `401 Unauthorized`: If the user is not authenticated.

### onCall `/load`

Returns an array of document ids of the current user.

#### Response

```json
{
  "documentIds": ["1", "2", "3"]
}
```

#### Errors

- `401 Unauthorized`: If the user is not authenticated.

### onRequest `GET /authorize`

To be called by the frontend to get the URL to redirect to for Google OAuth 2.0.

#### Query Parameters

- `email` (required): The email of the user.

#### Response

Redirects to the Google OAuth 2.0 authorization page.

### onRequest `GET /authorizeHandler`

Exchanges a given Google OAuth 2.0 authorization code for tokens and redirects the user to the frontend confirming the authorization.

#### Query Parameters

- `code` (required): The authorization code returned by Google.
- `state` (required): The state parameter passed to the authorization URL.

#### Response

Redirects to the frontend confirming the authorization.

#### Errors

- `400 Bad Request`: If the query parameters are invalid.

### onRequest `GET /documentWebHook`

To be called by Google when a document is updated.
