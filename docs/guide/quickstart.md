# Setup and running locally

## What you need

- **Node.js 20.12 or newer.** Check with `node --version`.
- **Git**, to clone the repo.

## 1. Start the backend

```powershell
cd src/backend
npm install
Copy-Item .env.example .env
npm run dev
```

On Mac or Linux, use `cp .env.example .env` instead of `Copy-Item`.

When it starts, you should see:

```
RCBooking Hono backend: http://localhost:3001/api/v1
WebSocket: ws://localhost:3001/ws
Microsoft sign-in: not configured
```

The first time it runs, it creates `data/database.json` with three demo users: a student, a teacher and an admin.

## 2. Check it works

In a second terminal, sign in as the demo student and ask the server who you are:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/v1/auth/login -ContentType 'application/json' -Body '{"role":"student"}' -SessionVariable s
Invoke-RestMethod -Uri http://localhost:3001/api/v1/me -WebSession $s
```

On Mac or Linux:

```bash
curl -X POST http://localhost:3001/api/v1/auth/login -c cookies.txt -H 'Content-Type: application/json' -d '{"role":"student"}'
curl http://localhost:3001/api/v1/me -b cookies.txt
```

> [!WARNING]
> Demo login has no password. Anyone who can reach the server can sign in as an admin with it. Disable it before deploying.

## 3. Start the frontend

```powershell
cd src/frontend
npm install
npm run dev
```

Open http://localhost:5173.

## 4. Optional: Microsoft sign-in

Sign-in works without this because of the demo login. To test real Microsoft accounts:

1. Register an app in Microsoft Entra ID and add `http://localhost:3001/api/v1/auth/microsoft/callback` as a redirect URI.
2. In `src/backend/.env`, set `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET`.
3. Set `BOOTSTRAP_ADMIN_EMAIL` to your own email so your first sign-in makes you an admin.
4. Restart the backend. It should now say `Microsoft sign-in: configured`.

To change someone's role later, stop the server and run:

```powershell
npm run user:role -- someone@nushigh.edu.sg teacher
```

See [Configuration](configuration.md) for every setting.

[Back to contents](../README.md)
