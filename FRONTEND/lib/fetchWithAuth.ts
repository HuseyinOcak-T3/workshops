// lib/fetchWithAuth.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  let access = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  if (!access) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Yetkilendirme token'ı bulunamadı.");
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", `Bearer ${access}`);

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
    if (!refresh) {
      localStorage.clear();
      window.location.href = "/login?session_expired=true"; // Yönlendirme sebebi eklendi
      throw new Error("Oturum süresi doldu, yenileme token'ı bulunamadı.");
    }
    const refreshRes = await fetch(`http://localhost:8000/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const newTokens = await refreshRes.json();
      access = newTokens.access;
      if (access) {
        localStorage.setItem("access", access);
      }

      headers.set("Authorization", `Bearer ${access}`);
      response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    } else {
      localStorage.clear();
      window.location.href = "/login?session_expired=true"; // Yönlendirme sebebi eklendi
      throw new Error("Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status} - ${response.statusText}` }));
    throw new Error(errorData.detail || "API isteği sırasında bir hata oluştu.");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}