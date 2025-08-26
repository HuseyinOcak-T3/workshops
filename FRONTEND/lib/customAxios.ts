import axios from "axios";

const BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000") + "/api";

const custom_axios = axios.create({
  baseURL: BASE,
  withCredentials: false,
  timeout: 10000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

custom_axios.interceptors.request.use((config) => {
  const u = config.url || "";
  if (u && !/^https?:\/\//i.test(u)) {
    const [path, qs] = u.split("?");
    const normalized = path.endsWith("/") ? path : `${path}/`;
    config.url = qs ? `${normalized}?${qs}` : normalized;
  }
  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (token) {
    (config.headers as any) = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }
  return config;
});

let isRefreshing = false;
let waiters: Array<(t: string | null) => void> = [];

custom_axios.interceptors.response.use(
  (r) => r,
  async (err) => {
    const status = err?.response?.status;
    const original = err.config as any;

    if (status === 401 && !original?._retry) {
      original._retry = true;

      const wake = (t: string | null) => { waiters.forEach((w) => w(t)); waiters = []; };

      if (!isRefreshing) {
        isRefreshing = true;
        const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
        try {
          const res = await axios.post(
            `${BASE}/token/refresh/`,
            { refresh },
            { headers: { "Content-Type": "application/json" } }
          );
          const newAccess = res.data?.access as string | undefined;
          if (!newAccess) throw new Error("no access");
          localStorage.setItem("access", newAccess);
          isRefreshing = false;
          wake(newAccess);
        } catch {
          isRefreshing = false;
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          wake(null);
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve, reject) => {
        waiters.push(async (token) => {
          if (!token) return reject(err);
          (original.headers as any) = { ...(original.headers || {}), Authorization: `Bearer ${token}` };
          try {
            resolve(await custom_axios(original));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    return Promise.reject(err);
  }
);

export default custom_axios;