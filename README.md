# GameTrust Frontend

Next.js 16 frontend for GameTrust. It is connected to the Spring Boot API for authentication, player discovery, matchmaking, tournaments, clans, reputation, and social data.

## Run

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`. The backend must be available at `http://localhost:5000` and MongoDB must be running.

To override the backend URL, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API integration

- Axios automatically attaches the access token from local storage.
- Spring Boot `{ success, message, data }` envelopes are unwrapped centrally.
- A `401` triggers one refresh-token rotation and retries the original request.
- Failed refresh clears the local session.
- Login, registration, session restore, logout, and navbar identity use the shared `AuthProvider`.
- Public screens load seeded data from MongoDB-backed APIs.
- Matchmaking, invitations, tournament registration, clan join requests, social posting, and likes call authenticated APIs and no longer report fake success.

Development accounts seeded by the backend:

| Role | Username | Password |
|---|---|---|
| MEMBER | `demo` | `Demo123!` |
| ADMIN | `admin` | `Admin123!` |

## Validation

```powershell
npm.cmd run build
npm.cmd run lint
```

The production build checks all App Router pages: `/`, `/squad-finder`, `/tournament`, `/clan`, and `/reputation`.
