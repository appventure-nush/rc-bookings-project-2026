import { useEffect, useRef, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const AUTH_ERRORS = {
  MICROSOFT_ACCESS_DENIED: "Microsoft sign-in was cancelled or denied.",
  INVALID_OAUTH_STATE: "Your sign-in request expired. Please try again.",
  MICROSOFT_SIGN_IN_FAILED: "Microsoft could not complete sign-in. Please try again.",
  INVALID_MICROSOFT_NONCE: "Microsoft sign-in could not be verified. Please try again.",
  MICROSOFT_IDENTITY_INCOMPLETE: "Microsoft did not return the account details needed to sign in.",
  MICROSOFT_NOT_CONFIGURED: "Microsoft sign-in is not configured yet. Please contact the administrator.",
  MICROSOFT_UNAVAILABLE: "Microsoft sign-in is temporarily unavailable. Please try again.",
  INVALID_EXCHANGE_CODE: "Your sign-in request expired. Please try again.",
};

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      ...options,
      credentials: "include",
      headers: options.body ? { "Content-Type": "application/json", ...options.headers } : options.headers,
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again later.");
  }

  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.message || "The request failed. Please try again.");
    error.code = data?.error?.code;
    error.status = response.status;
    throw error;
  }
  return data;
}

function authErrorMessage(error) {
  return AUTH_ERRORS[error.code] || error.message || "Sign-in failed. Please try again.";
}

const OPTIONS = {
  rb: {
    label: "Request Booking",
    fontSize: "20px",
    textContent: "Please enter the Teacher's name and Date",
  },
  socr: {
    label: "Status of current request",
    fontSize: "clamp(22px, 2.6vw, 42px)",
    //TODO: load this from the backend
    textContent:
      "Title: Example\nDate submitted: 8 Aug '26, 16:55\nCurrent status: Pending",
  },
  pa: {
    label: "Past applications",
    fontSize: "20px",
    tableContent: {
      rowCount: 5,
      heads: ["Request title", "Date", "Status"],
      //TODO: same as line 13
      rows: [
        ["Example", "8 Aug '26, 16:55", "Pending"],
        ["Example 2", "5 May '25, 23:59", "Approved"],
        ["Example 3", "6 Jul '24, 06:07", "Rejected"],
      ],
    },
  },
};

const SIDEBAR_ORDER = ["rb", "socr", "pa"];

function RequestBookingForm() {
  return (
    <>
      <p className="mainWindowText">{OPTIONS.rb.textContent}</p>
      <div className="fieldsRow">
        <input
          type="text"
          className="rcInput"
          placeholder="Teacher's name"
        />
        <input type="date" className="rcInput rcInputDate" />
        <button className="Confirm">Confirm</button>
      </div>
    </>
  );
}

function StatusOfRequest() {
  return (
    <p className="mainWindowText" style={{ fontSize: OPTIONS.socr.fontSize }}>
      {OPTIONS.socr.textContent}
    </p>
  );
}

function PastApplications() {
  const { heads, rows, rowCount } = OPTIONS.pa.tableContent;
  const paddedRows = [...rows];
  while (paddedRows.length < rowCount) {
    paddedRows.push(heads.map(() => "-"));
  }

  return (
    <table className="rcTable">
      <thead>
        <tr>
          {heads.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {paddedRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MainWindowContent({ selected }) {
  switch (selected) {
    case "rb":
      return <RequestBookingForm />;
    case "socr":
      return <StatusOfRequest />;
    case "pa":
      return <PastApplications />;
    default:
      return null;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [selected, setSelected] = useState("rb");
  const authStarted = useRef(false);
  const isLoggedIn = Boolean(user);
  const canUseApp = isLoggedIn && user.role !== "pending";

  useEffect(() => {
    // StrictMode runs effects twice in development; the exchange code can only be used once.
    if (authStarted.current) return;
    authStarted.current = true;

    async function restoreSession() {
      const url = new URL(window.location.href);
      const microsoft = url.searchParams.get("microsoft");
      const exchangeCode = url.searchParams.get("exchangeCode");
      const callbackError = url.searchParams.get("error");
      if (microsoft) {
        for (const key of ["microsoft", "exchangeCode", "error"]) url.searchParams.delete(key);
        window.history.replaceState(null, "", url.toString());
      }

      try {
        if (microsoft === "error") {
          const error = new Error("Microsoft sign-in failed. Please try again.");
          error.code = callbackError;
          throw error;
        }
        if (microsoft === "success") {
          if (!exchangeCode) throw new Error("Your sign-in request expired. Please try again.");
          const session = await apiRequest("/auth/microsoft/session", {
            method: "POST",
            body: JSON.stringify({ exchangeCode }),
          });
          setUser(session.user);
        } else {
          const session = await apiRequest("/me");
          setUser(session.user);
        }
      } catch (error) {
        if (error.status !== 401 || microsoft) setAuthError(authErrorMessage(error));
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn() {
    setAuthBusy(true);
    setAuthError("");
    try {
      const { authorizationUrl } = await apiRequest("/auth/microsoft/start", { method: "POST" });
      window.location.assign(authorizationUrl);
    } catch (error) {
      setAuthError(authErrorMessage(error));
      setAuthBusy(false);
    }
  }

  async function signOut() {
    setAuthBusy(true);
    setAuthError("");
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      setUser(null);
      setSelected("rb");
    } catch (error) {
      setAuthError(authErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <p className="pageTitle">
          <strong>Research Congress Booking</strong>
        </p>
        <div className="headerRight">
          <p className="version">Version 0.3</p>
          {isLoggedIn && (
            <button
              className="option logoutBtn"
              onClick={signOut}
              disabled={authBusy}
            >
              Log out
            </button>
          )}
        </div>
      </header>

      <div className="body">
        <div className="panel">
          <nav className="sidebar" aria-disabled={!canUseApp}>
            {SIDEBAR_ORDER.map((id) => (
              <button
                key={id}
                className={
                  "option" + (selected === id && canUseApp ? " selected" : "")
                }
                disabled={!canUseApp}
                onClick={() => setSelected(id)}
              >
                {OPTIONS[id].label}
              </button>
            ))}
          </nav>

          <div className="mainWindow">
            {authLoading ? (
              <p className="mainWindowText" role="status">Checking sign-in...</p>
            ) : isLoggedIn ? (
              canUseApp ? (
                <MainWindowContent selected={selected} />
              ) : (
                <p className="mainWindowText">Your account is awaiting administrator approval.</p>
              )
            ) : (
              <button className="option loginBtn" onClick={signIn} disabled={authBusy}>
                {authBusy ? "Opening Microsoft sign-in..." : "Log in with Microsoft"}
              </button>
            )}
            {authError && <p className="authError" role="alert">{authError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
