const RAW = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const API = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

function abs(urlOrPath: string) {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;

  const clean = urlOrPath.replace(/^\/+/, "");
  const path = clean.startsWith("api/") ? clean.slice(4) : clean;
  return `${API}/${path}`;
}

async function ensureJson(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

export async function fetchWithAuth(urlOrPath: string, init: RequestInit = {}) {
  if (typeof window === "undefined") throw new Error("client-side kullan");
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  if (!access) {
    window.location.href = "/login";
    throw new Error("Token yok");
  }

  const url = abs(urlOrPath);

  const baseHeaders: HeadersInit = {
    ...(init.headers || {}),
    Authorization: `Bearer ${access}`,
  };
  if (init.body && !("Content-Type" in (init.headers || {}))) {
    (baseHeaders as any)["Content-Type"] = "application/json";
  }

  let res = await fetch(url, { ...init, headers: baseHeaders });

  if (res.status === 401 && refresh) {
    const r = await fetch(`${API}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!r.ok) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      throw new Error("Oturum süresi doldu");
    }

    const data = await r.json();
    access = data?.access;
    if (!access) throw new Error("Access token alınamadı");
    localStorage.setItem("access", access);

    const retryHeaders: HeadersInit = {
      ...(init.headers || {}),
      Authorization: `Bearer ${access}`,
    };
    if (init.body && !("Content-Type" in (init.headers || {}))) {
      (retryHeaders as any)["Content-Type"] = "application/json";
    }

    res = await fetch(url, { ...init, headers: retryHeaders });
  }

  return res;
}

export async function fetchJson(urlOrPath: string, init: RequestInit = {}) {
  const res = await fetchWithAuth(urlOrPath, init);
  return ensureJson(res);
}

export { API };