# Viode

Viode is a full-stack video streaming platform inspired by YouTube. It uses a React + Tailwind frontend, an Express backend, JWT authentication, local JSON data storage, and Cloudinary-ready media hosting for playback.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Multer, JWT
- Data store: local JSON file
- Media hosting: Cloudinary when configured, local fallback in development

## Pages

- Home
- Player
- Login
- Playlist
- Account

## Features

- Register and log in with JWT authentication
- Upload videos and optional thumbnails
- Store videos locally on disk
- Stream videos with HTTP range requests
- Create playlists and save or remove videos
- Browse the latest videos and view your uploads

## Project Structure

```text
client/   React frontend
server/   Express API, MongoDB models, upload + stream logic
```

## Environment Setup

Create these files before running the app:

### `server/.env`

```env
PORT=5000
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173,https://your-site.pages.dev
OWNER_EMAIL=your-gmail@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### `client/.env`

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_ORIGIN=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Install Dependencies

If PowerShell blocks `npm`, use `npm.cmd` instead.

```bash
npm.cmd install
npm.cmd --prefix server install
npm.cmd --prefix client install
```

You can also install from each folder directly:

```bash
cd server
npm.cmd install

cd ../client
npm.cmd install
```

## Run the App

```bash
npm.cmd --prefix server run dev
npm.cmd --prefix client run dev
```

The frontend runs on `http://localhost:5173`.

The API runs on `http://localhost:5000`.

## Google Login Setup

This project now includes Google Sign-In using Google Identity Services in the frontend and server-side ID token verification in the backend.

1. Create an OAuth 2.0 Web application client in Google Cloud.
2. Add your local frontend origins, such as:
   - `http://127.0.0.1:5173`
   - `http://localhost:5173`
3. Copy the Google client ID into:
   - `server/.env` as `GOOGLE_CLIENT_ID`
   - `client/.env` as `VITE_GOOGLE_CLIENT_ID`
4. Restart the server and client.

After that, the login page will show a Google button.

## Owner-Only Uploads

Set `OWNER_EMAIL` in `server/.env` to the Gmail address that should be allowed to upload videos.

- That one owner account can upload videos.
- Other signed-in users can only watch, save playlists, and keep their own watch history.

## Cloudinary Setup

For real hosting, configure these values in `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

When they are set:

- uploaded videos go to Cloudinary
- thumbnails can also come from Cloudinary
- the player streams from hosted URLs instead of your laptop disk

If they are blank, local development still falls back to `server/storage`.

## Hosting Flow

Recommended setup:

1. Push the repo to GitHub.
2. Deploy the backend to Render from the `server` folder.
3. Deploy the frontend to Cloudflare Pages from the `client` folder.
4. In Cloudflare Pages, set:
   - `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`
   - `VITE_BACKEND_ORIGIN=https://your-render-service.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com`
5. In Render, set:
   - `JWT_SECRET`
   - `OWNER_EMAIL`
   - `GOOGLE_CLIENT_ID`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL=https://your-site.pages.dev`

## Important Hosting Note

Video files are now cloud-ready with Cloudinary, but user accounts, playlists, and watch history still use `server/storage/data.json`.

That is fine for local development, but for fully reliable production hosting you should later move this metadata to a real database such as MongoDB Atlas or Supabase.

## GitHub Pages Note

GitHub Pages can only host the frontend, not the Express backend.

- The frontend build output is `client/dist`
- The backend must still be hosted somewhere else, such as Render

This repo now includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that publishes the frontend correctly to GitHub Pages and adds a `404.html` fallback for React routes.

## Important API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/users/me`

### Videos

- `GET /api/videos`
- `GET /api/videos/mine`
- `GET /api/videos/:id`
- `GET /api/videos/:id/stream`
- `POST /api/videos/upload`
- `POST /api/videos/:id/view`

### Playlists

- `GET /api/playlists`
- `POST /api/playlists`
- `GET /api/playlists/:id`
- `PATCH /api/playlists/:id/videos/:videoId`

## Streaming Notes

The player uses `GET /api/videos/:id/stream`, which supports byte-range requests. This improves playback because browsers can seek through large files without downloading the entire video first.

## Beginner-Friendly Notes

- Backend code is split into routes, controllers, middleware, and utilities.
- Frontend code keeps state close to the page that uses it.
- The auth flow is intentionally simple: store the JWT, attach it to requests, and refresh the profile when the app boots.
- Account data, playlists, and video metadata live in `server/storage/data.json`, so you do not need MongoDB.
