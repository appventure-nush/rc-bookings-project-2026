# How the code is organised

## Backend (`src/backend`)

When a request comes in, `app.js` checks its origin and passes it to one of the route files. The route checks the user's session and role (`auth.js`), applies the booking rules (`domain.js`), saves the change (`store.js`), and sends live updates if needed (`realtime.js`).

| File | What it does |
| --- | --- |
| `main.js` | Starts the server and prints the API URL, the WebSocket URL, and whether Microsoft sign-in is configured. |
| `app.js` | Builds the app: loads config, creates each module, checks the request origin, registers the routes and handles errors. |
| `config.js` | Loads `.env` and validates the settings. Also defines the list of valid booking statuses. |
| `auth.js` | Creates login sessions, reads the session cookie, expires old sessions, and does the "must be logged in" and "must have role X" checks. |
| `microsoft-auth.js` | Everything to do with Microsoft: builds the sign-in link, verifies the reply, and issues a one-time code that hands the result to the frontend. |
| `routes/auth.js` | Sign-in, sign-out, "who am I", the teacher list, and admin user management. Also decides a new user's role. |
| `routes/congresses.js` | Viewing congresses and their sessions (timeslots), and creating and editing them (admin only). |
| `routes/bookings.js` | All booking actions: create, edit, submit, review, cancel and list. |
| `domain.js` | Booking rules shared between routes: who may see a booking, how capacity is counted, and whether a session selection is valid. |
| `realtime.js` | The WebSocket server: authenticates connections, sends events and runs the heartbeat. |
| `store.js` | Reads and writes `data/database.json`, and seeds three demo users if the file does not exist. |
| `errors.js` | The `ApiError` class, safe JSON body reading, and the single error response format. |
| `logger.js` | Prints one line to the server console for every important action. |
| `utils.js` | Small helpers: the current timestamp, date parsing, and stripping private fields off a user. |
| `contracts.ts` | TypeScript definitions of the API request and response shapes and the WebSocket events. |
| `scripts/set-role.js` | Command-line tool to change a user's role or assigned teacher. |
| `.env.example` | Template for `.env`. |
| `.env` | Your local settings, including the Microsoft client secret. **Never commit this file.** It is listed in `.gitignore`. |

## Design decisions

### Seats are counted only on approval

Capacity counts only approved bookings (`approvedCount` in `domain.js`). A submitted request does not hold a place, so many students can ask for the same session. Whoever is approved first gets the place, and approving the others fails with `SESSION_FULL`. The `ignoredBookingId` argument lets a booking recheck its own sessions without counting itself.

### Teachers can't see drafts

`canSeeBooking` in `domain.js` deliberately hides drafts from teachers. An unfinished booking is private to the student until they submit it.

### Hidden bookings return 404, not 403

When a user asks for a booking they are not allowed to see, the routes reply `404` rather than `403`, so the API never reveals that the booking exists.

### Selection errors are returned, not thrown

`validateBookingSelection` in `domain.js` returns an error object instead of throwing, because callers report the same problem with different HTTP codes: `400` when creating or editing a booking, `409` when submitting or approving one.

### All data lives in one JSON file

The server reads `data/database.json` once at startup, keeps it in memory, and rewrites the whole file after every change. If you edit the file, or run `scripts/set-role.js`, while the server is running, your changes are overwritten on the server's next save. Stop the server first.

## Frontend (`src/frontend`)

| File | What it does |
| --- | --- |
| `index.html` | The page shell. Contains the `root` element and loads `src/main.jsx`. |
| `src/main.jsx` | Mounts the `App` component into the page and loads the styles. |
| `src/App.jsx` | The whole interface: the header with the version number and log-out button, the sidebar, and the three student panels. |
| `src/App.css` | Styles for the layout, sidebar, form fields and table. |
| `vite.config.js` | Vite setup with the React plugin. |

### Current state

- **Log in with Microsoft** only switches a local `isLoggedIn` flag. It does not sign in yet.
- **Request Booking** asks for a teacher's name and a date. The backend needs a teacher ID and session IDs instead, so the form will need pickers for both.
- **Status of current request** and **Past applications** show hard-coded example data from the `OPTIONS` object in `App.jsx`. The `TODO` comments mark where backend data should go.
- There are no teacher or admin screens yet.

[Back to contents](README.md)
