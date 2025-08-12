// lib/fetchWithAuth.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let access = localStorage.getItem("access")
  const refresh = localStorage.getItem("refresh")

  if (!access) throw new Error("Token bulunamadı")

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  })

  // Token süresi dolmuşsa yenile
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${API}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })

    if (refreshRes.ok) {
      const newTokens = await refreshRes.json()
      access = newTokens.access
      localStorage.setItem("access", access)

      // Yenilenmiş token ile isteği tekrar yap
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${access}`,
        },
      })
    } else {
      // Refresh token da geçersizse çıkış yap
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      window.location.href = "/login"
    }
  }

  return res
}
