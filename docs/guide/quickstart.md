# Quickstart

You need **Node.js 20.12 or newer**.

## 1. Start the backend

```bash
cd src/backend
npm install
cp .env.example .env
npm run dev
```

## 2. Sign in as the demo student

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -c cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"role": "student"}'
```

> [!WARNING]
> Demo login has no password. Disable it before deploying.

Next: [Configuration](configuration.md)
