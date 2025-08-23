// src/services.ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

function getAccessToken() {
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
}

async function tryRefresh(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
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

/**
 * apiFetch: always returns parsed JSON
 */
async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const newToken = await tryRefresh();
    if (newToken) {
      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
      });
    }
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

/* ===================== AUTH ===================== */
export const AuthService = {
  register: (name: string, email: string, password: string) =>
    apiFetch<{ user: any; accessToken: string }>("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }).then((data) => {
      setAccessToken(data.accessToken);
      return data.user;
    }),

  login: (email: string, password: string) =>
    apiFetch<{ user: any; accessToken: string }>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      setAccessToken(data.accessToken);
      return data.user;
    }),

  logout: () => {
    setAccessToken(null);
    return apiFetch("/api/auth/logout", { method: "POST" });
  },

  me: () => apiFetch("/api/auth/me"),
};

/* ===================== MODULES ===================== */
export const ModuleService = {
  list: () => apiFetch("/api/modules"),
  getBySlug: (slug: string) => apiFetch(`/api/modules/${slug}`),
};

/* ===================== QUIZZES ===================== */
/* ===================== QUIZZES ===================== */
export const QuizService = {
  getByModuleSlug: (slug: string) => apiFetch(`/api/quiz/${slug}/quiz`),

  submit: (
    slug: string,
    answers: { questionId: string; selectedIndex: number }[],
    startTime: number // 👈 timestamp from FE
  ) => {
    const durationMs = Date.now() - startTime;
    const timeSpentMin = Math.max(1, Math.round(durationMs / 60000)); // at least 1 min

    return apiFetch(`/api/quiz/${slug}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, startTime, timeSpentMin }),
    });
  },
};

/* ===================== PROGRESS ===================== */
export const ProgressService = {
  myProgress: () => apiFetch("/api/progress/me"),

  update: (moduleId: string, progress: number, timeSpentMin?: number) =>
    apiFetch("/api/progress/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, progress, timeSpentMin }),
    }),
};
