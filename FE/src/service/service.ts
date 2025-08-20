const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type LoginResponse = {
  user: { id: string; name: string; email: string };
  accessToken: string;
  expiresIn: string; // e.g. "15m"
};

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

export function getAccessToken() {
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
}

function parseJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload));
    return typeof json.exp === "number" ? json.exp : null; // seconds since epoch
  } catch {
    return null;
  }
}

async function tryRefresh(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight; // de-dupe
  refreshInFlight = fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include", // send httpOnly cookie
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("refresh-failed");
      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken as string;
    })
    .catch(() => {
      setAccessToken(null);
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  // attach access token if present
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers,
    credentials: "include", // so refresh endpoint works with cookies
  });

  if (res.status !== 401) return res;

  // If unauthorized, attempt refresh once and retry original request
  const newToken = await tryRefresh();
  if (!newToken) return res; // still 401 -> bubble up

  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${newToken}`);
  return fetch(`${API_URL}${input}`, {
    ...init,
    headers: retryHeaders,
    credentials: "include",
  });
}

// --- High level auth calls ---
export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // set refresh cookie
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as LoginResponse;
  setAccessToken(data.accessToken);
  return data.user;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as LoginResponse;
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  setAccessToken(null);
}

// Example protected calls:
export async function getMe() {
  const res = await apiFetch("/api/auth/me");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
