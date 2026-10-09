# RCBooking

RCBooking is a web app that lets NUS High students book a timeslot with a teacher to present their research project at Research Congress.

> [!NOTE]
> **Status as of 23 September 2026** (frontend v0.3, backend 1.0.0)
> The backend supports the full booking flow, admin user management and live updates. The frontend is a layout prototype for students and is not connected to the backend yet. Teacher and admin screens are not built.

## Summary

RCBooking has two parts:

- **Backend** (`src/backend`): a Node.js server built with Hono. It stores all data, enforces who can do what, and sends live updates over a WebSocket.
- **Frontend** (`src/frontend`): a React app, built with Vite, that students and teachers will use in the browser.

**What the backend supports today:** a student signs in with their NUSH Microsoft account, picks a teacher and one or more sessions, and submits a booking request. The teacher sees the requests addressed to them and approves, rejects or asks for changes, adding a comment when rejecting or asking for changes. The student can then see the booking's status and the teacher's comment.

## Contents

**Get started**
- [Setup and running locally](guide/quickstart.md)
- [Configuration](guide/configuration.md)

**Understand the code**
- [How the code is organised](architecture.md)

**API reference**
- [Overview and errors](api/index.md)
- [Bookings](api/bookings.md)
